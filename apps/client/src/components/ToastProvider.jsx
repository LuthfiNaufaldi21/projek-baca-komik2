import { useState, useCallback, useRef } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";
import { ToastContext } from "../contexts/ToastContext";
import "../styles/Toast.css";

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const hideToast = useCallback(() => {
    setToast((prev) => (prev ? { ...prev, isVisible: false } : null));
    setTimeout(() => setToast(null), 300);
  }, []);

  const showToast = useCallback(
    (message, type = "info") => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setToast({ message, type, isVisible: true });
      timerRef.current = setTimeout(() => {
        hideToast();
      }, 4000);
    },
    [hideToast]
  );

  const getTitle = (type) => {
    switch (type) {
      case "success":
        return "Berhasil!";
      case "error":
        return "Oops, Gagal!";
      default:
        return "Info Baru";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <FiCheckCircle />;
      case "error":
        return <FiAlertCircle />;
      default:
        return <FiInfo />;
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
            <div className="toast__icon">{getIcon(toast.type)}</div>
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
