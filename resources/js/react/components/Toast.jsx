import React, {
    useState,
    useEffect,
    useCallback,
    createContext,
    useContext,
} from "react";

const ToastContext = createContext(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
    return ctx;
}

function ToastItem({ toast, onRemove }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => onRemove(toast.id), 300);
        }, toast.duration || 3000);
        return () => clearTimeout(timer);
    }, []);

    const styles = {
        success: "bg-emerald-500",
        error: "bg-red-500",
        info: "bg-indigo-500",
    };

    const icons = {
        success: "mgc_check_circle_fill",
        error: "mgc_close_circle_fill",
        info: "mgc_information_fill",
    };

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all duration-300 ${styles[toast.type] || styles.info} ${visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
        >
            <i className={`${icons[toast.type] || icons.info} text-lg`} />
            <span>{toast.message}</span>
            <button
                onClick={() => {
                    setVisible(false);
                    setTimeout(() => onRemove(toast.id), 300);
                }}
                className="ml-auto text-white/70 hover:text-white transition"
            >
                <i className="mgc_close_line text-sm" />
            </button>
        </div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback(
        (message, type = "success", duration = 3000) => {
            const id = Date.now() + Math.random();
            setToasts((prev) => [...prev, { id, message, type, duration }]);
        },
        [],
    );

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = {
        success: (msg, duration) => addToast(msg, "success", duration),
        error: (msg, duration) => addToast(msg, "error", duration),
        info: (msg, duration) => addToast(msg, "info", duration),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            {/* Contenedor de toasts */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
                {toasts.map((t) => (
                    <ToastItem key={t.id} toast={t} onRemove={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}
