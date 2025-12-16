<?php

namespace App\Models;

use App\Enums\TrustLevel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Player extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'username',
        'trust_level',
        'trust_score',
        'admin_override',
        'admin_override_at',
        'admin_override_by',
        'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'trust_level' => TrustLevel::class,
            'trust_score' => 'integer',
            'admin_override' => 'boolean',
            'admin_override_at' => 'datetime',
        ];
    }

    public function reports(): HasMany
    {
        return $this->hasMany(PlayerReport::class);
    }

    public function verifiedReports(): HasMany
    {
        return $this->hasMany(PlayerReport::class)->where('status', 'verified');
    }

    public function adminOverrideBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_override_by');
    }
}
