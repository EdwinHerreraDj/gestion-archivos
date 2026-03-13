<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LoginLog;
use App\Models\CustomNotification;

class LoginLogController extends Controller
{
    public function index()
    {
        // Validamos para que estos dos usuarios no pueda cargara la pagina y sean redirigidos
        if(session('user_role') === 'Guest' || session('user_role') === 'User'){
            return redirect()->route('mi_unidad');
        }
        // Obtener todos los registros, incluyendo la información del usuario relacionado
        $logs = LoginLog::with('user')->latest()->get(); 

        $notificaciones = CustomNotification::orderBy('created_at', 'desc')->get();

        return view('users.logs', compact('logs', 'notificaciones'));
    }
}
