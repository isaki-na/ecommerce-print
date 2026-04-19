<?php

namespace App\Enums;

use Filament\Support\Contracts\HasColor;
use Filament\Support\Contracts\HasIcon;
use Filament\Support\Contracts\HasLabel;

enum OrderStatusEnum: string implements HasLabel, HasColor, HasIcon
{
    case PENDING = 'pending';
    case CANCELLED = 'canceled';
    case REFUNDED = 'refunded';
    case SUCCESSFUL = 'successful';

    public function getLabel(): string
    {
        return match ($this) {
            self::PENDING => 'Pendiente',
            self::CANCELLED => 'Cancelado',
            self::REFUNDED => 'Reembolsado',
            self::SUCCESSFUL => 'Aceptado',
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::PENDING => 'warning',
            self::CANCELLED => 'gray',
            self::REFUNDED => 'danger',
            self::SUCCESSFUL => 'success',
        };
    }

    public function getIcon(): string
    {
        return match ($this) {
            self::PENDING => 'heroicon-m-clock',
            self::REFUNDED => 'heroicon-m-receipt-refund',
            self::SUCCESSFUL => 'heroicon-m-check-circle',
            self::CANCELLED => 'heroicon-m-x-circle',
        };
    }
}
