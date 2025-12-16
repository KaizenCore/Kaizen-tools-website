<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Mod extends Model
{
    /** @use HasFactory<\Database\Factories\ModFactory> */
    use HasFactory;

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'summary',
        'description',
        'author',
        'icon_url',
        'total_downloads',
        'last_updated_at',
        'last_synced_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'total_downloads' => 'integer',
            'last_updated_at' => 'datetime',
            'last_synced_at' => 'datetime',
        ];
    }

    /**
     * Check if the mod needs to be synced (older than 24 hours).
     */
    public function needsSync(): bool
    {
        if (! $this->last_synced_at) {
            return true;
        }

        return $this->last_synced_at->lt(now()->subHours(24));
    }

    /**
     * @return HasMany<ModSource, $this>
     */
    public function sources(): HasMany
    {
        return $this->hasMany(ModSource::class);
    }

    /**
     * @return BelongsToMany<ModCategory, $this>
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(ModCategory::class, 'category_mod');
    }

    /**
     * @return HasOne<ModSource, $this>
     */
    public function modrinthSource(): HasOne
    {
        return $this->hasOne(ModSource::class)->where('platform', 'modrinth');
    }

    /**
     * @return HasOne<ModSource, $this>
     */
    public function curseforgeSource(): HasOne
    {
        return $this->hasOne(ModSource::class)->where('platform', 'curseforge');
    }
}
