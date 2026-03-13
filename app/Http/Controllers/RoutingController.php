<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Archivo;
use App\Models\Carpeta;
use App\Models\CustomNotification;


class RoutingController extends Controller
{
    public function __construct()
    {
        // Puedes habilitar middleware aquí si es necesario
        // $this->middleware('auth')->except(['login', 'logout']);
    }
    public function index()
    {
        return view('auth.login');
    }

    public function home()
    {
        if(session('user_role') === 'Guest' || session('user_role') === 'User' || session('user_role') === 'Admin') {
            return redirect()->route('mi_unidad');
        }
        $notificaciones = CustomNotification::orderBy('id', 'desc')->get();
        $totalUsers = User::count();
        $totalArchivos = Archivo::count();
        $totalCarpetas = Carpeta::count();

        return view('index', compact('totalUsers', 'totalArchivos', 'totalCarpetas',  'notificaciones')); 
    }


    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    public function root(Request $request, $first)
    {
        $mode = $request->query('mode');
        $demo = $request->query('demo');

        // Manejo explícito de rutas especiales
        if ($first === 'logout') {
            return $this->logout($request);
        }

        if ($first === 'assets') {
            return redirect()->route('home');
        }

        // Carga dinámica de vistas
        if (view()->exists($first)) {
            return view($first, compact('mode', 'demo'));
        }

        // Si la vista no existe, redirigir a un error o página predeterminada
        abort(404);
    }

    public function secondLevel(Request $request, $first, $second)
    {
        $mode = $request->query('mode');
        $demo = $request->query('demo');

        if ($first === 'assets') {
            return redirect()->route('home');
        }

        $viewName = "{$first}.{$second}";
        if (view()->exists($viewName)) {
            return view($viewName, compact('mode', 'demo'));
        }

        abort(404);
    }

    public function thirdLevel(Request $request, $first, $second, $third)
    {
        $mode = $request->query('mode');
        $demo = $request->query('demo');

        if ($first === 'assets') {
            return redirect()->route('home');
        }

        $viewName = "{$first}.{$second}.{$third}";
        if (view()->exists($viewName)) {
            return view($viewName, compact('mode', 'demo'));
        }

        abort(404);
    }
}
