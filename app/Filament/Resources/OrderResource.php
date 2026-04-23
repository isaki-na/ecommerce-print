<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Filament\Resources\OrderResource\Pages\ViewOrder;
use App\Filament\Resources\OrderResource\RelationManagers;
use App\Models\Order;
use Filament\Forms;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    public static ?string $label = 'Venta';

    protected static ?string $pluralModelLabel = 'Ventas';

    public static function getNavigationBadge(): ?string
    {
        return 'hoy ' . static::getModel()::whereDate('created_at', now()->setTime(0, 0))->count();
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                //
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('code')->label('Codigo')->searchable(),
                TextColumn::make('data.user.name')->wrap()->searchable(),
                TextColumn::make('order_products_count')->label('Productos')->counts('order_products'),
                TextColumn::make('shipping')->label('Costo de envio')->numeric(),
                TextColumn::make('total')->label('Precio Total')->numeric(),
                TextColumn::make('status')->badge(),
                TextColumn::make('ready_at')
                    ->label('Preparacion')
                    ->badge()
                    ->state(fn(Order $record): string => $record->ready_at ? 'Listo' : 'Pendiente')
                    ->color(fn(Order $record): string => $record->ready_at ? 'success' : 'warning'),
                TextColumn::make('payment.method')->label('Tipo de pago')->badge(),
                TextColumn::make('created_at')->label('Fecha de la venta')
                    ->sortable()->dateTime()->toggleable(isToggledHiddenByDefault: false),
            ])
            ->filters([
                // SelectFilter::make('payment_type')->label('Tipo de pago')->options(SalePaymentTypeEnum::class),
                self::filtersDate(),
                self::filtersReady(),

            ])
            ->actions([
                // Tables\Actions\EditAction::make()->icon(null),
                Tables\Actions\ViewAction::make()->icon(null)->label('Ver venta'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    // Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
    public static function filtersDate()
    {
        return Filter::make('created_at')
            ->form([
                DatePicker::make('created_from')->label('Fecha desde')->native(false),
                DatePicker::make('created_until')->label('Fecha hasta')->native(false),
            ])->query(function (Builder $query, array $data): Builder {
                return $query
                    ->when(
                        $data['created_from'],
                        fn(Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                    )
                    ->when(
                        $data['created_until'],
                        fn(Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                    );
            });
    }

    public static function filtersReady()
    {
        return Filter::make('ready_state')
            ->label('Preparacion del pedido')
            ->form([
                Select::make('ready_state')
                    ->label('Estado')
                    ->options([
                        'ready' => 'Listo para entrega',
                        'pending' => 'Pendiente de preparar',
                    ]),
            ])->query(function (Builder $query, array $data): Builder {
                return $query
                    ->when(
                        ($data['ready_state'] ?? null) === 'ready',
                        fn(Builder $query): Builder => $query->whereNotNull('ready_at'),
                    )
                    ->when(
                        ($data['ready_state'] ?? null) === 'pending',
                        fn(Builder $query): Builder => $query->whereNull('ready_at'),
                    );
            });
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'create' => Pages\CreateOrder::route('/create'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
            'view' => ViewOrder::route('/{record}'),
        ];
    }
}
