<?php

namespace App\Models;

use App\Enums\ModPlatform;
use Illuminate\Database\Eloquent\Model;

class SyncLog extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'platform',
        'status',
        'mods_synced',
        'mods_created',
        'mods_updated',
        'error_message',
        'started_at',
        'completed_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'platform' => ModPlatform::class,
            'mods_synced' => 'integer',
            'mods_created' => 'integer',
            'mods_updated' => 'integer',
            'started_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }
}
