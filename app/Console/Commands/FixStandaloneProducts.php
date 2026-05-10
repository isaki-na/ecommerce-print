<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FixStandaloneProducts extends Command
{
    protected $signature = 'products:fix-standalone';

    protected $description = 'Give standalone products a self-referential parent_id and create default SKUs for those with none';

    public function handle(): int
    {
        // IDs that are referenced as a parent by at least one other product
        $usedAsParent = DB::table('products')
            ->whereNotNull('parent_id')
            ->distinct()
            ->pluck('parent_id');

        // Standalone products: no parent_id AND no children → self-referential parent_id
        $affected = DB::table('products')
            ->whereNull('parent_id')
            ->whereNotIn('id', $usedAsParent)
            ->update(['parent_id' => DB::raw('id')]);

        $this->info("Updated {$affected} standalone products with self-referential parent_id.");

        // Create a default SKU (stock=1, no size) for every active product that has none
        $now = now()->toDateTimeString();
        $productsWithNoSkus = DB::table('products')
            ->whereNotNull('parent_id')
            ->where('active', 1)
            ->whereNotIn('id', DB::table('skus')->distinct()->pluck('product_id'))
            ->pluck('max_quantity', 'id');

        $skuRows = $productsWithNoSkus->map(fn($maxQty, $productId) => [
            'stock'      => max(1, (int) $maxQty),
            'product_id' => $productId,
            'size_id'    => null,
            'created_at' => $now,
            'updated_at' => $now,
        ])->values()->all();

        if (! empty($skuRows)) {
            DB::table('skus')->insert($skuRows);
            $this->info('Created ' . count($skuRows) . ' default SKUs for products with none.');
        } else {
            $this->info('No missing SKUs to create.');
        }

        return self::SUCCESS;
    }
}
