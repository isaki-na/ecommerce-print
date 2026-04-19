<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Filament\Pages\Dashboard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response|RedirectResponse
    {
        if (Auth::check()) {
            return $this->redirectByRole(request(), Auth::user());
        }

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request)
    {
        $request->authenticate();

        $request->session()->regenerate();

        return $this->redirectByRole($request, Auth::user());
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    private function redirectByRole(Request $request, $user): Response|RedirectResponse|SymfonyResponse
    {
        if ($user->hasAnyRole(['admin', 'operator'])) {
            $message = $user->hasRole('admin')
                ? 'Bienvenido administrador.'
                : 'Bienvenido operador. Puedes gestionar ventas y ajustes de stock.';

            session()->flash('welcome_admin_message', $message);

            // Inertia POST login needs a hard browser navigation to Filament so
            // the admin layout boots in a clean full-page context.
            if ($request->headers->has('X-Inertia')) {
                return Inertia::location(Dashboard::getUrl());
            }

            return redirect()->to(Dashboard::getUrl());
        }

        return to_route('home')->with('success', 'Bienvenido de nuevo a la tienda.');
    }
}
