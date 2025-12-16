<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ModResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $sourcesLoaded = $this->relationLoaded('sources');
        $categoriesLoaded = $this->relationLoaded('categories');

        $sources = $sourcesLoaded ? $this->sources : collect();
        $categories = $categoriesLoaded ? $this->categories : collect();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'summary' => $this->summary,
            'author' => $this->author,
            'icon_url' => $this->icon_url,
            'total_downloads' => $this->total_downloads,
            'formatted_downloads' => $this->formatDownloads($this->total_downloads),
            'last_updated_at' => $this->last_updated_at?->toISOString(),
            'categories' => $categories->pluck('name')->toArray(),
            'sources' => ModSourceResource::collection($sources)->resolve(),
            'has_modrinth' => $sources->contains('platform', 'modrinth'),
            'has_curseforge' => $sources->contains('platform', 'curseforge'),
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
