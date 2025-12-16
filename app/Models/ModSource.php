<?php

namespace App\Models;

use App\Enums\ModPlatform;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModSource extends Model
{
    /** @use HasFactory<\Database\Factories\ModSourceFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'mod_id',
        'platform',
        'external_id',
        'external_slug',
        'project_url',
        'downloads',
        'rating',
        'latest_version',
        'supported_versions',
        'supported_loaders',
        'raw_data',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'platform' => ModPlatform::class,
            'downloads' => 'integer',
            'rating' => 'decimal:2',
            'supported_versions' => 'array',
            'supported_loaders' => 'array',
            'raw_data' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Mod, $this>
     */
    public function mod(): BelongsTo
    {
        return $this->belongsTo(Mod::class);
    }
}
