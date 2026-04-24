<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class HealthCheckController extends Controller
{
    public function check()
    {
        try {
            // Check database connectivity
            DB::connection()->getPdo();

            return response()->json([
                'status' => 'ok',
                'message' => 'Application is healthy',
                'timestamp' => now()->toIso8601String(),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'unhealthy',
                'message' => 'Database connection failed',
                'error' => $e->getMessage(),
            ], 503);
        }
    }
}
