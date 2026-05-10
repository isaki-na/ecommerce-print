<?php

namespace App\Http\Resources;

use App\Models\Attribute\ColorAttribute;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $img = $this->img ?: ($this->thumb ?: '/img/placeholder.png');
        $thumb = $this->thumb ?: ($this->img ?: '/img/placeholder.png');

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
            'color' => $this->color ? new ColorResource($this->color) : null,
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
