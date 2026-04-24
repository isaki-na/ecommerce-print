<?php

namespace App\Http\Controllers;

class HealthCheckController extends Controller
{
    public function check()
    {
        return response()->json([
            'status' => 'ok',
            'message' => 'Application is healthy',
            'timestamp' => now()->toIso8601String(),
        ], 200);
    }
}
