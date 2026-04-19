<?php

namespace App\Http\Resources;

use App\Services\SettingService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'quantity' => $this->quantity,
            'shipping' => $this->shipping,
            'status' => $this->status->getLabel(),
            'status_color' => $this->status->getColor(),
            'sub_total' => $this->sub_total,
            'discount' => $this->discount,
            'tax_rate' => $this->tax_rate,
            'tax_value' => $this->tax_value,
            'products' => OrderProductResource::collection($this->whenLoaded('order_products')),
            'payment' => new PaymentResource($this->whenLoaded('payment')),
            'total' => $this->total,
            'user' => $this->data->user,
            'created_at' => $this->created_at,
            'createdAtRelative' => $this->created_at->locale('es_ES')->diffForHumans(['parts' => 1]),
            'pickup_at' => $this->pickup_at?->setTimezone('America/Mexico_City')->toIso8601String(),
            'maps_link' => data_get(SettingService::data(), 'store.maps_link') ?: null,
        ];
    }
}

