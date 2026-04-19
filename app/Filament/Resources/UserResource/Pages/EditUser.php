<?php

namespace App\Filament\Resources\UserResource\Pages;

use App\Filament\Resources\UserResource;
use Filament\Notifications\Notification;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Auth;

class EditUser extends EditRecord
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('assign-admin-role')
                ->label('Hacer admin')
                ->icon('heroicon-o-shield-check')
                ->color('warning')
                ->visible(fn(): bool => ! $this->record->hasRole('admin'))
                ->requiresConfirmation()
                ->modalHeading('Otorgar acceso de administrador')
                ->modalDescription('Este usuario podra entrar al panel de administracion y gestionar la informacion de la tienda. Confirma solo si necesita acceso administrativo completo.')
                ->modalIcon('heroicon-o-exclamation-triangle')
                ->modalSubmitActionLabel('Si, convertir en admin')
                ->action(function (): void {
                    $this->record->syncRoles(['admin']);

                    Notification::make()
                        ->title("{$this->record->name} ahora tiene acceso de administrador")
                        ->success()
                        ->send();

                    $this->redirect(static::getResource()::getUrl('edit', ['record' => $this->record]));
                }),
            Actions\Action::make('remove-admin-role')
                ->label('Quitar admin')
                ->icon('heroicon-o-no-symbol')
                ->color('gray')
                ->visible(fn(): bool => $this->record->hasRole('admin') && $this->record->isNot(Auth::user()))
                ->requiresConfirmation()
                ->modalHeading('Retirar acceso de administrador')
                ->modalDescription('El usuario perdera acceso al panel de administracion y volvera a tener un rol de cliente.')
                ->modalIcon('heroicon-o-exclamation-triangle')
                ->modalSubmitActionLabel('Si, quitar acceso')
                ->action(function (): void {
                    $this->record->syncRoles(['client']);

                    Notification::make()
                        ->title("{$this->record->name} ya no tiene acceso de administrador")
                        ->success()
                        ->send();

                    $this->redirect(static::getResource()::getUrl('edit', ['record' => $this->record]));
                }),
            Actions\Action::make('assign-operator-role')
                ->label('Hacer operador')
                ->icon('heroicon-o-briefcase')
                ->color('info')
                ->visible(fn(): bool => ! $this->record->hasRole('admin') && ! $this->record->hasRole('operator'))
                ->requiresConfirmation()
                ->modalHeading('Otorgar acceso de operador')
                ->modalDescription('El operador podra entrar al panel de administracion, gestionar ventas y ajustar stock. No tendra acceso a ninguna otra seccion. Confirma solo si es necesario.')
                ->modalIcon('heroicon-o-exclamation-triangle')
                ->modalSubmitActionLabel('Si, convertir en operador')
                ->action(function (): void {
                    $this->record->syncRoles(['operator']);

                    Notification::make()
                        ->title("{$this->record->name} ahora es operador")
                        ->success()
                        ->send();

                    $this->redirect(static::getResource()::getUrl('edit', ['record' => $this->record]));
                }),
            Actions\Action::make('remove-operator-role')
                ->label('Quitar operador')
                ->icon('heroicon-o-no-symbol')
                ->color('gray')
                ->visible(fn(): bool => $this->record->hasRole('operator'))
                ->requiresConfirmation()
                ->modalHeading('Retirar acceso de operador')
                ->modalDescription('El usuario perdera acceso al panel de administracion y volvera a ser cliente.')
                ->modalIcon('heroicon-o-exclamation-triangle')
                ->modalSubmitActionLabel('Si, quitar acceso')
                ->action(function (): void {
                    $this->record->syncRoles(['client']);

                    Notification::make()
                        ->title("{$this->record->name} ya no es operador")
                        ->success()
                        ->send();

                    $this->redirect(static::getResource()::getUrl('edit', ['record' => $this->record]));
                }),
            Actions\DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        return UserResource::mutateDataPassword($data);
    }
}
