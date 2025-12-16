<?php

namespace App\Http\Controllers\Skins;

use App\Http\Controllers\Controller;
use App\Http\Resources\SkinResource;
use App\Models\Skin;
use App\Services\SkinExplorer\SkinService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SkinController extends Controller
{
    public function __construct(
        private SkinService $skinService
    ) {}

    public function index(): Response
    {
        $recentSkins = Skin::query()
            ->orderBy('updated_at', 'desc')
            ->limit(12)
            ->get();

        return Inertia::render('skins/index', [
            'recentSearches' => [
                'recent' => SkinResource::collection($recentSkins)->resolve(),
                'popular' => [],
            ],
        ]);
    }

    public function show(string $username): Response
    {
        $skinData = $this->skinService->getSkinByUsername($username);

        if (! $skinData) {
            abort(404, 'Player not found');
        }

        // Store or update skin in database
        $skin = Skin::query()->updateOrCreate(
            ['uuid' => $skinData['uuid']],
            [
                'username' => $skinData['username'],
                'skin_url' => $skinData['skin_url'],
                'cape_url' => $skinData['cape_url'],
                'skin_type' => $skinData['slim'] ? 'slim' : 'classic',
            ]
        );

        return Inertia::render('skins/show', [
            'skin' => (new SkinResource($skin))->resolve(),
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'username' => ['required', 'string', 'min:3', 'max:16'],
        ]);

        $username = $request->input('username');
        $skinData = $this->skinService->getSkinByUsername($username);

        if (! $skinData) {
            return response()->json([
                'success' => false,
                'message' => 'Player not found',
            ], 404);
        }

        // Store or update skin in database
        $skin = Skin::query()->updateOrCreate(
            ['uuid' => $skinData['uuid']],
            [
                'username' => $skinData['username'],
                'skin_url' => $skinData['skin_url'],
                'cape_url' => $skinData['cape_url'],
                'skin_type' => $skinData['slim'] ? 'slim' : 'classic',
            ]
        );

        return response()->json([
            'success' => true,
            'data' => (new SkinResource($skin))->resolve(),
        ]);
    }
}
