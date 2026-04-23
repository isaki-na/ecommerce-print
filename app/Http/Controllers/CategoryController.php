<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductCardResource;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function category($slug)
    {
        $category = Category::active()
            ->with('metaTag')
            ->where('slug', $slug)
            ->firstOrFail();
         $categories = Category::active()
            ->where('type', 'product')
            ->where('in_home', 1)
            ->select('id', 'name', 'slug', 'img', 'entry')
            ->get();
        // Get offer products
        $offers_product = Product::variant()
            ->where('category_id', $category->id)
            ->card()
            ->activeInStock()
            ->inOffer()
            ->orderBy('updated_at', 'desc')
            ->limit(15)
            ->get();

        $offersParentIds = $offers_product
            ->pluck('parent_id')
            ->filter()
            ->unique()
            ->values();

        $offersRepresentatives = Product::query()
            ->variant()
            ->where('category_id', $category->id)
            ->card()
            ->activeInStock()
            ->inOffer()
            ->whereIn('parent_id', $offersParentIds)
            ->orderBy('id')
            ->get()
            ->unique('parent_id')
            ->keyBy('parent_id');

        $offers_product = $offersParentIds
            ->map(fn($parentId) => $offersRepresentatives->get($parentId))
            ->filter()
            ->values();

        // Get best sellers
        $best_sellers_product = Product::variant()
            ->where('category_id', $category->id)
            ->card()
            ->activeInStock()
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get();

        $bestSellerParentIds = $best_sellers_product
            ->pluck('parent_id')
            ->filter()
            ->unique()
            ->values();

        $bestSellerRepresentatives = Product::query()
            ->variant()
            ->where('category_id', $category->id)
            ->card()
            ->activeInStock()
            ->whereIn('parent_id', $bestSellerParentIds)
            ->orderBy('id')
            ->get()
            ->unique('parent_id')
            ->keyBy('parent_id');

        $best_sellers_product = $bestSellerParentIds
            ->map(fn($parentId) => $bestSellerRepresentatives->get($parentId))
            ->filter()
            ->values();

        // Remove subcategories query since there's no parent_id
        // $subcategories = Category::active()
        //     ->where('parent_id', $category->id)
        //     ->withCount('products')
        //     ->get();

        // Paginate by unique parent product so totals match visible cards.
        $parentsPaginator = Product::query()
            ->variant()
            ->where('category_id', $category->id)
            ->activeInStock()
            ->select('parent_id')
            ->distinct()
            ->paginate(20, ['parent_id'])
            ->withQueryString();

        $parentIds = collect($parentsPaginator->items())
            ->pluck('parent_id')
            ->filter()
            ->values();

        $variantsByParent = Product::query()
            ->variant()
            ->where('category_id', $category->id)
            ->card()
            ->activeInStock()
            ->whereIn('parent_id', $parentIds)
            ->orderBy('id')
            ->get()
            ->groupBy('parent_id')
            ->map(fn($variants) => $variants->first());

        $productsForPage = $parentIds
            ->map(fn($parentId) => $variantsByParent->get($parentId))
            ->filter()
            ->values();

        $products = new LengthAwarePaginator(
            $productsForPage,
            $parentsPaginator->total(),
            $parentsPaginator->perPage(),
            $parentsPaginator->currentPage(),
            [
                'path' => request()->url(),
                'query' => request()->query(),
                'pageName' => $parentsPaginator->getPageName(),
            ],
        );

        return Inertia::render('Category/Category', [
            'category' => new CategoryResource($category),
            'categories' => CategoryResource::collection($categories),
            'offertProducts' => ProductCardResource::collection($offers_product),
            'bestSellersProducts' => ProductCardResource::collection($best_sellers_product),
            // 'subcategories' => CategoryResource::collection($subcategories), // Remove this
            'products' => ProductCardResource::collection($products),
            'productsPaginated' => $products,
        ]);
    }
}