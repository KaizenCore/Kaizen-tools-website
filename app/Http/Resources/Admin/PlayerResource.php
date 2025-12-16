<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlayerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'username' => $this->username,
            'trust_level' => $this->trust_level->value,
            'trust_level_label' => $this->trust_level->label(),
            'trust_score' => $this->trust_score,
            'admin_override' => $this->admin_override,
            'admin_override_at' => $this->admin_override_at?->toISOString(),
            'admin_override_by' => $this->whenLoaded('adminOverrideBy', fn () => [
                'id' => $this->adminOverrideBy->id,
                'name' => $this->adminOverrideBy->name,
            ]),
            'admin_notes' => $this->admin_notes,
            'reports_count' => $this->whenCounted('reports'),
            'verified_reports_count' => $this->verifiedReports()->count(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
