<?php

namespace App\Http\Controllers\Checkout;

use App\Enums\CartEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutProductRequest;
use App\Http\Resources\CartResource;
use App\Http\Resources\OrderResource;
use App\Models\DiscountCode;
use App\Models\Product;
use App\Services\CartService;
use App\Services\CheckoutService;
use App\Services\OrderService;
use Gloudemans\Shoppingcart\Facades\Cart;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Rules\ValidateProductRule;

class CheckoutController extends Controller
{
    protected const PAYMENT_METHODS = [
        'in_store',
        'online_pickup',
    ];

    public function checkout(Request $request)
    {

        $products = CartService::products(CartEnum::CHECKOUT);

        $discountCode = session()->get('discountCode');
        $paymentMethod = session()->get('checkout_payment_method', 'in_store');

        if (!in_array($paymentMethod, self::PAYMENT_METHODS, true)) {
            $paymentMethod = 'in_store';
        }

        $total = OrderService::calculateTotal($products, $discountCode, $paymentMethod);

        $discount_codes = DiscountCode::whereDate('valid_from', '<=', now())
            ->whereDate('valid_to', '>=', now())
            ->where('active', 1)->inRandomOrder()->limit(5)->get();

        $note = 'Escribe aqui cualquier detalle adicional para tu pedido.';

        return Inertia::render('Checkout/Checkout', [
            'products' => $products,
            'total' => $total,
            'dicountCodes' => $discount_codes,
            'note' => $note,
            //'clientSecret' => auth()->user()->createSetupIntent()->client_secret
        ]);
    }

    public function addSingleProduct(Request $request)
    {
        $request->validate([
            'skuId' => ['required', 'exists:skus,id', new ValidateProductRule],
            'quantity' => ['required', 'numeric', 'min:1'],
        ]);

        session()->forget(CartEnum::CHECKOUT->value);
        session(['checkout_payment_method' => 'in_store']);

        CartService::add(CartEnum::CHECKOUT, $request->skuId, $request->quantity);

        return to_route('checkout');
    }

    public function addShoppingCart(Request $request)
    {
        $products = CartService::session(CartEnum::SHOPPING_CART);
        $paymentMethod = $request->string('payment_method')->toString() ?: 'in_store';

        if (!in_array($paymentMethod, self::PAYMENT_METHODS, true)) {
            $paymentMethod = 'in_store';
        }

        session([CartEnum::CHECKOUT->value => $products]);
        session(['checkout_payment_method' => $paymentMethod]);

        return to_route('checkout');
    }
}
