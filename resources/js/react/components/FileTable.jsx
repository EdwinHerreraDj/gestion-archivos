// resources/js/react/components/FileTable.jsx
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

function FileIcon({ extension }) {
    if (["png", "jpg", "jpeg"].includes(extension))
        return (
            <svg
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                fill="rgb(234,67,53)"
                style={{ width: 16, height: 16, flexShrink: 0 }}
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16 14.222V1.778C16 .796 15.204 0 14.222 0H1.778C.796 0 0 .796 0 1.778v12.444C0 15.204.796 16 1.778 16h12.444c.982 0 1.778-.796 1.778-1.778zM4.889 9.333l2.222 2.671L10.222 8l4 5.333H1.778l3.11-4z"
                />
            </svg>
        );
    if (extension === "pdf")
        return (
            <svg
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                fill="rgb(234,67,53)"
                style={{ width: 16, height: 16, flexShrink: 0 }}
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.778 0h12.444C15.2 0 16 .8 16 1.778v12.444C16 15.2 15.2 16 14.222 16H1.778C.8 16 0 15.2 0 14.222V1.778C0 .8.8 0 1.778 0zm2.666 7.556h-.888v-.89h.888v.89zm1.334 0c0 .737-.596 1.333-1.334 1.333h-.888v1.778H2.222V5.333h2.222c.738 0 1.334.596 1.334 1.334v.889zm6.666-.89h2.223V5.334H11.11v5.334h1.333V8.889h1.334V7.556h-1.334v-.89zm-2.222 2.667c0 .738-.595 1.334-1.333 1.334H6.667V5.333h2.222c.738 0 1.333.596 1.333 1.334v2.666zm-1.333 0H8V6.667h.889v2.666z"
                />
            </svg>
        );
    if (["doc", "docx"].includes(extension))
        return (
            <svg
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                fill="rgb(66,133,244)"
                style={{ width: 16, height: 16, flexShrink: 0 }}
            >
                <path d="M14.222 0H1.778C.8 0 0 .8 0 1.778v12.444C0 15.2.8 16 1.778 16h12.444C15.2 16 16 15.2 16 14.222V1.778C16 .8 15.2 0 14.222 0zm-3.11 12.444H9.777L8 5.778l-1.778 6.666H4.89L2.756 3.556h1.51l1.37 6.675 1.742-6.675h1.244l1.751 6.675 1.36-6.675h1.511l-2.133 8.888z" />
            </svg>
        );
    if (["xls", "xlsx", "csv", "xlsm"].includes(extension))
        return (
            <svg
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                fill="rgb(52,168,83)"
                style={{ width: 16, height: 16, flexShrink: 0 }}
            >
                <path d="M14.222 0H1.778C.796 0 0 .796 0 1.778v12.444C0 15.204.796 16 1.778 16h12.444c.982 0 1.778-.796 1.778-1.778V1.778C16 .796 15.204 0 14.222 0zm-2.489 12.444H9.956L8 9.067l-1.956 3.377H4.267L7.11 8 4.267 3.556h1.777L8 6.933l1.956-3.377h1.777L8.89 8l2.844 4.444z" />
            </svg>
        );
    if (["mp4", "avi", "mov", "mkv", "wmv", "flv"].includes(extension))
        return (
            <svg
                viewBox="0 0 16 12"
                xmlns="http://www.w3.org/2000/svg"
                fill="rgb(234,67,53)"
                style={{ width: 16, height: 16, flexShrink: 0 }}
            >
                <path d="M12.8 0l1.6 3.2H12L10.4 0H8.8l1.6 3.2H8L6.4 0H4.8l1.6 3.2H4L2.4 0h-.8C.72 0 .008.72.008 1.6L0 11.2c0 .88.72 1.6 1.6 1.6h12.8c.88 0 1.6-.72 1.6-1.6V0h-3.2z" />
            </svg>
        );
    return (
        <svg
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: 16, height: 16, flexShrink: 0 }}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.222 0H1.778C.8 0 .008.8.008 1.778L0 4.444v9.778C0 15.2.8 16 1.778 16h12.444C15.2 16 16 15.2 16 14.222V1.778C16 .8 15.2 0 14.222 0zm0 7.111h-7.11v7.111H5.332v-7.11H1.778V5.332h3.555V1.778h1.778v3.555h7.111v1.778z"
            />
        </svg>
    );
}

