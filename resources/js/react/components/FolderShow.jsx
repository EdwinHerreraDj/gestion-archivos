// resources/js/react/components/FolderShow.jsx
import React, { useState } from "react";
import SubfolderGrid from "./SubfolderGrid";
import FileTable from "./FileTable";
import CreateSubfolderModal from "./modals/CreateSubfolderModal";
import UploadFileModal from "./modals/UploadFileModal";
import { useToast } from "./Toast";
import { api } from "../api";

export default function FolderShow({
    carpeta,
    subcarpetas: initialSubs,
    archivos: initialFiles,
    role,
    userId,
}) {
    // ── Navegación interna ───────────────────────────
    // path = array de { id, nombre } que representa la ruta actual
    const toast = useToast();
    const [path, setPath] = useState([
        { id: carpeta.id, nombre: carpeta.nombre },
    ]);
    const [currentFolder, setCurrentFolder] = useState(carpeta);
    const [subcarpetas, setSubcarpetas] = useState(initialSubs);
    const [archivos, setArchivos] = useState(initialFiles);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [navigating, setNavigating] = useState(false);

    const canManage = role !== "Guest" && role !== "User";
    const canUpload = role !== "Guest";

    // Entrar en una subcarpeta
    const navigateToFolder = async (folder) => {
        setNavigating(true);
        try {
            const res = await api.getFolderContents(folder.id);
            if (res.success) {
                setCurrentFolder(folder);
                setSubcarpetas(res.subcarpetas);
                setArchivos(res.archivos);
                setPath((prev) => [
                    ...prev,
                    { id: folder.id, nombre: folder.nombre },
                ]);
            }
        } catch (e) {
            console.error(e);
        }
        setNavigating(false);
    };

    // Navegar a cualquier nivel del breadcrumb
    const navigateToBreadcrumb = async (index) => {
        const target = path[index];
        // Si es el último, no hacer nada
        if (index === path.length - 1) return;

        setNavigating(true);
        try {
            const res = await api.getFolderContents(target.id);
            if (res.success) {
                setCurrentFolder(target);
                setSubcarpetas(res.subcarpetas);
                setArchivos(res.archivos);
                setPath((prev) => prev.slice(0, index + 1));
            }
        } catch (e) {
            console.error(e);
        }
        setNavigating(false);
    };

    // ── CRUD (usan currentFolder en vez de carpeta) ──
    const handleCreateSub = async (nombre) => {
        setLoading(true);
        try {
            const res = await api.createSubcarpeta({
                nombre,
                carpeta_padre_id: currentFolder.id,
                user_id: userId,
            });
            if (res.success) {
                setSubcarpetas((prev) => [...prev, res.carpeta]);
                setShowCreateModal(false);
                toast.success("Subcarpeta creada exitosamente");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error al crear la subcarpeta");
        }
        setLoading(false);
    };

    const handleDeleteSub = async (id) => {
        try {
            const res = await api.deleteSubcarpeta(id);
            if (res.success) {
                setSubcarpetas((prev) => prev.filter((s) => s.id !== id));
                toast.success("Subcarpeta eliminada exitosamente");
            }
        } catch (e) {
            console.error(e);
            toast.error("Error al eliminar la subcarpeta");
        }
    };

    const handleUpdateSub = async (data) => {
        try {
            const res = await api.updateSubcarpeta(data);
            if (res.success) {
                setSubcarpetas((prev) =>
                    prev.map((s) => (s.id === data.id ? res.carpeta : s)),
                );
            }
            return res;
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeleteArchivo = async (id) => {
        try {
            const res = await api.deleteArchivo(id);
            if (res.success)
                setArchivos((prev) => prev.filter((a) => a.id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpdateDescripcion = async (id, descripcion) => {
        try {
            const res = await api.updateDescripcion(id, descripcion);
            if (res.success) {
                setArchivos((prev) =>
                    prev.map((a) => (a.id === id ? { ...a, descripcion } : a)),
                );
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleUploadSuccess = (archivo) => {
        setArchivos((prev) => [...prev, archivo]);
    };

    return (
        <div>
            {/* ── Header ──────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        {currentFolder.nombre}
                    </h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Contenido de la carpeta
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Volver: si estamos en subcarpeta → subir un nivel, si no → /admin/mi_unidad */}
                    {path.length > 1 ? (
                        <button
                            onClick={() => navigateToBreadcrumb(path.length - 2)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 active:scale-95 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                            Volver
                        </button>
                    ) : (
                        
                      <a href="/admin/mi_unidad"
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 active:scale-95 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12" />
                                <polyline points="12 19 5 12 12 5" />
                            </svg>
                            Volver
                        </a>
                    )}

                    {canManage && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 active:scale-95 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                <line x1="12" y1="11" x2="12" y2="17" />
                                <line x1="9" y1="14" x2="15" y2="14" />
                            </svg>
                            Nueva Carpeta
                        </button>
                    )}

                    {canUpload && (
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white text-sm font-semibold rounded-xl hover:bg-cyan-700 active:scale-95 transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            Subir Archivo
                        </button>
                    )}
                </div>
            </div>

            {/* ── Breadcrumb ──────────────────────────────────── */}
            <nav className="flex items-center gap-1.5 mb-6 px-3 py-2.5 bg-gray-50/80 rounded-xl border border-gray-100 overflow-x-auto">
                {/* Icono raíz */}
                <button
                    onClick={() => navigateToBreadcrumb(0)}
                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition flex-shrink-0"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    <span className="hidden sm:inline">{path[0].nombre}</span>
                </button>

                {path.slice(1).map((item, i) => {
                    const isLast = i === path.length - 2;
                    const realIndex = i + 1;
                    return (
                        <React.Fragment key={item.id}>
                            <svg className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                            {isLast ? (
                                <span className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
                                    {item.nombre}
                                </span>
                            ) : (
                                <button
                                    onClick={() => navigateToBreadcrumb(realIndex)}
                                    className="text-sm text-gray-500 hover:text-indigo-600 transition truncate max-w-[200px]"
                                >
                                    {item.nombre}
                                </button>
                            )}
                        </React.Fragment>
                    );
                })}

                {navigating && (
                    <div className="ml-auto flex-shrink-0">
                        <div className="h-4 w-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </nav>

            <div className="border-t border-gray-100 my-6" />

            {/* Subcarpetas — ahora con navegación */}
            <SubfolderGrid
                subcarpetas={subcarpetas}
                carpetaPadre={currentFolder}
                role={role}
                onDelete={handleDeleteSub}
                onUpdate={handleUpdateSub}
                onNavigate={navigateToFolder}
            />

            <FileTable
                archivos={archivos}
                carpeta={currentFolder}
                role={role}
                userId={userId}
                onDelete={handleDeleteArchivo}
                onUpdateDescripcion={handleUpdateDescripcion}
            />

            {showCreateModal && (
                <CreateSubfolderModal
                    loading={loading}
                    onConfirm={handleCreateSub}
                    onClose={() => setShowCreateModal(false)}
                />
            )}
            {showUploadModal && (
                <UploadFileModal
                    carpetaId={currentFolder.id}
                    onUploadSuccess={handleUploadSuccess}
                    onClose={() => setShowUploadModal(false)}
                />
            )}
        </div>
    );
}