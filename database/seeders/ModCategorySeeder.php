<?php

namespace Database\Seeders;

use App\Models\ModCategory;
use Illuminate\Database\Seeder;

class ModCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Technology', 'slug' => 'technology', 'description' => 'Mods adding machines, automation, and tech progression'],
            ['name' => 'Magic', 'slug' => 'magic', 'description' => 'Mods adding magical systems, spells, and enchantments'],
            ['name' => 'Adventure', 'slug' => 'adventure', 'description' => 'Mods adding new dimensions, structures, and exploration content'],
            ['name' => 'Storage', 'slug' => 'storage', 'description' => 'Mods for item storage and inventory management'],
            ['name' => 'World Generation', 'slug' => 'worldgen', 'description' => 'Mods that modify terrain and biome generation'],
            ['name' => 'Utility', 'slug' => 'utility', 'description' => 'Quality of life and utility mods'],
            ['name' => 'Library', 'slug' => 'library', 'description' => 'API and library mods required by other mods'],
            ['name' => 'Decoration', 'slug' => 'decoration', 'description' => 'Mods adding decorative blocks and furniture'],
            ['name' => 'Food', 'slug' => 'food', 'description' => 'Mods adding new food items and farming mechanics'],
            ['name' => 'Mobs', 'slug' => 'mobs', 'description' => 'Mods adding new creatures and entities'],
            ['name' => 'Equipment', 'slug' => 'equipment', 'description' => 'Mods adding new armor, tools, and weapons'],
            ['name' => 'Optimization', 'slug' => 'optimization', 'description' => 'Performance and optimization mods'],
        ];

        foreach ($categories as $category) {
            ModCategory::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
