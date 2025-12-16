<?php

namespace App\Services\ModAggregator;

use App\Enums\ModPlatform;
use App\Models\Mod;
use App\Models\ModSource;
use Illuminate\Support\Str;

class ModMatcher
{
    /**
     * Find or create a unified Mod record for an external source.
     *
     * @param  array<string, mixed>  $normalizedData
     */
    public function findOrCreateMod(array $normalizedData, ModPlatform $platform): Mod
    {
        // First, check if we already have this source
        $existingSource = ModSource::where('platform', $platform)
            ->where('external_id', $normalizedData['external_id'])
            ->first();

        if ($existingSource) {
            return $existingSource->mod;
        }

        // Try to match with existing mod from other platform
        $matchedMod = $this->findMatchingMod($normalizedData);

        if ($matchedMod) {
            return $matchedMod;
        }

        // Create new mod
        return Mod::create([
            'name' => $normalizedData['name'],
            'slug' => $this->generateUniqueSlug($normalizedData['external_slug']),
            'summary' => $normalizedData['summary'],
            'author' => $normalizedData['author'],
            'icon_url' => $normalizedData['icon_url'],
            'total_downloads' => $normalizedData['downloads'],
            'last_updated_at' => $normalizedData['last_updated'],
        ]);
    }

    /**
     * @param  array<string, mixed>  $normalizedData
     */
    private function findMatchingMod(array $normalizedData): ?Mod
    {
        $slug = $normalizedData['external_slug'];
        $name = $normalizedData['name'];

        // Try exact slug match first
        $mod = Mod::where('slug', $slug)->first();
        if ($mod) {
            return $mod;
        }

        // Try similar slug match
        $mod = Mod::where('slug', 'like', "%{$slug}%")->first();
        if ($mod) {
            return $mod;
        }

        // Try exact name match
        return Mod::where('name', $name)->first();
    }

    private function generateUniqueSlug(string $baseSlug): string
    {
        $slug = Str::slug($baseSlug);

        if (empty($slug)) {
            $slug = 'mod-'.Str::random(8);
        }

        $originalSlug = $slug;
        $count = 1;

        while (Mod::where('slug', $slug)->exists()) {
            $slug = $originalSlug.'-'.$count++;
        }

        return $slug;
    }

    /**
     * Check if two normalized mod data arrays represent the same mod.
     *
     * @param  array<string, mixed>  $mod1
     * @param  array<string, mixed>  $mod2
     */
    public function isSameMod(array $mod1, array $mod2): bool
    {
        // Exact slug match
        $slug1 = $mod1['slug'] ?? $mod1['external_slug'] ?? '';
        $slug2 = $mod2['slug'] ?? $mod2['external_slug'] ?? '';

        if ($slug1 && $slug2 && Str::slug($slug1) === Str::slug($slug2)) {
            return true;
        }

        // Exact name match (case insensitive)
        $name1 = strtolower(trim($mod1['name'] ?? ''));
        $name2 = strtolower(trim($mod2['name'] ?? ''));

        if ($name1 && $name2 && $name1 === $name2) {
            return true;
        }

        // Similar name + same author
        $author1 = strtolower(trim($mod1['author'] ?? ''));
        $author2 = strtolower(trim($mod2['author'] ?? ''));

        if ($name1 && $name2 && $author1 && $author2) {
            $nameSimilarity = similar_text($name1, $name2, $percent);
            if ($percent > 80 && $author1 === $author2) {
                return true;
            }
        }

        return false;
    }
}
