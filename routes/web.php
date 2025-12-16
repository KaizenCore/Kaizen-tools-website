<?php

use App\Http\Controllers\Admin\PlayerController as AdminPlayerController;
use App\Http\Controllers\Admin\ReportController as AdminReportController;
use App\Http\Controllers\Mods\CategoryController;
use App\Http\Controllers\Mods\ModController;
use App\Http\Controllers\Players\PlayerController;
use App\Http\Controllers\Players\PlayerReportController;
use App\Http\Controllers\ResourcePacks\ResourcePackController;
use App\Http\Controllers\Skins\SkinController;
use App\Http\Controllers\Tools\ServerStatusController;
use App\Http\Controllers\Tools\UuidConverterController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

// Dashboard is the default home page (public)
Route::get('/', function () {
    return Inertia::render('dashboard');
})->name('home');

Route::get('/dashboard', function () {
    return redirect('/');
})->name('dashboard');

Route::get('/welcome', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('welcome');

// Mods routes (public)
Route::prefix('mods')->group(function () {
    Route::get('/', [ModController::class, 'index'])->name('mods.index');
    Route::get('/categories', [CategoryController::class, 'index'])->name('mods.categories.index');
    Route::get('/categories/{category:slug}', [CategoryController::class, 'show'])->name('mods.categories.show');
    Route::get('/{mod:slug}', [ModController::class, 'show'])->name('mods.show');
});

// Resource Packs routes (public)
Route::prefix('resource-packs')->group(function () {
    Route::get('/', [ResourcePackController::class, 'index'])->name('resource-packs.index');
    Route::get('/{slug}', [ResourcePackController::class, 'show'])->name('resource-packs.show');
});

// Skins routes (public)
Route::prefix('skins')->group(function () {
    Route::get('/', [SkinController::class, 'index'])->name('skins.index');
    Route::get('/{username}', [SkinController::class, 'show'])->name('skins.show');
});

// Players routes (public)
Route::prefix('players')->group(function () {
    Route::get('/', [PlayerController::class, 'index'])->name('players.index');
    Route::get('/{username}', [PlayerController::class, 'show'])->name('players.show');

    // Authenticated routes
    Route::middleware('auth')->group(function () {
        Route::post('/{player}/reports', [PlayerReportController::class, 'store'])->name('players.reports.store');
    });
});

// Tools routes (public)
Route::prefix('tools')->group(function () {
    Route::get('/server-status', [ServerStatusController::class, 'index'])->name('tools.server-status.index');
    Route::get('/nether-calculator', function () {
        return Inertia::render('tools/nether-calculator/index');
    })->name('tools.nether-calculator');
    Route::get('/uuid-converter', [UuidConverterController::class, 'index'])->name('tools.uuid-converter.index');
    Route::get('/banner-creator', function () {
        return Inertia::render('tools/banner-creator/index');
    })->name('tools.banner-creator');
    Route::get('/crafting-recipes', function () {
        return Inertia::render('tools/crafting-recipes/index');
    })->name('tools.crafting-recipes');
    Route::get('/enchantment-calculator', function () {
        return Inertia::render('tools/enchantment-calculator/index');
    })->name('tools.enchantment-calculator');
    Route::get('/firework-designer', function () {
        return Inertia::render('tools/firework-designer/index');
    })->name('tools.firework-designer');
    Route::get('/color-codes', function () {
        return Inertia::render('tools/color-codes/index');
    })->name('tools.color-codes');
    Route::get('/xp-calculator', function () {
        return Inertia::render('tools/xp-calculator/index');
    })->name('tools.xp-calculator');
    Route::get('/skin-viewer', function () {
        return Inertia::render('tools/skin-viewer/index');
    })->name('tools.skin-viewer');
    Route::get('/redstone-calculator', function () {
        return Inertia::render('tools/redstone-calculator/index');
    })->name('tools.redstone-calculator');
    Route::get('/flat-world-generator', function () {
        return Inertia::render('tools/flat-world-generator/index');
    })->name('tools.flat-world-generator');
    Route::get('/mob-spawning', function () {
        return Inertia::render('tools/mob-spawning/index');
    })->name('tools.mob-spawning');
    Route::get('/command-generator', function () {
        return Inertia::render('tools/command-generator/index');
    })->name('tools.command-generator');
    Route::get('/entity-generator', function () {
        return Inertia::render('tools/entity-generator/index');
    })->name('tools.entity-generator');
    Route::get('/advancement-generator', function () {
        return Inertia::render('tools/advancement-generator/index');
    })->name('tools.advancement-generator');
    Route::get('/armor-stand-editor', function () {
        return Inertia::render('tools/armor-stand-editor/index');
    })->name('tools.armor-stand-editor');
    Route::get('/potion-brewing', function () {
        return Inertia::render('tools/potion-brewing/index');
    })->name('tools.potion-brewing');
    Route::get('/loot-table-generator', function () {
        return Inertia::render('tools/loot-table-generator/index');
    })->name('tools.loot-table-generator');
    Route::get('/villager-trading', function () {
        return Inertia::render('tools/villager-trading/index');
    })->name('tools.villager-trading');
    Route::get('/coordinate-calculator', function () {
        return Inertia::render('tools/coordinate-calculator/index');
    })->name('tools.coordinate-calculator');
    Route::get('/tellraw-generator', function () {
        return Inertia::render('tools/tellraw-generator/index');
    })->name('tools.tellraw-generator');
    Route::get('/sign-book-generator', function () {
        return Inertia::render('tools/sign-book-generator/index');
    })->name('tools.sign-book-generator');
    Route::get('/recipe-generator', function () {
        return Inertia::render('tools/recipe-generator/index');
    })->name('tools.recipe-generator');
    Route::get('/biome-guide', function () {
        return Inertia::render('tools/biome-guide/index');
    })->name('tools.biome-guide');
    Route::get('/particle-generator', function () {
        return Inertia::render('tools/particle-generator/index');
    })->name('tools.particle-generator');
    Route::get('/scoreboard-generator', function () {
        return Inertia::render('tools/scoreboard-generator/index');
    })->name('tools.scoreboard-generator');
    Route::get('/bossbar-generator', function () {
        return Inertia::render('tools/bossbar-generator/index');
    })->name('tools.bossbar-generator');
    Route::get('/target-selector', function () {
        return Inertia::render('tools/target-selector-generator/index');
    })->name('tools.target-selector');
    Route::get('/effect-generator', function () {
        return Inertia::render('tools/effect-generator/index');
    })->name('tools.effect-generator');
    Route::get('/team-generator', function () {
        return Inertia::render('tools/team-generator/index');
    })->name('tools.team-generator');
    Route::get('/fill-clone-generator', function () {
        return Inertia::render('tools/fill-clone-generator/index');
    })->name('tools.fill-clone-generator');
    Route::get('/execute-generator', function () {
        return Inertia::render('tools/execute-generator/index');
    })->name('tools.execute-generator');
    Route::get('/item-generator', function () {
        return Inertia::render('tools/item-generator/index');
    })->name('tools.item-generator');
});

// API routes
Route::prefix('api')->group(function () {
    Route::get('skins/search', [SkinController::class, 'search'])->name('api.skins.search');
    Route::get('players/search', [PlayerController::class, 'search'])->name('api.players.search');
    Route::post('tools/server-status/check', [ServerStatusController::class, 'check'])->name('api.tools.server-status.check');
    Route::post('tools/uuid-converter', [UuidConverterController::class, 'convert'])->name('api.tools.uuid-converter.convert');
});

// Admin routes
Route::prefix('admin')->middleware(['auth', 'admin'])->group(function () {
    // Dashboard
    Route::get('/', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');

    // Players management
    Route::get('/players', [AdminPlayerController::class, 'index'])->name('admin.players.index');
    Route::get('/players/{player}', [AdminPlayerController::class, 'show'])->name('admin.players.show');
    Route::post('/players/{player}/override', [AdminPlayerController::class, 'override'])->name('admin.players.override');
    Route::delete('/players/{player}/override', [AdminPlayerController::class, 'removeOverride'])->name('admin.players.removeOverride');
    Route::post('/players/recalculate-all', [AdminPlayerController::class, 'recalculateAll'])->name('admin.players.recalculateAll');

    // Reports management
    Route::get('/reports', [AdminReportController::class, 'index'])->name('admin.reports.index');
    Route::post('/reports/{report}/review', [AdminReportController::class, 'review'])->name('admin.reports.review');
    Route::post('/reports/bulk-review', [AdminReportController::class, 'bulkReview'])->name('admin.reports.bulkReview');
});

require __DIR__.'/settings.php';
