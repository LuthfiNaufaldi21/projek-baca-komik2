import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import "../styles/ConfirmModal.css";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  type = "warning", // 'warning' | 'danger' | 'info'
  requireTyping = false,
  typingText = "KONFIRMASI",
  isLoading = false,
}) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireTyping) {
      if (inputValue.trim().toUpperCase() !== typingText.toUpperCase()) {
        setError(`Ketik "${typingText}" untuk melanjutkan`);
        return;
      }
    }
    onConfirm();
  };

  const handleClose = () => {
    if (!isLoading) {
      setInputValue("");
      setError("");
      onClose();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (error) setError("");
  };

  return ReactDOM.createPortal(
    <div className="confirm-modal__overlay" onClick={handleClose}>
      <div
        className="confirm-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {!isLoading && (
          <button onClick={handleClose} className="confirm-modal__close">
            <FiX />
          </button>
        )}

        {/* Icon */}
        <div className={`confirm-modal__icon confirm-modal__icon--${type}`}>
          <FiAlertTriangle />
        </div>

        {/* Title */}
        <h2 className="confirm-modal__title">{title}</h2>

        {/* Message */}
        <p className="confirm-modal__message">{message}</p>

        {/* Typing Input (if required) */}
        {requireTyping && (
          <div className="confirm-modal__input-wrapper">
            <label className="confirm-modal__label">
              Ketik <strong>{typingText}</strong> untuk melanjutkan:
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className={`confirm-modal__input ${
                error ? "confirm-modal__input--error" : ""
              }`}
              placeholder={typingText}
              disabled={isLoading}
              autoFocus
            />
            {error && <p className="confirm-modal__error">{error}</p>}
          </div>
        )}

        {/* Actions */}
        <div className="confirm-modal__actions">
          <button
            onClick={handleClose}
            className="confirm-modal__button confirm-modal__button--cancel"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`confirm-modal__button confirm-modal__button--confirm confirm-modal__button--${type}`}
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
