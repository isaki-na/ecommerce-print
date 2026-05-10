<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class InventoryImportCsv extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'inventory:import-csv
        {--path=database/import/inventory_csv : Directory that contains CSV files}
        {--truncate : Truncate target tables before import}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import inventory CSV files into departments, categories, colors, sizes, products and skus';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $basePath = (string) $this->option('path');
        $importDir = base_path($basePath);

        if (! is_dir($importDir)) {
            $this->error("Import path does not exist: {$importDir}");

            return self::FAILURE;
        }

        $requiredFiles = [
            'departments.csv',
            'categories.csv',
            'category_department.csv',
            'colors.csv',
            'sizes.csv',
            'products.csv',
            'skus.csv',
        ];

        foreach ($requiredFiles as $file) {
            $fullPath = $importDir . DIRECTORY_SEPARATOR . $file;
            if (! is_file($fullPath)) {
                $this->error("Missing required file: {$fullPath}");

                return self::FAILURE;
            }
        }

        $now = now();

        $departments = $this->readCsv($importDir . DIRECTORY_SEPARATOR . 'departments.csv');
        $categories = $this->readCsv($importDir . DIRECTORY_SEPARATOR . 'categories.csv');
        $categoryDepartment = $this->readCsv($importDir . DIRECTORY_SEPARATOR . 'category_department.csv');
        $colors = $this->readCsv($importDir . DIRECTORY_SEPARATOR . 'colors.csv');
        $sizes = $this->readCsv($importDir . DIRECTORY_SEPARATOR . 'sizes.csv');
        $products = $this->readCsv($importDir . DIRECTORY_SEPARATOR . 'products.csv');
        $skus = $this->readCsv($importDir . DIRECTORY_SEPARATOR . 'skus.csv');

        $departmentRows = array_map(function (array $row) use ($now): array {
            return [
                'id' => $this->toInt($row['id'] ?? null),
                'name' => (string) ($row['name'] ?? ''),
                'slug' => (string) ($row['slug'] ?? ''),
                'img' => (string) ($row['img'] ?? ''),
                'entry' => $this->toNullableString($row['entry'] ?? null),
                'active' => $this->toBoolInt($row['active'] ?? 1),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }, $departments);

        $categoryRows = array_map(function (array $row) use ($now): array {
            return [
                'id' => $this->toInt($row['id'] ?? null),
                'name' => (string) ($row['name'] ?? ''),
                'slug' => (string) ($row['slug'] ?? ''),
                'img' => $this->toNullableString($row['img'] ?? null),
                'entry' => $this->toNullableString($row['entry'] ?? null),
                'active' => $this->toBoolInt($row['active'] ?? 1),
                'in_home' => $this->toBoolInt($row['in_home'] ?? 1),
                'type' => (string) ($row['type'] ?? 'product'),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }, $categories);

        $categoryDepartmentRows = array_map(function (array $row): array {
            return [
                'category_id' => $this->toInt($row['category_id'] ?? null),
                'department_id' => $this->toInt($row['department_id'] ?? null),
            ];
        }, $categoryDepartment);

        $colorRows = array_map(function (array $row) use ($now): array {
            return [
                'id' => $this->toInt($row['id'] ?? null),
                'name' => (string) ($row['name'] ?? ''),
                'slug' => (string) ($row['slug'] ?? ''),
                'img' => $this->toNullableString($row['img'] ?? null),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }, $colors);

        $sizeRows = array_map(function (array $row) use ($now): array {
            return [
                'id' => $this->toInt($row['id'] ?? null),
                'name' => (string) ($row['name'] ?? ''),
                'slug' => (string) ($row['slug'] ?? ''),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }, $sizes);

        $departmentIds = array_fill_keys(array_column($departmentRows, 'id'), true);
        $categoryIds = array_fill_keys(array_column($categoryRows, 'id'), true);
        $colorIds = array_fill_keys(array_column($colorRows, 'id'), true);
        $sizeIds = array_fill_keys(array_column($sizeRows, 'id'), true);

        $productRows = array_map(function (array $row) use ($now, $departmentIds, $categoryIds, $colorIds): array {
            $parentId = $this->toNullableInt($row['parent_id'] ?? null);
            $colorId = $this->toNullableInt($row['color_id'] ?? null);
            $departmentId = $this->toNullableInt($row['department_id'] ?? null);
            $categoryId = $this->toNullableInt($row['category_id'] ?? null);

            return [
                'id' => $this->toInt($row['id'] ?? null),
                'ref' => $this->toNullableString($row['ref'] ?? null),
                'name' => (string) ($row['name'] ?? ''),
                'slug' => (string) ($row['slug'] ?? ''),
                'entry' => (string) ($row['entry'] ?? ''),
                'description' => $this->toNullableString($row['description'] ?? null),
                'img' => $this->toNullableString($row['img'] ?? null),
                'thumb' => $this->toNullableString($row['thumb'] ?? null),
                'max_quantity' => $this->toInt($row['max_quantity'] ?? 0),
                'old_price' => $this->toNullableFloat($row['old_price'] ?? null),
                'offer' => $this->toNullableInt($row['offer'] ?? null),
                'price' => (float) ($row['price'] ?? 0),
                'featured' => $this->toBoolInt($row['featured'] ?? 0),
                'active' => $this->toBoolInt($row['active'] ?? 1),
                'parent_id' => $parentId,
                'color_id' => ($colorId !== null && isset($colorIds[$colorId])) ? $colorId : null,
                'department_id' => ($departmentId !== null && isset($departmentIds[$departmentId])) ? $departmentId : null,
                'category_id' => ($categoryId !== null && isset($categoryIds[$categoryId])) ? $categoryId : null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }, $products);

        $productIds = array_fill_keys(array_column($productRows, 'id'), true);

        // Products whose id appears as someone else's parent_id — these are true parent containers.
        $usedAsParentIds = array_fill_keys(
            array_filter(
                array_column($productRows, 'parent_id'),
                fn ($pid) => $pid !== null,
            ),
            true,
        );

        // Standalone products: no parent_id AND no children. Give them a self-referential
        // parent_id so the storefront variant scope picks them up like any other variant.
        // We insert with null first (avoids FK issues), then UPDATE after the rows exist.
        $standaloneProductIds = array_column(
            array_filter(
                $productRows,
                fn ($r) => $r['parent_id'] === null && ! isset($usedAsParentIds[$r['id']]),
            ),
            'id',
        );

        $skuSkipped = 0;
        $skuRows = [];
        foreach ($skus as $row) {
            $productId = $this->toInt($row['product_id'] ?? null);

            if (! isset($productIds[$productId])) {
                $skuSkipped++;
                continue;
            }

            $sizeId = $this->toNullableInt($row['size_id'] ?? null);
            if ($sizeId !== null && ! isset($sizeIds[$sizeId])) {
                $sizeId = null;
            }

            $skuRows[] = [
                'id' => $this->toInt($row['id'] ?? null),
                'stock' => $this->toInt($row['stock'] ?? 0),
                'product_id' => $productId,
                'size_id' => $sizeId,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        DB::beginTransaction();

        try {
            if ((bool) $this->option('truncate')) {
                Schema::disableForeignKeyConstraints();

                DB::table('skus')->delete();
                DB::table('products')->delete();
                DB::table('category_department')->delete();
                DB::table('sizes')->delete();
                DB::table('colors')->delete();
                DB::table('categories')->delete();
                DB::table('departments')->delete();

                Schema::enableForeignKeyConstraints();
            }

            $this->upsertChunked('departments', $departmentRows, ['id']);
            $this->upsertChunked('categories', $categoryRows, ['id']);
            $this->upsertChunked('colors', $colorRows, ['id']);
            $this->upsertChunked('sizes', $sizeRows, ['id']);

            DB::table('category_department')->delete();
            $this->insertChunked('category_department', $categoryDepartmentRows);

            $this->upsertChunked('products', $productRows, ['id']);

            // Now that product rows exist, make standalone products self-referential so they
            // appear through the variant() scope on the storefront.
            if (! empty($standaloneProductIds)) {
                DB::table('products')
                    ->whereIn('id', $standaloneProductIds)
                    ->update(['parent_id' => DB::raw('id')]);
            }

            $this->upsertChunked('skus', $skuRows, ['id']);

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Schema::enableForeignKeyConstraints();

            $this->error($e->getMessage());

            return self::FAILURE;
        }

        $this->info('Inventory CSV import completed successfully.');
        $this->line('Imported rows:');
        $this->line('- departments: ' . count($departmentRows));
        $this->line('- categories: ' . count($categoryRows));
        $this->line('- colors: ' . count($colorRows));
        $this->line('- sizes: ' . count($sizeRows));
        $this->line('- category_department: ' . count($categoryDepartmentRows));
        $this->line('- products: ' . count($productRows));
        $this->line('- skus: ' . count($skuRows));
        $this->line('- skipped_skus: ' . $skuSkipped);

        return self::SUCCESS;
    }

    /**
     * @return array<int, array<string, string|null>>
     */
    private function readCsv(string $filePath): array
    {
        $rows = [];

        $handle = fopen($filePath, 'r');
        if ($handle === false) {
            throw new \RuntimeException("Unable to open CSV: {$filePath}");
        }

        $headers = fgetcsv($handle);
        if ($headers === false) {
            fclose($handle);

            return [];
        }

        $headers = array_map(static fn ($h) => trim((string) $h), $headers);

        while (($data = fgetcsv($handle)) !== false) {
            if ($data === [null] || count(array_filter($data, static fn ($v) => $v !== null && trim((string) $v) !== '')) === 0) {
                continue;
            }

            $assoc = [];
            foreach ($headers as $index => $header) {
                $value = $data[$index] ?? null;
                $assoc[$header] = $value === null ? null : trim((string) $value);
            }

            $rows[] = $assoc;
        }

        fclose($handle);

        return $rows;
    }

    /**
     * @param array<int, array<string, mixed>> $rows
     * @param array<int, string> $uniqueBy
     */
    private function upsertChunked(string $table, array $rows, array $uniqueBy, int $chunkSize = 1000): void
    {
        foreach (array_chunk($rows, $chunkSize) as $chunk) {
            DB::table($table)->upsert($chunk, $uniqueBy);
        }
    }

    /**
     * @param array<int, array<string, mixed>> $rows
     */
    private function insertChunked(string $table, array $rows, int $chunkSize = 1000): void
    {
        foreach (array_chunk($rows, $chunkSize) as $chunk) {
            DB::table($table)->insert($chunk);
        }
    }

    private function toInt(mixed $value): int
    {
        return (int) ($value ?? 0);
    }

    private function toNullableInt(mixed $value): ?int
    {
        if ($value === null) {
            return null;
        }

        $string = trim((string) $value);
        if ($string === '' || ! is_numeric($string)) {
            return null;
        }

        return (int) $string;
    }

    private function toNullableFloat(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (float) $value;
    }

    private function toNullableString(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $string = trim((string) $value);

        return $string === '' ? null : $string;
    }

    private function toBoolInt(mixed $value): int
    {
        return ((int) ($value ?? 0)) === 1 ? 1 : 0;
    }
}
