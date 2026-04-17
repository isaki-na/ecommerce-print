<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\ProductCardResource;
use App\Http\Resources\ProductResource;
use App\Http\Resources\VariantProductResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Department;
use App\Models\Product;
use App\Models\Variant;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function department($department)
    {

        $department = Department::active()->with('metaTag')->where('slug', $department)->firstOrFail();

        // $offers_product = $department->products()->card()->activeInStock()
        //     ->inOffer()->limit(15)->get();

        $offers_product = Product::variant()
            ->where('department_id', $department->id)
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
            ->where('department_id', $department->id)
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

        $best_sellers_product = Product::variant()
            ->where('department_id', $department->id)
            ->card()
            ->activeInStock()
            ->inOffer()
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
            ->where('department_id', $department->id)
            ->card()
            ->activeInStock()
            ->inOffer()
            ->whereIn('parent_id', $bestSellerParentIds)
            ->orderBy('id')
            ->get()
            ->unique('parent_id')
            ->keyBy('parent_id');

        $best_sellers_product = $bestSellerParentIds
            ->map(fn($parentId) => $bestSellerRepresentatives->get($parentId))
            ->filter()
            ->values();

        $categories = Category::active()
            ->whereHas('products', function ($query) use ($department) {
                $query->variant()->card()->activeInStock()->inRandomOrder()->where('department_id', $department->id)->limit(10);
            })
            ->with(['products' => function ($query) use ($department) {
                $query->variant()->card()->activeInStock()->inRandomOrder()->where('department_id', $department->id)->limit(10);
            }])
            ->select('id', 'name', 'slug', 'img', 'entry')
            ->get();

        $categories->transform(function ($category) use ($department) {
            if ($category->relationLoaded('products')) {
                $categoryParentIds = $category->products
                    ->pluck('parent_id')
                    ->filter()
                    ->unique()
                    ->values();

                $categoryRepresentatives = Product::query()
                    ->variant()
                    ->where('department_id', $department->id)
                    ->where('category_id', $category->id)
                    ->card()
                    ->activeInStock()
                    ->whereIn('parent_id', $categoryParentIds)
                    ->orderBy('id')
                    ->get()
                    ->unique('parent_id')
                    ->keyBy('parent_id');

                $category->setRelation(
                    'products',
                    $categoryParentIds
                        ->map(fn($parentId) => $categoryRepresentatives->get($parentId))
                        ->filter()
                        ->values(),
                );
            }

            return $category;
        });

        return Inertia::render('Department/Department', [
            'department' => new DepartmentResource($department),
            'offertProducts' => ProductCardResource::collection($offers_product),
            'bestSellersProducts' => ProductCardResource::collection($best_sellers_product),
            'categories' => CategoryResource::collection($categories),

        ]);
    }
}
