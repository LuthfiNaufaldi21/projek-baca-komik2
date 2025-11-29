import { createContext, useState, useCallback, useRef } from "react";
import "../styles/Toast.css";

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);
    const timerRef = useRef(null);

    const hideToast = useCallback(() => {
        setToast((prev) => (prev ? { ...prev, isVisible: false } : null));
        setTimeout(() => setToast(null), 300);
    }, []);

    const showToast = useCallback((message, type = "info") => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setToast({ message, type, isVisible: true });
        timerRef.current = setTimeout(() => {
        hideToast();
        }, 4000);
    }, [hideToast]);

    const getTitle = (type) => {
        switch (type) {
        case "success": return "Berhasil!";
        case "error": return "Oops, Gagal!";
        default: return "Info Baru";
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
        {children}
        {toast && (
            <div className="toast-container">
            <div
                className={`toast toast--${toast.type} ${
                toast.isVisible ? "" : "toast--hidden"
                }`}
                onClick={hideToast}
            >
                <div className="toast__icon">
                {toast.type === "success" && <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                {toast.type === "error" && <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                {toast.type === "info" && <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                </div>
                <div className="toast__content">
                <span className="toast__title">{getTitle(toast.type)}</span>
                <span className="toast__message">{toast.message}</span>
                </div>
            </div>
            </div>
        )}
        </ToastContext.Provider>
    );
};