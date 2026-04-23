<?php

namespace Database\Seeders;

use App\Enums\OrderStatusEnum;
use App\Models\DiscountCode;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Payment;
use App\Models\Sku;
use App\Models\User;
use App\Services\OrderService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Number;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Order::truncate();
        OrderProduct::truncate();
        Payment::truncate();

        $users = User::get();
        $discountCodes = DiscountCode::get();

        $order_products = Sku::with([
            'size:id,name',
            'product' => function ($query) {
                $query->select(
                    'id',
                    'slug',
                    'img',
                    'name',
                    'ref',
                    'thumb',
                    'price',
                    'offer',
                    'old_price',
                    'max_quantity',
                    'color_id',
                    'category_id',
                    'department_id'
                )
                    ->with('color:id,name');
            }
        ])
            ->limit(500) // Limit SKUs to reduce memory
            ->get();


        foreach ($users->multiply(5) as $user) { // Reduced multiplier to 5

            $order_products_selected = $order_products->random(5, 10)->map(function ($sku) { // Reduced random count
                $quantity = rand(1, rand(1, 14));
                return OrderService::formatOrderProduct($sku, $quantity);
            });


            if (rand(0, 2) == 0) {
                $discountCode = $discountCodes->random();
            } else {
                $discountCode = null;
            }

            $order = OrderService::generateOrder($order_products_selected, $discountCode, $user);

            $order->data = (object) [
                'user' => $user->only('name', 'address', 'phone', 'email', 'city'),
            ];

            $order->status = fake()->randomElement(OrderStatusEnum::cases());

            if ($order->status != OrderStatusEnum::SUCCESSFUL) {
                $order->refund_at = now();
            }

            $order->created_at = fake()->dateTimeBetween('-12 months', 'now');

            $order->updated_at = $order->created_at;

            $order->save();

            $order->order_products()->createMany($order_products_selected);

            Payment::factory()->create([
                'order_id' => $order->id
            ]);

            $this->command->info("Orden " . $order->code . " : " . Number::currency($order->total));
        }
    }
}
