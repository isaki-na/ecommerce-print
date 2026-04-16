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

        $best_sellers_product = Product::variant()
            ->where('department_id', $department->id)
            ->card()
            ->activeInStock()
            ->inOffer()
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get();

        $categories = Category::active()
            ->whereHas('products', function ($query) use ($department) {
                $query->variant()->card()->activeInStock()->inRandomOrder()->where('department_id', $department->id)->limit(10);
            })
            ->with(['products' => function ($query) use ($department) {
                $query->variant()->card()->activeInStock()->inRandomOrder()->where('department_id', $department->id)->limit(10);
            }])
            ->select('id', 'name', 'slug', 'img', 'entry')
            ->get();

        return Inertia::render('Department/Department', [
            'department' => new DepartmentResource($department),
            'offertProducts' => ProductCardResource::collection($offers_product),
            'bestSellersProducts' => ProductCardResource::collection($best_sellers_product),
            'categories' => CategoryResource::collection($categories),

        ]);
    }
}
