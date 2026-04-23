<?php

namespace App\Filament\Widgets;

use App\Enums\ContactTypesEnum;
use App\Enums\OrderStatusEnum;
use App\Enums\SaleStatuEnum;
use App\Models\Contact;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Payroll;
use App\Models\Product;
use App\Models\Sale;
use Dashboard;
use Filament\Widgets\Concerns\InteractsWithPageFilters;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Number;

class StatsOverview extends BaseWidget
{
    use InteractsWithPageFilters;

    public static function canView(): bool
    {
        return auth()->user()?->hasRole('admin') ?? false;
    }

    protected static bool $isLazy = false;
    protected static ?int $sort = 0;
    protected function getStats(): array
    {

        $filterMonth = Dashboard::filterDateSelected($this->filters['select_month']);
        $saleStatuses = [OrderStatusEnum::SUCCESSFUL->value, OrderStatusEnum::DELIVERED->value];

        $orders = Order::select('id', 'status', 'created_at', 'total')
            ->whereIn('status', $saleStatuses)
            ->when($filterMonth, fn(Builder $query) => $query->whereDate('created_at', '>=', $filterMonth))
            ->orderBy('created_at', 'desc')->get();

        $ordersPerDays = $orders->groupBy(function ($order) {
            return (int) $order->created_at->format('d');
        })->map(function ($item) {
            return $item->count();
        });

        $productBestSeller = OrderProduct::select('product_id', DB::raw('count(*) as products_count'), DB::raw('MAX(id) as id'), DB::raw('MAX(name) as name'), DB::raw('MAX(price) as price'), DB::raw('MAX(order_id) as order_id'))
            ->groupBy('product_id')
            // ->having('product_id')
            ->orderBy('products_count', 'desc')
            ->when($filterMonth, fn(Builder $query) => $query->whereDate('created_at', '>=', $filterMonth))
            ->whereHas('order', fn(Builder $query) => $query->whereIn('status', $saleStatuses))
            ->first();


        // dd($productBestSeller);
        // $productBestSeller = Product::select('id', 'name', 'price')->variant()
        //     // ->whereHas('orders', function (Builder $query) use ($filterMonth) {
        //     //     $query->select('orders.id', 'status', 'orders.created_at')
        //     //         // ->where('status', OrderStatusEnum::SUCCESSFUL)
        //     //         ->when($filterMonth, fn(Builder $query) => $query->whereDate('orders.created_at', '>=', $filterMonth));
        //     // })
        //     ->bestSeller()->first();

        if ($productBestSeller) {
            $statProductBestSeller = Stat::make('Producto mas vendido', $productBestSeller->products_count . ' ventas')
                ->description($productBestSeller->name . ' ' . Number::currency($productBestSeller->price));
        } else {
            $statProductBestSeller = Stat::make('Producto mas vendido', '0 ventas')
                ->description('No hay suficientes datos');
        }

        return [
            Stat::make('Ventas', $orders->count() . ' ventas')
                ->description(Number::currency($orders->sum('total')))
                ->chart($ordersPerDays->toArray())->color('success'),

            $statProductBestSeller,


            Stat::make('Precio medio de ventas', Number::currency($orders->avg('total') ?: 0, 'MXN', locale: 'es'))
        ];
    }
}
