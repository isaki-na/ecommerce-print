<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add foreign key constraints that were deferred because their referenced
     * tables were created in later migrations.
     *
     * Deferred constraints:
     *  - products.color_id       → colors.id
     *  - products.department_id  → departments.id
     *  - products.category_id    → categories.id
     *  - skus.size_id            → sizes.id
     *  - category_department.department_id → departments.id
     *  - orders.discount_code_id → discount_codes.id
     *  - order_products.department_id → departments.id
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->foreign('color_id')->references('id')->on('colors')->nullOnDelete();
            $table->foreign('department_id')->references('id')->on('departments')->nullOnDelete();
            $table->foreign('category_id')->references('id')->on('categories')->nullOnDelete();
        });

        Schema::table('skus', function (Blueprint $table) {
            $table->foreign('size_id')->references('id')->on('sizes')->nullOnDelete();
        });

        Schema::table('category_department', function (Blueprint $table) {
            $table->foreign('department_id')->references('id')->on('departments')->cascadeOnDelete();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->foreign('discount_code_id')->references('id')->on('discount_codes')->nullOnDelete();
        });

        Schema::table('order_products', function (Blueprint $table) {
            $table->foreign('department_id')->references('id')->on('departments')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('order_products', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropForeign(['discount_code_id']);
        });

        Schema::table('category_department', function (Blueprint $table) {
            $table->dropForeign(['department_id']);
        });

        Schema::table('skus', function (Blueprint $table) {
            $table->dropForeign(['size_id']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropForeign(['department_id']);
            $table->dropForeign(['color_id']);
        });
    }
};
