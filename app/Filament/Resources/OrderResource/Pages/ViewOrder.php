<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Enums\OrderStatusEnum;
use App\Enums\StockMovementOperationEnum;
use App\Enums\PaymentMethodEnum;
use App\Filament\Resources\OrderResource;
use App\Models\Order;
use App\Models\Sku;
use App\Models\StockAdjustment;
use Filament\Actions;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TimePicker;
use Filament\Forms\Components\Toggle;
use Filament\Infolists\Components\Actions\Action;
use Filament\Infolists\Components\Grid;
use Filament\Infolists\Components\ViewEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Pages\ViewRecord;
use Illuminate\Support\Number;
use Livewire\Attributes\On;
use Filament\Infolists\Components\Actions as ComponentsActions;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;
use Filament\Notifications\Notification;
use Filament\Support\Enums\Alignment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class ViewOrder extends ViewRecord
{
    protected static string $resource = OrderResource::class;

    public function getTitle(): string
    {

        return "Venta {$this->record->code} - " . Number::currency($this->record->total);
    }

    #[On('refreshViewOrder')]
    public function refresh(): void {}

    public function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([

                Grid::make(3)
                    ->schema([
                        ComponentsActions::make([
                            Action::make('mark-successful')->label('Marcar como aceptado')
                                ->color('success')
                                ->link()
                                ->icon('heroicon-o-check-circle')
                                ->visible(fn($record) => ($record->status == OrderStatusEnum::PENDING))
                                ->modalHeading('Aceptar pedido')
                                ->modalDescription('Indica la fecha y hora en que el cliente puede recoger su pedido (hora de Ciudad de México).')
                                ->modalSubmitActionLabel('Aceptar pedido')
                                ->form([
                                    DatePicker::make('pickup_date')
                                        ->label('Fecha de recogida')
                                        ->required()
                                        ->native(true)
                                        ->minDate(now('America/Mexico_City')->toDateString())
                                        ->displayFormat('d/m/Y'),
                                    TimePicker::make('pickup_time')
                                        ->label('Hora de recogida (Ciudad de México)')
                                        ->required()
                                        ->native(true)
                                        ->extraInputAttributes([
                                            'min' => '08:00',
                                            'max' => '20:00',
                                        ])
                                        ->rules([
                                            'after_or_equal:08:00',
                                            'before_or_equal:20:00',
                                        ])
                                        ->minutesStep(15)
                                        ->seconds(false)
                                        ->helperText('La hora corresponde a la zona horaria de Ciudad de México (horario permitido: 08:00 a 20:00).'),
                                ])
                                ->action(function (array $data, Order $record) {
                                    $pickupAt = Carbon::createFromFormat(
                                        'Y-m-d H:i',
                                        $data['pickup_date'] . ' ' . $data['pickup_time'],
                                        'America/Mexico_City'
                                    );

                                    $pickupHour = $pickupAt->format('H:i');

                                    if ($pickupHour < '08:00' || $pickupHour > '20:00') {
                                        throw ValidationException::withMessages([
                                            'pickup_time' => 'La hora de recogida debe estar entre 08:00 y 20:00.',
                                        ]);
                                    }

                                    if ($pickupAt->lt(now('America/Mexico_City'))) {
                                        throw ValidationException::withMessages([
                                            'pickup_date' => 'La fecha y hora de recogida no puede ser anterior al momento actual.',
                                        ]);
                                    }

                                    $record->status = OrderStatusEnum::SUCCESSFUL;
                                    $record->pickup_at = $pickupAt->utc();
                                    $record->save();

                                    Notification::make()
                                        ->title("La venta {$record->code} fue marcada como aceptada")
                                        ->success()
                                        ->send();
                                }),

                            Action::make('mark-delivered')->label('Marcar como entregado')
                                ->color('info')
                                ->link()
                                ->icon('heroicon-o-archive-box-arrow-down')
                                ->visible(fn($record) => $record->status == OrderStatusEnum::SUCCESSFUL && $record->ready_at)
                                ->requiresConfirmation()
                                ->modalHeading('Confirmar entrega')
                                ->modalDescription('¿Confirmas que el cliente recogió su pedido?')
                                ->modalSubmitActionLabel('Sí, marcar como entregado')
                                ->action(function (Order $record) {
                                    $record->status = OrderStatusEnum::DELIVERED;
                                    $record->save();

                                    Notification::make()
                                        ->title("La venta {$record->code} fue marcada como entregada")
                                        ->success()
                                        ->send();
                                }),

                            Action::make('mark-ready')->label('Marcar como listo')
                                ->color('primary')
                                ->link()
                                ->icon('heroicon-o-check-badge')
                                ->visible(fn($record) => $record->status == OrderStatusEnum::SUCCESSFUL && !$record->ready_at)
                                ->requiresConfirmation()
                                ->modalHeading('Marcar pedido como listo')
                                ->modalDescription('Esto descontara el stock de los productos vendidos y registrara el movimiento de inventario.')
                                ->modalSubmitActionLabel('Confirmar y descontar stock')
                                ->action(function (Order $record) {
                                    try {
                                        DB::transaction(function () use ($record) {
                                            $orderProducts = $record->order_products()->get();

                                            foreach ($orderProducts as $orderProduct) {
                                                if (!$orderProduct->sku_id) {
                                                    throw new \RuntimeException("El producto {$orderProduct->name} no tiene SKU asociado.");
                                                }

                                                $sku = Sku::lockForUpdate()->find($orderProduct->sku_id);

                                                if (!$sku) {
                                                    throw new \RuntimeException("No se encontro el SKU del producto {$orderProduct->name}.");
                                                }

                                                if ((int) $sku->stock < (int) $orderProduct->quantity) {
                                                    throw new \RuntimeException("Stock insuficiente para {$orderProduct->name}. Disponible: {$sku->stock}.");
                                                }
                                            }

                                            foreach ($orderProducts as $orderProduct) {
                                                $sku = Sku::lockForUpdate()->findOrFail($orderProduct->sku_id);

                                                $sku->stock = (int) $sku->stock - (int) $orderProduct->quantity;
                                                $sku->save();

                                                StockAdjustment::create([
                                                    'quantity' => (int) $orderProduct->quantity,
                                                    'note' => 'User bought it',
                                                    'type' => StockMovementOperationEnum::SUBTRACTION,
                                                    'user_id' => auth()->id(),
                                                    'sku_id' => $sku->id,
                                                ]);
                                            }

                                            $record->ready_at = now();
                                            $record->save();
                                        });

                                        Notification::make()
                                            ->title("La venta {$record->code} fue marcada como lista")
                                            ->success()
                                            ->send();
                                    } catch (Throwable $exception) {
                                        Notification::make()
                                            ->title('No se pudo marcar la venta como lista')
                                            ->body($exception->getMessage())
                                            ->danger()
                                            ->send();
                                    }
                                }),

                            Action::make('status-change')->label('Cancelar Compra')
                                ->color('danger')
                                ->link()
                                ->icon('heroicon-o-x-circle')
                                ->visible(fn($record) => in_array($record->status, [OrderStatusEnum::PENDING, OrderStatusEnum::SUCCESSFUL], true) && !$record->ready_at)

                                ->requiresConfirmation()
                                ->modalIcon('heroicon-o-x-circle')
                                ->form([
                                    Toggle::make('refund')
                                        ->label(fn(Order $record) => 'Rembolsar dinero ' . Number::currency($record->total))
                                        ->onColor('danger')
                                        ->visible(fn(Order $record) => $record->status == OrderStatusEnum::SUCCESSFUL)
                                        ->default(false),
                                ])
                                ->action(function (array $data, Order $record) {
                                    if (($data['refund'] ?? false) === true) {
                                        $record->status = OrderStatusEnum::REFUNDED;
                                    } else {
                                        $record->status = OrderStatusEnum::CANCELLED;
                                    }
                                    $record->refund_at = now();
                                    $record->save();
                                    Notification::make()
                                        ->title("La venta {$record->code} " . Number::currency($record->total) . " fue cancelada")
                                        ->success()
                                        ->send();
                                }),


                        ])->columns(4)->columnStart(2)->alignment(Alignment::End),
                        Section::make([

                            TextEntry::make('data.user.name')->label('Cliente'),
                            TextEntry::make('data.user.phone')->label('Telefono'),
                            TextEntry::make('data.user.email')->label('Email'),
                            TextEntry::make('status')->label('Estado')->badge(),

                            ViewEntry::make('order_products')->columnSpanFull()->view('filament.infolists.sales-view')
                        ])
                            ->columnSpan(2)
                            ->columns(4),

                        Grid::make(1)

                            ->columnSpan(1)
                            ->schema([
                                Section::make([
                                    TextEntry::make('created_at')->label('Fecha de  la venta')->dateTime('d/m/Y H:i'),
                                    TextEntry::make('refund_at')->visible(fn($state) => $state)->label('Fecha de devolucion')->dateTime('d/m/Y H:i'),
                                    TextEntry::make('pickup_at')
                                        ->label('Fecha y hora de recogida')
                                        ->visible(fn($state) => $state)
                                        ->dateTime('d/m/Y H:i', timezone: 'America/Mexico_City')
                                        ->helperText('Hora de Ciudad de México'),
                                    TextEntry::make('ready_at')
                                        ->label('Fecha en que se marco como listo')
                                        ->visible(fn($state) => $state)
                                        ->dateTime('d/m/Y H:i'),

                                ])->columnSpan(1),

                                Section::make('Pago')
                                    ->columns(2)
                                    ->schema([
                                        TextEntry::make('payment.method')->badge()->label('Metodo de pago'),
                                        TextEntry::make('payment.reference')->label('Referencia'),
                                        TextEntry::make('payment.note')->columnSpanFull()->label('Observacion')->placeholder('- sin observacion')
                                    ]),
                            ])
                    ]),



            ]);
    }
}

