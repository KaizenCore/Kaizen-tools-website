<?php

namespace App\Http\Resources;

use App\Enums\TrustLevel;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlayerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $trustLevel = $this->trust_level ?? TrustLevel::Unknown;

        return [
            'id' => $this->id,
            'uuid' => $this->uuid,
            'username' => $this->username,
            'trust_level' => $trustLevel->value,
            'trust_level_label' => $trustLevel->label(),
            'has_reports' => $this->verifiedReports()->exists(),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
