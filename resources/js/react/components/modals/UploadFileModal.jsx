// resources/js/react/components/modals/UploadFileModal.jsx
import React, { useEffect, useRef } from "react";

export default function UploadFileModal({ carpetaId, onUploadSuccess, onClose }) {
    const formRef = useRef(null);

    useEffect(() => {
        if (!formRef.current) return;

        const dropzone = new window.Dropzone(formRef.current, {
            paramName:            'file',
            dictDefaultMessage:   'Arrastra los archivos aquí para subirlos',
            acceptedFiles:        '.jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.mp3,.wav,.mp4,.avi,.mov,.mkv,.wmv,.zip,.rar,.7z',
            maxFilesize:          50,
            headers:              { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') },
            success: (file, response) => {
                if (response.success) {
                    const notyf = new window.Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
                    notyf.success(response.message);
                    onUploadSuccess(response.archivo);
                }
            },
            error: (file, msg) => {
                const notyf = new window.Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });
                notyf.error('Error al subir: ' + msg);
            },
        });

        return () => dropzone.destroy();
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                    <div>
                        <h3 className="font-bold text-gray-900 text-base">Subir Archivo</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Arrastra o selecciona los archivos</p>
                    </div>
                    <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">✕</button>
                </div>
                <div className="p-6">
                    <form
                        ref={formRef}
                        action="/admin/mi_unidad/carpeta/archivo"
                        method="POST"
                        className="dropzone border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:border-indigo-400 transition p-4"
                    >
                        <input type="hidden" name="id" value={carpetaId} />
                        <div className="fallback">
                            <input type="file" name="file" multiple />
                        </div>
                    </form>
                    <div className="flex justify-end mt-4">
                        <button onClick={onClose}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all">
                            Listo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}