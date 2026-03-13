<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Archivo;
use Illuminate\Support\Facades\Storage;
use App\Models\CustomNotification;

class ArchivoController extends Controller
{
    public function upload(Request $request)
    {
        try {
            if (!$request->hasFile('file')) {
                return response()->json(['success' => false, 'message' => 'No se recibió ningún archivo.'], 400);
            }

            $id         = $request->input('id');
            $file       = $request->file('file');
            $fileName   = time() . '-' . $file->getClientOriginalName();
            $filePath   = $file->storeAs($id, $fileName, 'public');
            $usuarioId  = session('user_id');
            $nombreUser = session('user_name');

            $archivo              = new Archivo();
            $archivo->nombre      = $fileName;
            $archivo->carpeta_id  = $id;
            $archivo->user_id     = $usuarioId;   // ← guardamos quién sube
            $archivo->save();

            CustomNotification::create([
                'user_id' => $usuarioId ?? null,
                'type'    => 'Archivo Subido',
                'title'   => 'Nuevo archivo subido',
                'message' => 'El usuario "' . $nombreUser . '" ha subido un archivo nuevo. ' . $archivo->nombre,
            ]);

            return response()->json([
                'success'  => true,
                'message'  => 'Archivo subido correctamente.',
                'archivo'  => $archivo->load('user'),
                'file_url' => asset("storage/$filePath"),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al subir el archivo: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function eliminar(Request $request)
    {
        $id      = $request->id_archivo;
        $archivo = Archivo::find($id);

        if (!$archivo) {
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'message' => 'Archivo no encontrado.'], 404);
            }
            return redirect()->back()->with('error', 'Archivo no encontrado.');
        }

        // Validar permisos: User solo puede eliminar sus propios archivos
        $role      = session('user_role');
        $usuarioId = session('user_id');

        if ($role === 'User' && $archivo->user_id !== $usuarioId) {
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'message' => 'No tienes permiso para eliminar este archivo.'], 403);
            }
            return redirect()->back()->with('error', 'No tienes permiso para eliminar este archivo.');
        }

        Storage::delete('public/' . $archivo->carpeta_id . '/' . $archivo->nombre);
        $archivo->delete();

        $nombreUser = session('user_name');

        CustomNotification::create([
            'user_id' => $usuarioId ?? null,
            'type'    => 'Archivo Eliminado',
            'title'   => 'Un archivo ha sido eliminado',
            'message' => 'El usuario "' . $nombreUser . '" ha eliminado el archivo. ' . $archivo->nombre,
        ]);

        if ($request->expectsJson()) {
            return response()->json(['success' => true]);
        }
        return redirect()->back()->with('success', 'Archivo eliminado correctamente.');
    }

    public function updateDescripcion(Request $request, $id)
    {
        $archivo = Archivo::findOrFail($id);

        // Validar permisos: User solo puede editar descripción de sus propios archivos
        $role      = session('user_role');
        $usuarioId = session('user_id');

        if ($role === 'User' && $archivo->user_id !== $usuarioId) {
            return response()->json(['success' => false, 'message' => 'No tienes permiso.'], 403);
        }

        $request->validate([
            'descripcion' => 'nullable|string|max:255',
        ]);

        $archivo->descripcion = $request->descripcion;
        $archivo->save();

        return response()->json(['success' => true, 'descripcion' => $archivo->descripcion]);
    }
}
