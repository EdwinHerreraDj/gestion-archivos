// resources/js/react/components/FileManager.jsx
import React, { useState } from "react";
import FolderGrid from "./FolderGrid";
import CreateFolderModal from "./modals/CreateFolderModal";
import { api } from "../api";

export default function FileManager({
    role,
    usuarios,
    carpetas: initialCarpetas,
}) {
    const [carpetas, setCarpetas] = useState(initialCarpetas);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCreate = async (data) => {
        setLoading(true);
        try {
            const res = await api.createCarpeta(data);
            if (res.success) {
                setCarpetas((prev) => [...prev, res.carpeta]);
                setShowCreateModal(false);
            }
        } catch (e) {
            console.error("Error al crear:", e);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        try {
            const res = await api.deleteCarpeta(id);
            if (res.success) {
                setCarpetas((prev) => prev.filter((c) => c.id !== id));
            }
        } catch (e) {
            console.error("Error al eliminar:", e);
        }
    };

    const handleUpdate = async (data) => {
        try {
            const res = await api.updateCarpeta(data);
            if (res.success) {
                setCarpetas((prev) =>
                    prev.map((c) => (c.id === data.id ? res.carpeta : c)),
                );
            }
            return res;
        } catch (e) {
            console.error("Error al actualizar:", e);
        }
    };

    const handleCopy = async (id) => {
        try {
            const res = await api.copiarCarpeta(id);
            if (res.success) {
                setCarpetas((prev) => [...prev, res.carpeta]);
            }
        } catch (e) {
            console.error("Error al copiar:", e);
        }
    };

    const handleRefresh = async () => {
        try {
            const res = await fetch("/admin/mi_unidad", {
                headers: { Accept: "application/json" },
            });
            const data = await res.json();
            if (data.carpetas) setCarpetas(data.carpetas);
        } catch (e) {
            console.error(e);
        }
    };

    const canManage = role === "Super Admin" || role === "Admin";

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Mi Unidad
                    </h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Gestiona las carpetas de tus pacientes
                    </p>
                </div>
                {canManage && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-indigo-700 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                            <line x1="12" y1="11" x2="12" y2="17" />
                            <line x1="9" y1="14" x2="15" y2="14" />
                        </svg>
                        Nueva Carpeta
                    </button>
                )}
            </div>

            <div className="border-t border-gray-100 my-6" />

            <FolderGrid
                carpetas={carpetas}
                usuarios={usuarios}
                role={role}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onCopy={handleCopy}
                onRefresh={handleRefresh}
            />

            {showCreateModal && (
                <CreateFolderModal
                    usuarios={usuarios}
                    loading={loading}
                    onConfirm={handleCreate}
                    onClose={() => setShowCreateModal(false)}
                />
            )}
        </div>
    );
}
