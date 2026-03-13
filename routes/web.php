<?php

use App\Http\Controllers\CarpetaController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoutingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoginLogController;
use App\Http\Controllers\ArchivoController;
use App\Http\Controllers\NotificacionController;

require __DIR__ . '/auth.php';

Route::group(['prefix' => '/', 'middleware' => 'auth'], function () {

    Route::get('', [RoutingController::class, 'index'])->name('root');
    Route::get('/home', [RoutingController::class, 'home'])->name('home');
    Route::get('/logout', [RoutingController::class, 'logout'])->name('logout_action');

    /* ── Mi Unidad ─────────────────────────────────────────────── */
    Route::get('/admin/mi_unidad', [CarpetaController::class, 'index'])->name('mi_unidad');
    Route::post('/admin/mi_unidad', [CarpetaController::class, 'store'])->name('mi_unidad.store');
    Route::post('/admin/mi_unidad/update', [CarpetaController::class, 'update'])->name('carpeta.update');

    /* ── Archivos (antes que /carpeta/{id} para evitar conflictos) */
    Route::post('/admin/mi_unidad/carpeta/archivo', [ArchivoController::class, 'upload'])->name('mi_unidad.archivo.upload');
    Route::post('/admin/mi_unidad/carpeta/archivo/delete', [ArchivoController::class, 'eliminar'])->name('mi_unidad.archivo.eliminar');

    /* ── Carpeta delete (antes que /carpeta y /carpeta/{id}) ───── */
    Route::post('/admin/mi_unidad/carpeta/delete', [CarpetaController::class, 'destroy'])->name('carpetas.destroy');

    /* ── Subcarpetas ────────────────────────────────────────────── */
    Route::post('/admin/mi_unidad/carpeta', [CarpetaController::class, 'crear_subcarpeta'])->name('mi_unidad.carpeta.crear_subcarpeta');
    // ✅ contents ANTES de show
    Route::get('/admin/mi_unidad/carpeta/{id}/contents', [CarpetaController::class, 'contents'])->name('mi_unidad.carpeta.contents');
    Route::get('/admin/mi_unidad/carpeta/{id}', [CarpetaController::class, 'show'])->name('mi_unidad.carpeta');

    /* ── Carpetas acciones ──────────────────────────────────────── */
    Route::get('/carpetas/buscar', [CarpetaController::class, 'buscar'])->name('carpetas.buscar');        // ← buscar ANTES de {id}
    Route::post('/carpetas/copiar/{id}', [CarpetaController::class, 'copiarCarpeta'])->name('carpetas.copiar');
    Route::get('/carpetas/{id}/descargar', [CarpetaController::class, 'descargarCarpeta'])->name('carpetas.descargar');

    /* ── Archivos descripción ───────────────────────────────────── */
    Route::post('/archivos/{id}/descripcion', [ArchivoController::class, 'updateDescripcion'])->name('archivos.updateDescripcion');

    /* ── Notificaciones ─────────────────────────────────────────── */
    Route::get('/admin/notificaciones', [NotificacionController::class, 'index'])->name('notificaciones');

    /* ── Usuarios ───────────────────────────────────────────────── */
    Route::resource('users', UserController::class);
    Route::get('/login-logs', [LoginLogController::class, 'index'])->name('login.logs');
    Route::post('/users/{id}/toggle-active', [UserController::class, 'toggleActive'])->name('users.toggleActive');

    /* ── Wildcards al final siempre ─────────────────────────────── */
    Route::get('{first}/{second}/{third}', [RoutingController::class, 'thirdLevel'])->name('third');
    Route::get('{first}/{second}', [RoutingController::class, 'secondLevel'])->name('second');
    Route::get('{any}', [RoutingController::class, 'root'])->name('any');
});
