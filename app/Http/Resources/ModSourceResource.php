<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ModSourceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'platform' => $this->platform->value,
            'external_id' => $this->external_id,
            'external_slug' => $this->external_slug,
            'project_url' => $this->project_url,
            'downloads' => $this->downloads,
            'formatted_downloads' => $this->formatDownloads($this->downloads),
            'rating' => $this->rating,
            'latest_version' => $this->latest_version,
            'supported_versions' => $this->supported_versions ?? [],
            'supported_loaders' => $this->supported_loaders ?? [],
        ];
    }

    private function formatDownloads(int $downloads): string
    {
        if ($downloads >= 1000000) {
            return number_format($downloads / 1000000, 1).'M';
        }
        if ($downloads >= 1000) {
            return number_format($downloads / 1000, 1).'K';
        }

        return (string) $downloads;
    }
}
