<?php

namespace App\Http\Resources;

use App\Models\Attribute\ColorAttribute;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\File;

class ProductResource extends JsonResource
{
    protected function resolveImageFilePath(string $name): ?string
    {
        $basePath = public_path('img/products/');
        $candidates = [
            $basePath . $name . '.jpeg',
            $basePath . $name . '.jpg',
            $basePath . $name . '.png',
            $basePath . $name . '.webp',
        ];

        foreach ($candidates as $candidate) {
            if (File::exists($candidate)) {
                return '/img/products/' . basename($candidate);
            }
        }

        return null;
    }

    protected function normalizeImagePath(?string $path): ?string
    {
        if ($path === null || $path === '') {
            return '/img/placeholder.png';
        }

        if (preg_match('/^https?:\/\//i', $path)) {
            return $path;
        }

        $raw = trim($path);
        $basename = pathinfo($raw, PATHINFO_FILENAME);
        $extension = pathinfo($raw, PATHINFO_EXTENSION);

        if (str_starts_with($raw, 'products/')) {
            $fileName = basename($raw);
            if ($extension === '') {
                return $this->resolveImageFilePath($basename) ?? '/img/placeholder.png';
            }

            return '/img/products/' . $fileName;
        }

        if (preg_match('/^image\d+$/i', $raw)) {
            return $this->resolveImageFilePath($raw) ?? '/img/placeholder.png';
        }

        if (preg_match('/^image\d+\.(jpe?g|png|webp)$/i', $raw)) {
            return '/img/products/' . $raw;
        }

        return str_starts_with($raw, '/') ? $raw : '/' . $raw;
    }

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $img = $this->normalizeImagePath($this->img);
        $thumb = $this->normalizeImagePath($this->thumb ?: $this->img);

        return [
            'id' => $this->id,
            'ref' => $this->ref,
            'name' => $this->name,
            'slug' => $this->slug,
            'thumb' => $thumb,
            'img' => $img,
            'entry' => $this->entry,
            'description' => $this->description,
            'old_price' => $this->old_price,
            'offer' => $this->offer,
            'price' => $this->price,
            'max_quantity' => $this->max_quantity,
            'stock' => $this->skus_sum_stock,
            'color' => new ColorResource($this->color),
            'images' => ImageResource::collection($this->images),
            'specifications' => $this->whenLoaded('specifications'),
            'attributes' => AttributeResource::collection($this->whenLoaded('attributes')),
            'skus' => SkuResource::collection($this->whenLoaded('skus')),
            'variants' => VariantResource::collection($this->whenLoaded('variants')),
            'category' => $this->whenLoaded('category'),
            'brand' => $this->whenLoaded('brand'),
            'metaTag' => $this->whenLoaded('metaTag') ? new MetaTagResource($this->metaTag) : null,
        ];
    }
}
