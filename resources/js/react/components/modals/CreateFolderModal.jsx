// resources/js/react/components/modals/CreateFolderModal.jsx
import React, { useState } from "react";

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
        console.log("userId:", userId, "tipo:", typeof userId);
        console.log("nombre:", nombre);
        if (!nombre || !userId) {
            console.log("Validación falló — alguno está vacío");
            return;
        }
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
                        ✕
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
                        <select
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition"
                            required
                        >
                            <option value="">Seleccione un usuario</option>
                            {usuarios.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
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
                            disabled={loading}
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
