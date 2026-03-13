<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Models\CustomNotification;


class UserController extends Controller
{
    /* Aqui creamos la ruta que nos perimite llevar todo los usuarios a page users/index */
    public function index()
    {
        $currentRole = session('user_role');

        $users = User::when($currentRole !== 'Super Admin', function ($query) {
            $query->where('role', '!=', 'Super Admin');
        })->get();
        $notificaciones = CustomNotification::orderBy('created_at', 'desc')->get();
        return view('users.index', compact('users', 'notificaciones'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function toggleActive(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($user->id === session('user_id')) {
            return response()->json(['success' => false, 'message' => 'No puedes desactivarte a ti mismo.'], 403);
        }

        $user->active = !$user->active;
        $user->save();

        return response()->json([
            'success' => true,
            'active'  => $user->active,
            'message' => $user->active ? 'Usuario activado' : 'Usuario desactivado',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validar los datos de entrada
        $validatedData = $request->validate([
            'name' => 'required|string|max:30',
            'email' => 'required|email|max:30|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:Super Admin,Admin,User,Guest',
        ]);

        // Crear el usuario
        User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role' => $validatedData['role'],
        ]);

        // Redirigir con mensaje de éxito
        return redirect()->route('users.index')->with('success', 'Usuario creado exitosamente.');
    }



    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Validar los datos
        $validatedData = $request->validate([
            'name' => 'required|string|max:30',
            'email' => "required|string|email|max:30|unique:users,email,$id",
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'required|in:Super Admin,Admin,User,Guest',
        ]);

        // Actualizar el usuario
        $user->update([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'role' => $validatedData['role'],
            'password' => $request->filled('password') ? Hash::make($validatedData['password']) : $user->password,
        ]);

        return redirect()->route('users.index')->with('success', 'Usuario actualizado exitosamente.');
    }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        if (session('user_role') !== 'Super Admin') {
            return response()->json(['success' => false, 'message' => 'No tienes permiso para eliminar usuarios.'], 403);
        }

        try {
            $user = User::findOrFail($id);
            $user->delete();
            return response()->json(['success' => true, 'message' => 'Usuario eliminado exitosamente.'], 200);
        } catch (\Exception $e) {
            Log::error('Error al eliminar el usuario: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'Ocurrió un error al eliminar el usuario.'], 500);
        }
    }
}
