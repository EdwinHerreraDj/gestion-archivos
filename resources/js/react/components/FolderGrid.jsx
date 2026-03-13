// resources/js/react/components/FolderGrid.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import FolderCard from "./FolderCard";

function UserFilter({ usuarios, value, onChange }) {
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

    const handleSelect = (u) => {
        onChange(u ? String(u.id) : "");
        setQuery("");
        setOpen(false);
    };

    return (
        <div ref={ref} className="relative">
            <div
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 pl-3 pr-2 py-2 text-sm border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-indigo-400 transition min-w-[260px]"
            >
                <span className="flex items-center justify-center h-5 w-5 flex-shrink-0">
                    <i className="mgc_user_3_line text-gray-400 text-base leading-none" />
                </span>
                <span
                    className={`flex-1 truncate ${selected ? "text-gray-700" : "text-gray-400"}`}
                >
                    {selected ? selected.name : "Todos los usuarios"}
                </span>
                {value ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(null);
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
                <div className="absolute z-30 mt-1 w-full min-w-[260px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
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
                        <li
                            onClick={() => handleSelect(null)}
                            className={`px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 transition ${!value ? "text-indigo-600 font-medium" : "text-gray-600"}`}
                        >
                            Todos los usuarios
                        </li>
                        {filtrados.length === 0 ? (
                            <li className="px-3 py-2 text-sm text-gray-400 text-center">
                                Sin resultados
                            </li>
                        ) : (
                            filtrados.map((u) => (
                                <li
                                    key={u.id}
                                    onClick={() => handleSelect(u)}
                                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 transition flex items-center gap-2 ${String(value) === String(u.id) ? "text-indigo-600 font-medium bg-indigo-50/50" : "text-gray-600"}`}
                                >
                                    <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
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

export default function FolderGrid({
    carpetas,
    usuarios,
    role,
    onDelete,
    onUpdate,
    onCopy,
    onRefresh,
}) {
    const [busqueda, setBusqueda] = useState("");
    const [filtroUsuario, setFiltroUsuario] = useState("");

    const canFilterByUser = role === "Super Admin" || role === "Admin";

    const carpetasFiltradas = useMemo(() => {
        return carpetas.filter((c) => {
            const matchNombre = c.nombre
                .toLowerCase()
                .includes(busqueda.toLowerCase());
            const matchUsuario =
                filtroUsuario === "" ||
                String(c.user_id) === String(filtroUsuario);
            return matchNombre && matchUsuario;
        });
    }, [carpetas, busqueda, filtroUsuario]);

    return (
        <div>
            {/* ── Barra de filtros ─────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-3 mb-6 p-3 bg-gray-50/80 rounded-xl border border-gray-100 card">
                {/* Buscador */}
                <p className="text-sm font-medium text-gray-500">Barra de filtros</p>
                <div className="relative flex-1 min-w-[220px]">
                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar carpeta..."
                        className="w-full pl-10 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition"
                    />
                    {busqueda && (
                        <button
                            onClick={() => setBusqueda("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
                        >
                            <i className="mgc_close_line text-sm" />
                        </button>
                    )}
                </div>

                {canFilterByUser && (
                    <div className="hidden sm:block h-8 w-px bg-gray-200" />
                )}

                {canFilterByUser && (
                    <UserFilter
                        usuarios={usuarios}
                        value={filtroUsuario}
                        onChange={setFiltroUsuario}
                    />
                )}

                <div className="flex items-center gap-2 ml-auto">
                    {(busqueda || filtroUsuario) && (
                        <span className="text-xs text-gray-400 whitespace-nowrap tabular-nums">
                            {carpetasFiltradas.length} de {carpetas.length}
                        </span>
                    )}
                    <button
                        onClick={onRefresh}
                        title="Actualizar"
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white border border-gray-200 rounded-lg transition flex-shrink-0"
                    >
                        <i className="mgc_refresh_2_line text-base" />
                    </button>
                </div>
            </div>

            {/* ── Grid o estado vacío ──────────────────────────── */}
            {carpetasFiltradas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                        <svg
                            className="h-8 w-8 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-base font-semibold text-gray-600 mb-1">
                        {busqueda || filtroUsuario
                            ? "Sin resultados"
                            : "No hay carpetas"}
                    </h2>
                    <p className="text-sm text-gray-400">
                        {busqueda || filtroUsuario
                            ? "Prueba con otros filtros"
                            : "Crea una carpeta para empezar"}
                    </p>
                    {(busqueda || filtroUsuario) && (
                        <button
                            onClick={() => {
                                setBusqueda("");
                                setFiltroUsuario("");
                            }}
                            className="mt-3 text-xs text-indigo-500 hover:underline"
                        >
                            Limpiar filtros
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid 2xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
                    {carpetasFiltradas.map((carpeta) => (
                        <FolderCard
                            key={carpeta.id}
                            carpeta={carpeta}
                            usuarios={usuarios}
                            role={role}
                            onDelete={onDelete}
                            onUpdate={onUpdate}
                            onCopy={onCopy}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
