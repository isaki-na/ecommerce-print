<?php

namespace App\Services;

use App\Models\DiscountCode;
use App\Models\Order;
use App\Models\Sku;
use Gloudemans\Shoppingcart\Facades\Cart;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class OrderService
{
    public static function generateCode($id): string
    {
        // $week = strtoupper(Str::slug(now()->isoFormat('dd')));
        $week = strtoupper(Str::slug(now()->subDays(rand(1, 7))->isoFormat('dd')));
        return $week . Str::padLeft($id . fake()->bothify('###'), 6, '0');
    }

    public static function subtotal($products): float
    {
        $sub_total = $products->sum(function ($product) {
            return $product->quantity * $product->price;
        });

        return $sub_total;
    }
    public static function generateOrder(Collection $order_products, $discountCode = null, $user): Order
    {

        $order_array = self::calculateTotal($order_products, $discountCode);
        unset($order_array['payment_method']);

        return new Order([
            ...$order_array,
            'quantity' => $order_products->sum('quantity'),
            'code' => self::generateCode($user->id),
            'user_id' => $user->id,
            // 'data' => [
            //     'user' => $user->only('name', 'address', 'phone', 'email', 'city'),
            // ],
            'discount_code_id' => $discountCode?->id
        ]);
    }
    public static function calculateTotal($products, $discountCode = null, string $paymentMethod = 'in_store'): array
    {
        $subtotal = $products->sum('total');
        $taxRate = 0;
        $shipping = 0;

        if ($discountCode) {
            $discountValue = $discountCode->calculateDiscount($subtotal);
            $discountCode->applied = $discountValue;
        } else {
            $discountValue = 0;
        }

        $subtotalWithDiscount = round($subtotal - $discountValue, 2);

        $tax = 0;

        $total = round($subtotalWithDiscount + $shipping, 2);

        return [
            'sub_total' => $subtotal,
            'discount' => $discountCode,
            'tax_rate' => $taxRate,
            'tax_value' => $tax,
            'shipping' => $shipping,
            'total' => $total,
            'payment_method' => $paymentMethod,
        ];
    }

    public static function formatOrderProduct($sku, $quantity)
    {
        $product = $sku->product;

        if (!$product) {
            return [
                'name' => 'Producto no encontrado',
                'ref' => 'N/A',
                'thumb' => '/img/placeholder.webp',
                'old_price' => 0,
                'offer' => 0,
                'price' => 0,
                'category_id' => null,
                'department_id' => null,
                'color' => 'N/A',
                'size' => $sku->size?->name ?? 'N/A',
                'total' => 0,
                'quantity' => $quantity,
                'sku_id' => $sku->id,
                'product_id' => null,
            ];
        }

        $thumb = $product->thumb ?: ($product->img ?: '/img/placeholder.webp');
        $ref = $product->ref ?: 'N/A';

        return [
            ...$product->only([
                'name',
                'old_price',
                'offer',
                'price',
                'category_id',
                'department_id',
            ]),
            'ref' => $ref,
            'thumb' => $thumb,
            'color' => $product->color?->name ?? 'N/A',
            'size' => $sku->size?->name ?? 'N/A',
            'total' => round($product->price * $quantity, 2),
            'quantity' => $quantity,
            'sku_id' => $sku->id,
            'product_id' => $product->id,

        ];
    }

    public static function generate_order_products_checkout(array $products): Collection
    {
        $skuIds = array_keys($products);
        return Sku::with('product')
            ->find($skuIds)
            ->filter(function ($sku) use ($products) {
                return $sku->stock >= $products[$sku->id];
            })
            ->map(function ($sku) use ($products) {
                $quantity = $products[$sku->id];
                return self::formatOrderProduct($sku, $quantity);
            });
    }
}
