<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TrustLevel;
use App\Http\Controllers\Controller;
use App\Http\Resources\Admin\PlayerResource;
use App\Models\Player;
use App\Services\TrustScore\TrustScoreService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlayerController extends Controller
{
    public function __construct(
        private TrustScoreService $trustScoreService
    ) {}

    public function index(Request $request): Response
    {
        $query = Player::query()
            ->withCount('reports')
            ->orderBy('updated_at', 'desc');

        if ($request->filled('search')) {
            $query->where('username', 'like', '%'.$request->input('search').'%');
        }

        if ($request->filled('trust_level')) {
            $query->where('trust_level', $request->input('trust_level'));
        }

        $players = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/players/index', [
            'players' => PlayerResource::collection($players)->resolve(),
            'pagination' => [
                'current_page' => $players->currentPage(),
                'last_page' => $players->lastPage(),
                'per_page' => $players->perPage(),
                'total' => $players->total(),
            ],
            'filters' => [
                'search' => $request->input('search', ''),
                'trust_level' => $request->input('trust_level', ''),
            ],
        ]);
    }

    public function show(Player $player): Response
    {
        $player->load(['reports.reporter', 'adminOverrideBy']);
        $player->loadCount(['reports', 'verifiedReports']);

        return Inertia::render('admin/players/show', [
            'player' => (new PlayerResource($player))->resolve(),
            'reports' => $player->reports->map(fn ($report) => [
                'id' => $report->id,
                'report_type' => $report->report_type->value,
                'report_type_label' => $report->report_type->label(),
                'reason' => $report->reason,
                'evidence_url' => $report->evidence_url,
                'status' => $report->status->value,
                'status_label' => $report->status->label(),
                'reporter' => $report->reporter ? [
                    'id' => $report->reporter->id,
                    'name' => $report->reporter->name,
                ] : null,
                'created_at' => $report->created_at->toISOString(),
            ]),
        ]);
    }

    public function override(Request $request, Player $player): JsonResponse
    {
        $request->validate([
            'trust_level' => ['required', 'string', 'in:trusted,neutral,suspect,unknown'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $trustLevel = TrustLevel::from($request->input('trust_level'));

        $this->trustScoreService->setAdminOverride(
            $player,
            $trustLevel,
            $request->user(),
            $request->input('notes')
        );

        return response()->json([
            'success' => true,
            'message' => 'Trust level override applied successfully.',
        ]);
    }

    public function removeOverride(Player $player): JsonResponse
    {
        $this->trustScoreService->removeAdminOverride($player);

        return response()->json([
            'success' => true,
            'message' => 'Override removed. Trust score recalculated.',
        ]);
    }

    public function recalculateAll(): JsonResponse
    {
        $count = $this->trustScoreService->recalculateAllScores();

        return response()->json([
            'success' => true,
            'message' => "Recalculated trust scores for {$count} players.",
        ]);
    }
}
