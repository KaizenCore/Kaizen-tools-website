<?php

namespace App\Http\Controllers\Admin;

use App\Enums\ReportStatus;
use App\Http\Controllers\Controller;
use App\Models\PlayerReport;
use App\Services\TrustScore\TrustScoreService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function __construct(
        private TrustScoreService $trustScoreService
    ) {}

    public function index(Request $request): Response
    {
        $query = PlayerReport::query()
            ->with(['player', 'reporter'])
            ->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        } else {
            // Default to pending reports
            $query->where('status', ReportStatus::Pending);
        }

        if ($request->filled('report_type')) {
            $query->where('report_type', $request->input('report_type'));
        }

        $reports = $query->paginate(20)->withQueryString();

        return Inertia::render('admin/reports/index', [
            'reports' => $reports->getCollection()->map(fn ($report) => [
                'id' => $report->id,
                'player' => [
                    'id' => $report->player->id,
                    'username' => $report->player->username,
                    'uuid' => $report->player->uuid,
                    'trust_level' => $report->player->trust_level->value,
                ],
                'reporter' => $report->reporter ? [
                    'id' => $report->reporter->id,
                    'name' => $report->reporter->name,
                ] : null,
                'report_type' => $report->report_type->value,
                'report_type_label' => $report->report_type->label(),
                'reason' => $report->reason,
                'evidence_url' => $report->evidence_url,
                'status' => $report->status->value,
                'status_label' => $report->status->label(),
                'created_at' => $report->created_at->toISOString(),
            ])->values()->toArray(),
            'pagination' => [
                'current_page' => $reports->currentPage(),
                'last_page' => $reports->lastPage(),
                'per_page' => $reports->perPage(),
                'total' => $reports->total(),
            ],
            'filters' => [
                'status' => $request->input('status', 'pending'),
                'report_type' => $request->input('report_type', ''),
            ],
            'stats' => [
                'pending' => PlayerReport::where('status', ReportStatus::Pending)->count(),
                'verified' => PlayerReport::where('status', ReportStatus::Verified)->count(),
                'rejected' => PlayerReport::where('status', ReportStatus::Rejected)->count(),
            ],
        ]);
    }

    public function review(Request $request, PlayerReport $report): JsonResponse
    {
        $request->validate([
            'status' => ['required', 'string', 'in:verified,rejected,resolved'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $report->update([
            'status' => $request->input('status'),
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'admin_notes' => $request->input('notes'),
        ]);

        // Recalculate player's trust score if report was verified
        if ($request->input('status') === 'verified') {
            $this->trustScoreService->updateTrustLevel($report->player);
        }

        return response()->json([
            'success' => true,
            'message' => 'Report reviewed successfully.',
        ]);
    }

    public function bulkReview(Request $request): JsonResponse
    {
        $request->validate([
            'report_ids' => ['required', 'array', 'min:1'],
            'report_ids.*' => ['integer', 'exists:player_reports,id'],
            'status' => ['required', 'string', 'in:verified,rejected,resolved'],
        ]);

        $reports = PlayerReport::whereIn('id', $request->input('report_ids'))->get();
        $playerIds = [];

        foreach ($reports as $report) {
            $report->update([
                'status' => $request->input('status'),
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
            ]);
            $playerIds[] = $report->player_id;
        }

        // Recalculate trust scores for affected players if verified
        if ($request->input('status') === 'verified') {
            $players = \App\Models\Player::whereIn('id', array_unique($playerIds))->get();
            foreach ($players as $player) {
                $this->trustScoreService->updateTrustLevel($player);
            }
        }

        return response()->json([
            'success' => true,
            'message' => count($reports).' reports reviewed successfully.',
        ]);
    }
}