function ConfirmDeleteArchivoModal({ nombre, onConfirm, onClose }) {
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
                        ¿Eliminar archivo?
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Vas a eliminar{" "}
                        <span className="font-semibold text-gray-700">
                            "{nombre}"
                        </span>
                        . Esta acción no se puede deshacer.
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

// ← userId añadido como prop

function FileRow({
    archivo,
    carpeta,
    role,
    userId,
    onDelete,
    onUpdateDescripcion,
}) {
    const [editingDesc, setEditingDesc] = useState(false);
    const [descripcion, setDescripcion] = useState(archivo.descripcion ?? "");
    const [showMenu, setShowMenu] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const btnRef = useRef(null);

    const canManage = role === "Super Admin" || role === "Admin";
    const canDelete =
        canManage ||
        (role === "User" && Number(archivo.user_id) === Number(userId));
    const canEditDesc =
        canManage ||
        (role === "User" && Number(archivo.user_id) === Number(userId));

    const extension = archivo.nombre.split(".").pop().toLowerCase();
    const fileUrl = `/storage/${carpeta.id}/${archivo.nombre}`;
    const fecha_c = new Date(archivo.created_at).toLocaleString("es-ES");
    const fecha_u = new Date(archivo.updated_at).toLocaleString("es-ES");

    const handleOpenMenu = () => {
        if (btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setMenuPos({
                top: rect.bottom + window.scrollY + 4,
                left: rect.right + window.scrollX - 176,
            });
        }
        setShowMenu((v) => !v);
    };

    const handleDescripcionKeyPress = async (e) => {
        if (e.key === "Enter") {
            await onUpdateDescripcion(archivo.id, descripcion);
            setEditingDesc(false);
        }
    };

    return (
        <>
            <tr className="hover:bg-indigo-50/20 transition-colors">
                <td className="px-5 py-3.5 text-xs text-gray-400 font-mono">
                    #{archivo.id}
                </td>
                <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                        <FileIcon extension={extension} />
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-indigo-600 hover:underline truncate max-w-xs"
                        >
                            {archivo.nombre}
                        </a>
                    </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-500">
                    {editingDesc ? (
                        <input
                            autoFocus
                            type="text"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            onKeyPress={handleDescripcionKeyPress}
                            onBlur={() => setEditingDesc(false)}
                            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-400 outline-none w-full"
                        />
                    ) : (
                        <span
                            onClick={() => canEditDesc && setEditingDesc(true)}
                            className={`${canEditDesc ? "cursor-pointer hover:text-indigo-600" : ""} transition-colors`}
                        >
                            {descripcion ||
                                (canEditDesc ? "Haz clic para agregar" : "—")}
                        </span>
                    )}
                </td>
                <td className="px-5 py-3.5 text-xs text-gray-400">{fecha_c}</td>
                <td className="px-5 py-3.5 text-xs text-gray-400">{fecha_u}</td>
                <td className="px-5 py-3.5">
                    <button
                        ref={btnRef}
                        onClick={handleOpenMenu}
                        className="inline-flex text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg p-1.5 transition"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="19" r="1" />
                        </svg>
                    </button>
                </td>
            </tr>

            {/* ← Portal: el dropdown se monta en document.body, fuera de la tabla */}
            {showMenu &&
                createPortal(
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setShowMenu(false)}
                        />
                        <div
                            className="fixed z-50 w-44 bg-white shadow-xl border border-gray-100 rounded-xl p-1.5"
                            style={{ top: menuPos.top, left: menuPos.left }}
                        >
                            {canDelete && (
                                <button
                                    onClick={() => {
                                        setShowMenu(false);
                                        setShowDeleteModal(true);
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
                            )}
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noreferrer"
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
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                Descargar
                            </a>
                        </div>
                    </>,
                    document.body,
                )}

            {/* ← Modal también en portal para evitar problemas de z-index */}
            {showDeleteModal &&
                createPortal(
                    <ConfirmDeleteArchivoModal
                        nombre={archivo.nombre}
                        onConfirm={() => {
                            setShowDeleteModal(false);
                            onDelete(archivo.id);
                        }}
                        onClose={() => setShowDeleteModal(false)}
                    />,
                    document.body,
                )}
        </>
    );
}

// ← userId añadido como prop
export default function FileTable({
    archivos,
    carpeta,
    role,
    userId,
    onDelete,
    onUpdateDescripcion,
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60">
                <h4 className="text-base font-semibold text-gray-700">
                    Archivos en {carpeta.nombre}
                </h4>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                        <tr className="text-xs uppercase tracking-wider text-gray-500">
                            <th className="px-5 py-3 text-left font-semibold">
                                ID
                            </th>
                            <th className="px-5 py-3 text-left font-semibold">
                                Nombre
                            </th>
                            <th className="px-5 py-3 text-left font-semibold">
                                Descripción
                            </th>
                            <th className="px-5 py-3 text-left font-semibold">
                                Creación
                            </th>
                            <th className="px-5 py-3 text-left font-semibold">
                                Modificación
                            </th>
                            <th className="px-5 py-3 text-left font-semibold">
                                Acción
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {archivos.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-5 py-10 text-center text-sm text-gray-400"
                                >
                                    No hay archivos en esta carpeta
                                </td>
                            </tr>
                        ) : (
                            archivos.map((archivo) => (
                                <FileRow
                                    key={archivo.id}
                                    archivo={archivo}
                                    carpeta={carpeta}
                                    role={role}
                                    userId={userId} // ← pasado correctamente
                                    onDelete={onDelete}
                                    onUpdateDescripcion={onUpdateDescripcion}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
