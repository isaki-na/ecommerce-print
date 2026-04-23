<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Services\InvoiceService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileOrderController extends Controller
{
    public function orders(Request $request): Response
    {
        $age = $request->string('age', 'all')->toString();
        $allowedAges = ['all', '12m', '6m', '3m', '1m'];

        if (!in_array($age, $allowedAges, true)) {
            $age = 'all';
        }

        $ordersQuery = auth()->user()->orders()->with('payment');

        if ($age !== 'all') {
            $months = (int) str_replace('m', '', $age);
            $ordersQuery->where('created_at', '>=', now()->subMonths($months));
        }

        $orders = $ordersQuery
            ->orderBy('id', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Profile/Orders', [
            'orders' => OrderResource::collection($orders),
            'filters' => [
                'age' => $age,
            ],
        ]);
    }

    public function orderDetails($code)
    {
        $order = auth()->user()->orders()->with('order_products', 'payment')->where('code', $code)->firstOrFail();

        return Inertia::render('Profile/OrderDetails/OrderDetails', [
            'order' => new OrderResource($order),
        ]);
    }

    public function voucherPdf($code)
    {
        $order = auth()->user()->orders()->with('order_products', 'payment')->where('code', $code)->firstOrFail();

        $voucher = InvoiceService::generateInvoice($order);


        return $voucher->stream();
    }
}
