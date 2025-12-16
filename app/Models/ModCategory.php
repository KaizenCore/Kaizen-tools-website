<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ModCategory extends Model
{
    /** @use HasFactory<\Database\Factories\ModCategoryFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',
        'icon',
        'description',
    ];

    /**
     * @return BelongsToMany<Mod, $this>
     */
    public function mods(): BelongsToMany
    {
        return $this->belongsToMany(Mod::class, 'category_mod');
    }
}
