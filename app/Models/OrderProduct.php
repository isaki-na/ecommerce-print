<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrderProduct extends Model
{
    use HasFactory;

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'float',
        'total' => 'float',
        'data' => 'object',
    ];

    protected $guarded = [];

    protected static function booted(): void
    {
        static::saving(function (self $orderProduct): void {
            // Guard required DB columns against null values from any write path.
            $orderProduct->name = $orderProduct->name ?: 'Producto no encontrado';
            $orderProduct->ref = $orderProduct->ref ?: 'N/A';
            $orderProduct->thumb = $orderProduct->thumb ?: '/img/placeholder.webp';
            $orderProduct->color = $orderProduct->color ?: 'N/A';
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
