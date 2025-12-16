<?php

namespace App\Http\Controllers\Players;

use App\Enums\ReportStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Players\StorePlayerReportRequest;
use App\Models\Player;
use App\Models\PlayerReport;
use App\Services\TrustScore\TrustScoreService;
use Illuminate\Http\JsonResponse;

class PlayerReportController extends Controller
{
    public function __construct(
        public TrustScoreService $trustScoreService
    ) {}

    public function store(StorePlayerReportRequest $request, Player $player): JsonResponse
    {
        // Check if user already reported this player with this type
        $existingReport = PlayerReport::query()
            ->where('player_id', $player->id)
            ->where('reporter_user_id', auth()->id())
            ->where('report_type', $request->validated('report_type'))
            ->first();

        if ($existingReport) {
            return response()->json([
                'success' => false,
                'message' => 'You have already submitted a report of this type for this player.',
            ], 422);
        }

        $report = PlayerReport::create([
            'player_id' => $player->id,
            'reporter_user_id' => auth()->id(),
            'report_type' => $request->validated('report_type'),
            'reason' => $request->validated('reason'),
            'evidence_url' => $request->validated('evidence_url'),
            'status' => ReportStatus::Pending,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Report submitted successfully. Thank you for helping keep the community safe.',
            'data' => [
                'id' => $report->id,
                'report_type' => $report->report_type->value,
                'status' => $report->status->value,
            ],
        ]);
    }
}
