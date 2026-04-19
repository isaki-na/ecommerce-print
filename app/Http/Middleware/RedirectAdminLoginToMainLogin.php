<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectAdminLoginToMainLogin
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->is('admin/login')) {
            return redirect()->route('login');
        }

        return $next($request);
    }
}
