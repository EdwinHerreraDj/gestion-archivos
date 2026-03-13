<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carpeta;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use ZipArchive;
use App\Models\CustomNotification;

class CarpetaController extends Controller
{
    public function index()
    {
        $notificaciones = CustomNotification::orderBy('created_at', 'desc')->get();
        $role           = session('user_role', 'Guest');
        $usuarioId      = session('user_id');
        $usuarios       = User::all();

        if ($role === 'User') {
            $carpetas = Carpeta::with('user')->whereNull('carpeta_padre_id')->where('user_id', $usuarioId)->get();
        } else {
            $carpetas = Carpeta::with('user')->whereNull('carpeta_padre_id')->get();
        }

        if (request()->expectsJson()) {
            return response()->json(['carpetas' => $carpetas]);
        }

        return view('mi_unidad.index', compact('carpetas', 'usuarios', 'notificaciones', 'role', 'usuarioId'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre'  => 'required',
            'user_id' => 'required|exists:users,id',
        ]);

        $carpeta          = new Carpeta();
        $carpeta->nombre  = $request->nombre;
        $carpeta->user_id = $request->user_id;
        $carpeta->save();
        $carpeta->load('user');

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'carpeta' => $carpeta]);
        }
        return redirect()->route('mi_unidad')->with('success', 'Carpeta creada');
    }

    public function contents(string $id)
    {
        $role      = session('user_role', 'Guest');
        $usuarioId = session('user_id');
        $carpeta   = Carpeta::findOrFail($id);

        if ($role === 'User' && $carpeta->user_id !== $usuarioId) {
            return response()->json(['success' => false, 'message' => 'Sin permiso'], 403);
        }

        $subcarpetas = $carpeta->carpetasHijos()->with('user')->get();
        $archivos    = $carpeta->archivos()->with('user')->get();

        return response()->json([
            'success'     => true,
            'subcarpetas' => $subcarpetas,
            'archivos'    => $archivos,
        ]);
    }

    public function show(string $id)
    {
        $notificaciones = CustomNotification::orderBy('created_at', 'desc')->get();
        $role           = session('user_role', 'Guest');
        $usuarioId      = session('user_id');

        $carpeta     = Carpeta::with('user')->findOrFail($id);
        $subcarpetas = $carpeta->carpetasHijos()->with('user')->get();
        $archivos    = $carpeta->archivos()->with('user')->get();

        // User solo puede ver su propia carpeta
        if ($role === 'User' && $carpeta->user_id !== $usuarioId) {
            abort(403, 'No tienes permiso para ver esta carpeta.');
        }

        return view('mi_unidad.show', compact('carpeta', 'subcarpetas', 'archivos', 'notificaciones', 'role', 'usuarioId'));
    }

    public function update(Request $request)
    {
        $request->validate([
            'nombre'  => 'required|max:191',
            'id'      => 'required|exists:carpetas,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $carpeta          = Carpeta::findOrFail($request->id);
        $carpeta->nombre  = $request->nombre;
        $carpeta->user_id = $request->user_id;
        $carpeta->save();
        $carpeta->load('user');
        $this->actualizarUserIdSubcarpetas($carpeta->id, $request->user_id);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'carpeta' => $carpeta]);
        }
        return redirect()->back()->with('success', 'Carpeta actualizada');
    }

    private function actualizarUserIdSubcarpetas(int $carpetaId, int $userId)
    {
        $subcarpetas = Carpeta::where('carpeta_padre_id', $carpetaId)->get();
        foreach ($subcarpetas as $subcarpeta) {
            $subcarpeta->user_id = $userId;
            $subcarpeta->save();
            $this->actualizarUserIdSubcarpetas($subcarpeta->id, $userId);
        }
    }

    public function crear_subcarpeta(Request $request)
    {
        $request->validate([
            'nombre'           => 'required',
            'carpeta_padre_id' => 'required',
            'user_id'          => 'required|exists:users,id',
        ]);

        $carpeta                    = new Carpeta();
        $carpeta->nombre            = $request->nombre;
        $carpeta->carpeta_padre_id  = $request->carpeta_padre_id;
        $carpeta->user_id           = $request->user_id;
        $carpeta->save();

        if ($request->expectsJson()) {
            $carpeta->load('user');
            return response()->json(['success' => true, 'carpeta' => $carpeta]);
        }
        return redirect()->back()->with('success', 'Subcarpeta creada');
    }

    public function destroy(Request $request)
    {
        $request->validate(['id' => 'required|exists:carpetas,id']);
        $carpeta = Carpeta::findOrFail($request->id);

        try {
            foreach ($carpeta->archivos as $archivo) {
                Storage::delete("public/{$carpeta->id}/{$archivo->nombre}");
                $archivo->delete();
            }
            $this->eliminarSubcarpetas($carpeta);
            $carpeta->delete();
            Storage::deleteDirectory("public/{$carpeta->id}");

            if ($request->expectsJson()) {
                return response()->json(['success' => true]);
            }
            return redirect()->back()->with('success', 'Carpeta eliminada');
        } catch (\Exception $e) {
            Log::error('Error al eliminar carpeta: ' . $e->getMessage());
            if ($request->expectsJson()) {
                return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
            }
            return redirect()->back()->with('error', 'Error al eliminar');
        }
    }

    protected function eliminarSubcarpetas($carpeta)
    {
        foreach ($carpeta->carpetasHijos as $subcarpeta) {
            foreach ($subcarpeta->archivos as $archivo) {
                $filePath = "public/{$subcarpeta->id}/{$archivo->nombre}";
                if (Storage::exists($filePath)) {
                    Storage::delete($filePath);
                } else {
                    Log::warning("Archivo no encontrado en subcarpeta: $filePath");
                }
                $archivo->delete();
            }
            $this->eliminarSubcarpetas($subcarpeta);
            $subcarpeta->delete();
            $directoryPath = "public/{$subcarpeta->id}";
            if (Storage::exists($directoryPath)) {
                Storage::deleteDirectory($directoryPath);
            }
        }
    }

    public function descargarCarpeta($id)
    {
        $carpeta = Carpeta::findOrFail($id);

        if (!$this->tieneContenido($carpeta)) {
            return redirect()->back()->with([
                'notification' => [
                    'type'    => 'error',
                    'message' => 'La carpeta no se puede descargar porque está vacía.',
                ]
            ]);
        }

        $zipFileName = "carpeta_{$carpeta->id}.zip";
        $zipFilePath = storage_path("app/public/{$zipFileName}");
        $zip         = new ZipArchive;

        if ($zip->open($zipFilePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {
            $this->agregarCarpetaAlZip($carpeta, $zip);
            $zip->close();
            return response()->download($zipFilePath)->deleteFileAfterSend(true);
        }

        return redirect()->back()->with('error', 'No se pudo crear el archivo ZIP.');
    }

    protected function agregarCarpetaAlZip($carpeta, ZipArchive $zip, $rutaBase = '')
    {
        $carpetaPath = "public/{$carpeta->id}";
        foreach ($carpeta->archivos as $archivo) {
            $archivoPath = "$carpetaPath/{$archivo->nombre}";
            if (Storage::exists($archivoPath)) {
                $zip->addFile(storage_path("app/{$archivoPath}"), $rutaBase . $archivo->nombre);
            }
        }
        foreach ($carpeta->carpetasHijos as $subcarpeta) {
            $this->agregarCarpetaAlZip($subcarpeta, $zip, $rutaBase . $subcarpeta->nombre . '/');
        }
    }

    protected function tieneContenido($carpeta)
    {
        if ($carpeta->archivos()->count() > 0) return true;
        foreach ($carpeta->carpetasHijos as $subcarpeta) {
            if ($this->tieneContenido($subcarpeta)) return true;
        }
        return false;
    }

    public function copiarCarpeta(Request $request, string $id)
    {
        $carpetaOriginal                    = Carpeta::findOrFail($id);
        $nuevaCarpeta                       = new Carpeta();
        $nuevaCarpeta->nombre               = $carpetaOriginal->nombre;
        $nuevaCarpeta->user_id              = $carpetaOriginal->user_id;
        $nuevaCarpeta->carpeta_padre_id     = $carpetaOriginal->carpeta_padre_id;
        $nuevaCarpeta->save();
        $nuevaCarpeta->load('user');
        $this->copiarSubcarpetas($carpetaOriginal->id, $nuevaCarpeta->id);

        if ($request->expectsJson()) {
            return response()->json(['success' => true, 'carpeta' => $nuevaCarpeta]);
        }
        return redirect()->back()->with('success', 'Carpeta copiada correctamente.');
    }

    private function copiarSubcarpetas(int $idOriginal, int $idNueva)
    {
        $subcarpetas = Carpeta::where('carpeta_padre_id', $idOriginal)->get();
        foreach ($subcarpetas as $subcarpeta) {
            $nuevaSubcarpeta                    = new Carpeta();
            $nuevaSubcarpeta->nombre            = $subcarpeta->nombre;
            $nuevaSubcarpeta->user_id           = $subcarpeta->user_id;
            $nuevaSubcarpeta->carpeta_padre_id  = $idNueva;
            $nuevaSubcarpeta->save();
            $this->copiarSubcarpetas($subcarpeta->id, $nuevaSubcarpeta->id);
        }
    }

    public function buscar(Request $request)
    {
        $notificaciones = CustomNotification::orderBy('created_at', 'desc')->get();
        $query          = Carpeta::with('user')->whereNull('carpeta_padre_id');

        if ($request->filled('nombre')) {
            $query->where('nombre', 'like', '%' . $request->nombre . '%');
        }
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $carpetas = $query->get();
        $usuarios = User::all();
        $role     = session('user_role');

        return view('mi_unidad.index', compact('carpetas', 'usuarios', 'role', 'notificaciones'));
    }
}
