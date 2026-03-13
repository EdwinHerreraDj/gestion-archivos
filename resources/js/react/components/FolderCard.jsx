// resources/js/react/components/FolderCard.jsx
import React, { useState } from "react";
import EditFolderModal from "./modals/EditFolderModal";

// Icono carpeta (feather folder)
const FolderIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-7 w-7 text-pink-500"
        viewBox="0 0 24 24"
        fill="rgba(236,72,153,0.25)"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
    </svg>
);

// Icono tres puntos vertical
const MoreIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="19" r="1" />
    </svg>
);

// Modal de confirmación eliminación
function ConfirmDeleteModal({ carpeta, onConfirm, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
                <div className="p-6 text-center">
                    <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-7 w-7 text-red-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">
                        ¿Eliminar carpeta?
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Vas a eliminar{" "}
                        <span className="font-semibold text-gray-700">
                            "{carpeta.nombre}"
                        </span>{" "}
                        y todo su contenido. Esta acción no se puede deshacer.
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 active:scale-95 transition-all"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FolderCard({
    carpeta,
    usuarios,
    role,
    onDelete,
    onUpdate,
    onCopy,
}) {
    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const canManage = role === "Super Admin" || role === "Admin";

    // Usar la relación user si viene cargada, si no buscar en usuarios
    const usuario =
        carpeta.user ?? usuarios.find((u) => u.id === carpeta.user_id);
    const inicial = (usuario?.name ?? "N").charAt(0).toUpperCase();
    const fecha = new Date(carpeta.created_at).toLocaleDateString("es-ES");

    const handleUpdate = async (data) => {
        const res = await onUpdate(data);
        if (res?.success) setShowEditModal(false);
    };

    const handleConfirmDelete = () => {
        setShowDeleteModal(false);
        onDelete(carpeta.id);
    };

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
                <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                        <a
                            href={`/admin/mi_unidad/carpeta/${carpeta.id}`}
                            className="flex items-center gap-3"
                        >
                            <div className="h-12 w-12 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                                <FolderIcon />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
                                    {carpeta.nombre}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {fecha}
                                </p>
                            </div>
                        </a>

                        {/* Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowMenu((v) => !v)}
                                className="inline-flex text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg p-1.5 transition"
                            >
                                <MoreIcon />
                            </button>

                            {showMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowMenu(false)}
                                    />
                                    <div className="absolute right-0 z-20 mt-1 w-44 bg-white shadow-xl border border-gray-100 rounded-xl p-1.5">
                                        {canManage && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setShowMenu(false);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="flex items-center gap-2.5 w-full py-2 px-3 text-sm rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-3.5 h-3.5"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowMenu(false);
                                                        onCopy(carpeta.id);
                                                    }}
                                                    className="flex items-center gap-2.5 w-full py-2 px-3 text-sm rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-3.5 h-3.5"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <rect
                                                            x="9"
                                                            y="9"
                                                            width="13"
                                                            height="13"
                                                            rx="2"
                                                            ry="2"
                                                        />
                                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                    </svg>
                                                    Duplicar
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowMenu(false);
                                                        setShowDeleteModal(
                                                            true,
                                                        );
                                                    }}
                                                    className="flex items-center gap-2.5 w-full py-2 px-3 text-sm rounded-lg text-red-500 hover:bg-red-50 transition"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="w-3.5 h-3.5"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                                        <path d="M10 11v6" />
                                                        <path d="M14 11v6" />
                                                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                                    </svg>
                                                    Eliminar
                                                </button>
                                            </>
                                        )}

                                        <a
                                            href={`/carpetas/${carpeta.id}/descargar`}
                                            className="flex items-center gap-2.5 py-2 px-3 text-sm rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-3.5 h-3.5"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="7 10 12 15 17 10" />
                                                <line
                                                    x1="12"
                                                    y1="15"
                                                    x2="12"
                                                    y2="3"
                                                />
                                            </svg>
                                            Descargar
                                        </a>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-gray-50 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 uppercase flex-shrink-0">
                            {inicial}
                        </div>
                        <span className="text-xs text-gray-500 truncate">
                            {usuario?.name ?? "No asignado"}
                        </span>
                    </div>
                </div>
            </div>

            {showEditModal && (
                <EditFolderModal
                    carpeta={carpeta}
                    usuarios={usuarios}
                    onConfirm={handleUpdate}
                    onClose={() => setShowEditModal(false)}
                />
            )}

            {showDeleteModal && (
                <ConfirmDeleteModal
                    carpeta={carpeta}
                    onConfirm={handleConfirmDelete}
                    onClose={() => setShowDeleteModal(false)}
                />
            )}
        </>
    );
}
