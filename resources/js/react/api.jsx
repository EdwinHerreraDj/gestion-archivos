// resources/js/react/api.js
const csrf = () => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    if (!meta) {
        console.error("CSRF token no encontrado");
        return "";
    }
    return meta.getAttribute("content");
};

const handleResponse = async (res) => {
    if (!res.ok) {
        const text = await res.text();
        console.error("Error del servidor:", text);
        throw new Error(`HTTP ${res.status}`);
    }
    return res.json();
};

export const api = {
    /* ── Carpetas ───────────────────────────────── */
    createCarpeta: (data) =>
        fetch("/admin/mi_unidad", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrf(),
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        }).then(handleResponse),

    updateCarpeta: (data) =>
        fetch("/admin/mi_unidad/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrf(),
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        }).then(handleResponse),

    deleteCarpeta: (id) =>
        fetch("/admin/mi_unidad/carpeta/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrf(),
                Accept: "application/json",
            },
            body: JSON.stringify({ id }),
        }).then(handleResponse),

    getFolderContents: (id) =>
        fetch(`/admin/mi_unidad/carpeta/${id}/contents`, {
            headers: {
                Accept: "application/json",
                "X-CSRF-TOKEN": csrf(),
            },
        }).then(handleResponse),

    copiarCarpeta: (id) =>
        fetch(`/carpetas/copiar/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrf(),
                Accept: "application/json",
            },
        }).then(handleResponse),

    /* ── Subcarpetas (mismos endpoints, misma lógica) ── */
    createSubcarpeta: (data) =>
        fetch("/admin/mi_unidad/carpeta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrf(),
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        }).then(handleResponse),

    updateSubcarpeta: (data) =>
        fetch("/admin/mi_unidad/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrf(),
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        }).then(handleResponse),

    deleteSubcarpeta: (id) =>
        fetch("/admin/mi_unidad/carpeta/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrf(),
                Accept: "application/json",
            },
            body: JSON.stringify({ id }),
        }).then(handleResponse),

    /* ── Archivos ───────────────────────────────── */
    deleteArchivo: (id) =>
        fetch("/admin/mi_unidad/carpeta/archivo/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrf(),
                Accept: "application/json",
            },
            body: JSON.stringify({ id_archivo: id }),
        }).then(handleResponse),

    updateDescripcion: (id, descripcion) =>
        fetch(`/archivos/${id}/descripcion`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrf(),
            },
            body: JSON.stringify({ descripcion }),
        }).then((r) => r.json()),
};
