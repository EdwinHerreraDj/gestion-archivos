<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CustomNotification;

class NotificacionController extends Controller
{
    public function index()
    {
        /* Validamos para que estos dos usuarios no pueda cargara la pagina y sean redirigidos */
        if(session('user_role') === 'Guest' || session('user_role') === 'User'){
            return redirect()->route('mi_unidad');
        }
        $notificaciones = CustomNotification::orderBy('id', 'desc')->get();
        return view('admin.notificaciones.index', compact('notificaciones'));
    }
}
