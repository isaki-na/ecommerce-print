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
    case DELIVERED = 'delivered';

    public function getLabel(): string
    {
        return match ($this) {
            self::PENDING => 'Pendiente',
            self::CANCELLED => 'Cancelado',
            self::REFUNDED => 'Reembolsado',
            self::SUCCESSFUL => 'Aceptado',
            self::DELIVERED => 'Entregado',
        };
    }

    public function getColor(): string
    {
        return match ($this) {
            self::PENDING => 'warning',
            self::CANCELLED => 'gray',
            self::REFUNDED => 'danger',
            self::SUCCESSFUL => 'success',
            self::DELIVERED => 'info',
        };
    }

    public function getIcon(): string
    {
        return match ($this) {
            self::PENDING => 'heroicon-m-clock',
            self::REFUNDED => 'heroicon-m-receipt-refund',
            self::SUCCESSFUL => 'heroicon-m-check-circle',
            self::CANCELLED => 'heroicon-m-x-circle',
            self::DELIVERED => 'heroicon-m-archive-box-arrow-down',
        };
    }
}
