<?php

namespace App\Http\Controllers\Tools;

use App\Http\Controllers\Controller;
use App\Services\MinecraftServer\ServerStatusService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServerStatusController extends Controller
{
    public function __construct(
        private ServerStatusService $serverStatusService
    ) {}

    public function index(): Response
    {
        return Inertia::render('tools/server-status/index');
    }

    public function check(Request $request): JsonResponse
    {
        $request->validate([
            'address' => ['required', 'string', 'max:255'],
        ]);

        $address = trim($request->input('address'));

        // Basic validation to prevent injection attempts
        if (preg_match('/[^a-zA-Z0-9.\-:]/', $address)) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid server address format.',
            ], 422);
        }

        $status = $this->serverStatusService->checkStatus($address);

        return response()->json($status);
    }
}
