<?php

namespace App\Filament\Pages;

use App\Services\SettingService;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class StoreSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationLabel = 'Configuración tienda';

    protected static ?string $title = 'Configuración de la tienda';

    protected static ?int $navigationSort = 99;

    protected static string $view = 'filament.pages.store-settings';

    public static function canAccess(): bool
    {
        return auth()->user()?->hasRole('admin') ?? false;
    }

    public ?array $data = [];

    public function mount(): void
    {
        $settings = SettingService::data();

        $this->form->fill([
            'maps_link' => data_get($settings, 'store.maps_link', ''),
        ]);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Ubicación de la tienda')
                    ->description('Esta información se muestra automáticamente al cliente cuando su pedido es aceptado.')
                    ->schema([
                        TextInput::make('maps_link')
                            ->label('Enlace de Google Maps')
                            ->url()
                            ->placeholder('https://maps.google.com/?q=...')
                            ->helperText('Copia el enlace desde Google Maps. Se enviará al cliente junto con la fecha y hora de recogida.')
                            ->columnSpanFull(),
                    ]),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $formData = $this->form->getState();

        $settings = SettingService::data();
        $settings['store'] = array_merge($settings['store'] ?? [], [
            'maps_link' => $formData['maps_link'],
        ]);

        SettingService::put($settings);

        Notification::make()
            ->title('Configuración guardada correctamente')
            ->success()
            ->send();
    }
}
