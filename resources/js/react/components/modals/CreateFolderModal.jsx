// resources/js/react/components/modals/CreateFolderModal.jsx
import React, { useState, useRef, useEffect } from "react";

function UserSearchSelect({ usuarios, value, onChange }) {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const selected = usuarios.find((u) => String(u.id) === String(value));
    const filtrados =
        query.trim() === ""
            ? usuarios
            : usuarios.filter((u) =>
                  u.name.toLowerCase().includes(query.toLowerCase()),
              );

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <div
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:border-indigo-400 transition"
            >
                {selected ? (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
                            {selected.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-700 truncate">
                            {selected.name}
                        </span>
                    </div>
                ) : (
                    <span className="text-gray-400 flex-1">
                        Seleccione un usuario
                    </span>
                )}
                {value ? (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange("");
                            setQuery("");
                        }}
                        className="text-gray-300 hover:text-gray-500 transition flex-shrink-0"
                    >
                        <i className="mgc_close_line text-sm" />
                    </button>
                ) : (
                    <i className="mgc_down_line text-gray-400 text-sm flex-shrink-0" />
                )}
            </div>

            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                    <div className="p-2 border-b border-gray-100">
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar usuario..."
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                        />
                    </div>
                    <ul className="max-h-48 overflow-y-auto py-1">
                        {filtrados.length === 0 ? (
                            <li className="px-3 py-2 text-sm text-gray-400 text-center">
                                Sin resultados
                            </li>
                        ) : (
                            filtrados.map((u) => (
                                <li
                                    key={u.id}
                                    onClick={() => {
                                        onChange(String(u.id));
                                        setQuery("");
                                        setOpen(false);
                                    }}
                                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 transition flex items-center gap-2 ${String(value) === String(u.id) ? "text-indigo-600 font-medium bg-indigo-50/50" : "text-gray-600"}`}
                                >
                                    <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
                                        {u.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="truncate">{u.name}</span>
                                    {String(value) === String(u.id) && (
                                        <i className="mgc_check_line ml-auto text-indigo-500 text-sm" />
                                    )}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default function CreateFolderModal({
    usuarios,
    loading,
    onConfirm,
    onClose,
}) {
    const [nombre, setNombre] = useState("");
    const [userId, setUserId] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nombre || !userId) return;
        onConfirm({ nombre, user_id: userId });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <div>
                        <h3 className="font-bold text-gray-900 text-base">
                            Nueva Carpeta
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Crea y asigna una carpeta a un usuario
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition"
                    >
                        <i className="mgc_close_line text-base" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                            Nombre de la Carpeta
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition"
                            placeholder="Nombre de la carpeta"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                            Asignar a Usuario
                        </label>
                        <UserSearchSelect
                            usuarios={usuarios}
                            value={userId}
                            onChange={setUserId}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !userId}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all shadow-sm disabled:opacity-50"
                        >
                            {loading ? "Creando..." : "Crear Carpeta"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
