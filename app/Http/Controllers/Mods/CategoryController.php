<?php

namespace App\Http\Controllers\Mods;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ModResource;
use App\Models\ModCategory;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = ModCategory::withCount('mods')
            ->orderBy('name')
            ->get();

        return Inertia::render('mods/categories/index', [
            'categories' => CategoryResource::collection($categories)->resolve(),
        ]);
    }

    public function show(ModCategory $category): Response
    {
        $mods = $category->mods()
            ->with(['sources', 'categories'])
            ->orderByDesc('total_downloads')
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('mods/categories/show', [
            'category' => new CategoryResource($category),
            'mods' => ModResource::collection($mods),
        ]);
    }
}
