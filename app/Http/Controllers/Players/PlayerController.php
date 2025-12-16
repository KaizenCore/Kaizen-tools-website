<?php

namespace App\Http\Controllers\Players;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlayerResource;
use App\Models\Player;
use App\Services\SkinExplorer\SkinService;
use App\Services\TrustScore\TrustScoreService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlayerController extends Controller
{
    public function __construct(
        public SkinService $skinService,
        public TrustScoreService $trustScoreService
    ) {}

    public function index(): Response
    {
        $recentPlayers = Player::query()
            ->orderBy('updated_at', 'desc')
            ->limit(12)
            ->get();

        return Inertia::render('players/index', [
            'recentPlayers' => PlayerResource::collection($recentPlayers)->resolve(),
        ]);
    }

    public function show(string $username): Response
    {
        // First try to get player data from Mojang API via SkinService
        $skinData = $this->skinService->getSkinByUsername($username);

        if (! $skinData) {
            abort(404, 'Player not found');
        }

        // Find or create the player record
        $player = Player::query()->updateOrCreate(
            ['uuid' => $skinData['uuid']],
            ['username' => $skinData['username']]
        );

        // Touch updated_at to track recent lookups
        $player->touch();

        // Get user's existing report for this player (if any)
        $userReport = null;
        if (auth()->check()) {
            $userReport = $player->reports()
                ->where('reporter_user_id', auth()->id())
                ->first();
        }

        return Inertia::render('players/show', [
            'player' => (new PlayerResource($player))->resolve(),
            'skinData' => [
                'skin_url' => $skinData['skin_url'],
                'cape_url' => $skinData['cape_url'],
                'is_slim' => $skinData['slim'] ?? false,
            ],
            'userReport' => $userReport ? [
                'id' => $userReport->id,
                'report_type' => $userReport->report_type->value,
                'status' => $userReport->status->value,
            ] : null,
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

        $player = Player::query()->updateOrCreate(
            ['uuid' => $skinData['uuid']],
            ['username' => $skinData['username']]
        );

        $player->touch();

        return response()->json([
            'success' => true,
            'data' => (new PlayerResource($player))->resolve(),
        ]);
    }
}
