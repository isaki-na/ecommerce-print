<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('inventory:import-csv {--path=database/import/inventory_csv} {--truncate : Truncate related tables before import}', function () {
    $basePath = base_path((string) $this->option('path'));

    $requiredFiles = [
        'departments' => $basePath . DIRECTORY_SEPARATOR . 'departments.csv',
        'categories' => $basePath . DIRECTORY_SEPARATOR . 'categories.csv',
        'colors' => $basePath . DIRECTORY_SEPARATOR . 'colors.csv',
        'sizes' => $basePath . DIRECTORY_SEPARATOR . 'sizes.csv',
        'products' => $basePath . DIRECTORY_SEPARATOR . 'products.csv',
        'skus' => $basePath . DIRECTORY_SEPARATOR . 'skus.csv',
        'category_department' => $basePath . DIRECTORY_SEPARATOR . 'category_department.csv',
    ];

    foreach ($requiredFiles as $label => $filePath) {
        if (! is_file($filePath)) {
            $this->error("Missing {$label} file: {$filePath}");
            return 1;
        }
    }

    $readCsv = static function (string $filePath): array {
        $file = fopen($filePath, 'rb');
        if ($file === false) {
            throw new RuntimeException("Could not open file: {$filePath}");
        }

        $headers = fgetcsv($file);
        if ($headers === false) {
            fclose($file);
            return [];
        }

        $rows = [];
        while (($line = fgetcsv($file)) !== false) {
            if ($line === [null] || $line === false) {
                continue;
            }

            $row = [];
            foreach ($headers as $index => $header) {
                $row[$header] = $line[$index] ?? null;
            }
            $rows[] = $row;
        }

        fclose($file);
        return $rows;
    };

    $toNull = static function ($value): mixed {
        return $value === '' ? null : $value;
    };

    $toEmptyString = static function ($value): string {
        return $value === '' || $value === null ? '' : (string) $value;
    };

    $toInt = static function ($value): ?int {
        if ($value === '' || $value === null) {
            return null;
        }
        return (int) $value;
    };

    $toFloat = static function ($value): ?float {
        if ($value === '' || $value === null) {
            return null;
        }
        return (float) str_replace(',', '.', (string) $value);
    };

    $mapRows = static function (array $rows, callable $mapper): array {
        return array_values(array_map($mapper, $rows));
    };

    try {
        $departments = $mapRows($readCsv($requiredFiles['departments']), static function (array $row) use ($toInt, $toNull, $toEmptyString): array {
            return [
                'id' => $toInt($row['id'] ?? null),
                'name' => $row['name'] ?? '',
                'slug' => $row['slug'] ?? '',
                'img' => $toEmptyString($row['img'] ?? ''),
                'entry' => $toNull($row['entry'] ?? null),
                'active' => $toInt($row['active'] ?? 1) ?? 1,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        });

        $categories = $mapRows($readCsv($requiredFiles['categories']), static function (array $row) use ($toInt, $toNull, $toEmptyString): array {
            return [
                'id' => $toInt($row['id'] ?? null),
                'name' => $row['name'] ?? '',
                'slug' => $row['slug'] ?? '',
                'img' => $toEmptyString($row['img'] ?? ''),
                'entry' => $toNull($row['entry'] ?? null),
                'active' => $toInt($row['active'] ?? 1) ?? 1,
                'in_home' => $toInt($row['in_home'] ?? 1) ?? 1,
                'type' => $row['type'] ?? 'product',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        });

        $colors = $mapRows($readCsv($requiredFiles['colors']), static function (array $row) use ($toInt, $toNull, $toEmptyString): array {
            return [
                'id' => $toInt($row['id'] ?? null),
                'name' => $row['name'] ?? '',
                'slug' => $row['slug'] ?? '',
                'img' => $toEmptyString($row['img'] ?? ''),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        });

        $sizes = $mapRows($readCsv($requiredFiles['sizes']), static function (array $row) use ($toInt): array {
            return [
                'id' => $toInt($row['id'] ?? null),
                'name' => $row['name'] ?? '',
                'slug' => $row['slug'] ?? '',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        });

        $products = $mapRows($readCsv($requiredFiles['products']), static function (array $row) use ($toInt, $toFloat, $toNull, $toEmptyString): array {
            return [
                'id' => $toInt($row['id'] ?? null),
                'ref' => $toNull($row['ref'] ?? null),
                'name' => $row['name'] ?? '',
                'slug' => $row['slug'] ?? '',
                'entry' => $row['entry'] ?? '',
                'description' => $toNull($row['description'] ?? null),
                'img' => $toEmptyString($row['img'] ?? ''),
                'thumb' => $toEmptyString($row['thumb'] ?? ''),
                'max_quantity' => $toInt($row['max_quantity'] ?? 100) ?? 100,
                'old_price' => $toFloat($row['old_price'] ?? null),
                'offer' => $toInt($row['offer'] ?? null),
                'price' => $toFloat($row['price'] ?? 0) ?? 0,
                'featured' => $toInt($row['featured'] ?? 0) ?? 0,
                'active' => $toInt($row['active'] ?? 1) ?? 1,
                'parent_id' => $toInt($row['parent_id'] ?? null),
                'color_id' => $toInt($row['color_id'] ?? null),
                'department_id' => $toInt($row['department_id'] ?? null),
                'category_id' => $toInt($row['category_id'] ?? null),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        });

        $skus = $mapRows($readCsv($requiredFiles['skus']), static function (array $row) use ($toInt): array {
            return [
                'id' => $toInt($row['id'] ?? null),
                'stock' => $toInt($row['stock'] ?? 0) ?? 0,
                'product_id' => $toInt($row['product_id'] ?? null),
                'size_id' => $toInt($row['size_id'] ?? null),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        });

        $categoryDepartmentRows = $mapRows($readCsv($requiredFiles['category_department']), static function (array $row) use ($toInt): array {
            return [
                'category_id' => $toInt($row['category_id'] ?? null),
                'department_id' => $toInt($row['department_id'] ?? null),
            ];
        });
    } catch (Throwable $exception) {
        $this->error('Failed to parse CSV files: ' . $exception->getMessage());
        return 1;
    }

    DB::beginTransaction();

    try {
        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        if ((bool) $this->option('truncate')) {
            DB::table('skus')->delete();
            DB::table('products')->delete();
            DB::table('category_department')->delete();
            DB::table('sizes')->delete();
            DB::table('colors')->delete();
            DB::table('categories')->delete();
            DB::table('departments')->delete();
        }

        DB::table('departments')->upsert($departments, ['id'], ['name', 'slug', 'img', 'entry', 'active', 'updated_at']);
        DB::table('categories')->upsert($categories, ['id'], ['name', 'slug', 'img', 'entry', 'active', 'in_home', 'type', 'updated_at']);
        DB::table('colors')->upsert($colors, ['id'], ['name', 'slug', 'img', 'updated_at']);
        DB::table('sizes')->upsert($sizes, ['id'], ['name', 'slug', 'updated_at']);
        DB::table('products')->upsert(
            $products,
            ['id'],
            ['ref', 'name', 'slug', 'entry', 'description', 'img', 'thumb', 'max_quantity', 'old_price', 'offer', 'price', 'featured', 'active', 'parent_id', 'color_id', 'department_id', 'category_id', 'updated_at']
        );
        DB::table('skus')->upsert($skus, ['id'], ['stock', 'product_id', 'size_id', 'updated_at']);

        if ((bool) $this->option('truncate')) {
            DB::table('category_department')->insert($categoryDepartmentRows);
        } else {
            foreach ($categoryDepartmentRows as $row) {
                DB::table('category_department')->insertOrIgnore($row);
            }
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        DB::commit();
    } catch (Throwable $exception) {
        if (DB::transactionLevel() > 0) {
            DB::rollBack();
        }
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        $this->error('Import failed: ' . $exception->getMessage());
        return 1;
    }

    $this->info('CSV import completed successfully.');
    $this->line('Rows imported:');
    $this->line(' - departments: ' . count($departments));
    $this->line(' - categories: ' . count($categories));
    $this->line(' - colors: ' . count($colors));
    $this->line(' - sizes: ' . count($sizes));
    $this->line(' - products: ' . count($products));
    $this->line(' - skus: ' . count($skus));
    $this->line(' - category_department: ' . count($categoryDepartmentRows));

    return 0;
})->purpose('Import inventory CSV bundle into related product tables.');
