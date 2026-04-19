<?php

namespace App\Filament\Traits;

/**
 * Restricts a Filament resource so that only users with the "admin" role
 * can see it in the navigation and access its pages.
 * Users with the "operator" (or any other) role will get a 403.
 */
trait AdminOnlyResource
{
    public static function canViewAny(): bool
    {
        return auth()->user()?->hasRole('admin') ?? false;
    }
}
