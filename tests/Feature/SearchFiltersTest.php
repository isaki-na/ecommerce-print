<?php

use App\Models\Department;
use App\Models\Product;
use App\Models\Sku;

it('matches product description in search filters without querying a missing column', function () {
    $department = Department::factory()->create([
        'active' => 1,
    ]);

    $product = Product::create([
        'name' => 'Top estampado',
        'slug' => 'top-estampado',
        'entry' => 'Entrada breve',
        'description' => 'Blusa fresca para verano',
        'max_quantity' => 5,
        'price' => 100,
        'active' => 1,
        'department_id' => $department->id,
    ]);

    Sku::create([
        'product_id' => $product->id,
        'stock' => 3,
    ]);

    $filters = [
        'q' => 'blusa',
        'departments' => [],
        'categories' => [],
        'colors' => [],
        'sizes' => [],
        'price_min' => '',
        'price_max' => '',
        'brands' => [],
        'offer' => '',
        'sortBy' => '',
        'attributes' => [],
    ];

    $departmentIds = Department::active()
        ->whereHas('products', function ($query) use ($filters) {
            $query->withFilters($filters);
        })
        ->pluck('id');

    expect($departmentIds)->toHaveCount(1)
        ->and($departmentIds->first())->toBe($department->id);
});

it('builds parent pagination query without created_at order when selecting distinct parent_id', function () {
    $filters = [
        'q' => 'blusa',
        'departments' => [],
        'categories' => [],
        'colors' => [],
        'sizes' => [],
        'price_min' => '',
        'price_max' => '',
        'brands' => [],
        'offer' => '',
        'sortBy' => '',
        'attributes' => [],
    ];

    $sql = Product::query()
        ->variant()
        ->withFilters($filters)
        ->reorder()
        ->select('parent_id')
        ->distinct()
        ->orderBy('parent_id', 'desc')
        ->toSql();

    expect(strtolower($sql))
        ->toContain('select distinct')
        ->toContain('parent_id')
        ->not->toContain('created_at');
});