<?php

namespace App\Http\Controllers\Tools;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tools\ConvertUuidRequest;
use App\Services\MinecraftServer\UuidService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class UuidConverterController extends Controller
{
    public function __construct(
        private UuidService $uuidService
    ) {}

    public function index(): Response
    {
        return Inertia::render('tools/uuid-converter/index');
    }

    public function convert(ConvertUuidRequest $request): JsonResponse
    {
        $input = $request->input('input');
        $result = $this->uuidService->convert($input);

        if (! $result) {
            return response()->json([
                'success' => false,
                'message' => 'Player not found. Please check the username or UUID.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }
}
