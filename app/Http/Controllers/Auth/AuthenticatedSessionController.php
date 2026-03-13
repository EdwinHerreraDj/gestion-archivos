<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    public function create()
    {
        return view('auth.login');
    }
    /**
     * Handle an incoming authentication request.
     *
     * @param  \App\Http\Requests\Auth\LoginRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        // Intentar autenticar al usuario
        if (!Auth::attempt($credentials, $request->filled('remember'))) {
            // Si las credenciales son incorrectas, redirigir con un mensaje de error genérico
            return redirect()->back()->withErrors([
                'login' => 'Las credenciales proporcionadas no son válidas.',
            ])->withInput($request->only('email', 'remember'));
        }

        if (!Auth::user()->active) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect()->back()->withErrors([
                'login' => 'Tu cuenta está desactivada. Contacta al administrador.',
            ])->withInput($request->only('email', 'remember'));
        }

        // Regenerar la sesión para proteger contra fijación de sesión
        $request->session()->regenerate();

        // Guardar el rol, nombre y correo electrónico del usuario autenticado en la sesión
        $user = Auth::user();
        session([
            'user_id' => $user->id,
            'user_role' => $user->role,
            'user_name' => $user->name,
            'user_email' => $user->email,
        ]);

        if (Auth::check()) {

            if (Auth::user()->role === 'Admin' || Auth::user()->role === 'Super Admin') {
                return redirect()->route('home');
            } else {
                return redirect()->route('mi_unidad');
            }
        }
        return redirect()->route('login');
    }
}
