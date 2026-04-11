<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductCardResource;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function category($slug)
    {
        $category = Category::active()
            ->with('metaTag')
            ->where('slug', $slug)
            ->firstOrFail();

        // Get offer products
        $offers_product = Product::variant()
            ->where('category_id', $category->id)
            ->card()
            ->activeInStock()
            ->inOffer()
            ->limit(15)
            ->inRandomOrder()
            ->get();

        // Get best sellers
        $best_sellers_product = Product::variant()
            ->where('category_id', $category->id)
            ->card()
            ->activeInStock()
            ->limit(10)
            ->inRandomOrder()
            ->get();

        // Remove subcategories query since there's no parent_id
        // $subcategories = Category::active()
        //     ->where('parent_id', $category->id)
        //     ->withCount('products')
        //     ->get();

        // Get paginated products
        $products = Product::variant()
            ->where('category_id', $category->id)
            ->card()
            ->activeInStock()
            ->paginate(20);

        return Inertia::render('Category/Category', [
            'category' => new CategoryResource($category),
            'offertProducts' => ProductCardResource::collection($offers_product),
            'bestSellersProducts' => ProductCardResource::collection($best_sellers_product),
            // 'subcategories' => CategoryResource::collection($subcategories), // Remove this
            'products' => ProductCardResource::collection($products),
            'productsPaginated' => $products,
        ]);
    }
}