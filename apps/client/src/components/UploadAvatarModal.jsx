import { useState, useRef } from "react";
import { FiX, FiCamera, FiUpload, FiTrash2 } from "react-icons/fi";
import { getInitials, getAvatarColor } from "../utils/getInitials";
import { useToast } from "../hooks/useToast";
import ConfirmModal from "./ConfirmModal";
import * as authService from "../services/authService";
import "../styles/UploadAvatarModal.css";

export default function UploadAvatarModal({ user, onClose, onSave }) {
  const { showToast } = useToast();
  const [preview, setPreview] = useState(user?.avatar || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wantsToRemove, setWantsToRemove] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar");
        return;
      }

      // Validate file size (max 2MB - sesuai dengan backend)
      if (file.size > 2 * 1024 * 1024) {
        setError("Ukuran file maksimal 2MB");
        return;
      }

      setError(null);
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    if (user?.avatar) {
      // If user has existing avatar, show confirmation
      setShowRemoveConfirm(true);
    } else {
      // If just removing selected file (no existing avatar), no confirmation needed
      setPreview(null);
      setSelectedFile(null);
      setWantsToRemove(true);
      setError(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const confirmRemovePhoto = () => {
    setPreview(null);
    setSelectedFile(null);
    setWantsToRemove(true);
    setError(null);
    setShowRemoveConfirm(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    // If user wants to remove photo
    if (wantsToRemove && !selectedFile) {
      setIsLoading(true);
      setError(null);

      try {
        await authService.removeAvatar();
        onSave({ avatar: null });
        showToast("Foto profil berhasil dihapus!", "success");
        onClose();
      } catch (err) {
        console.error("Remove avatar error:", err);
        setError(err.message || "Gagal menghapus foto profil");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // If no file selected and not removing
    if (!selectedFile) {
      setError("Pilih foto terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.uploadAvatar(selectedFile);

      // Call onSave with new avatar URL from backend
      onSave({ avatar: response.avatar });

      showToast("Foto profil berhasil diperbarui!", "success");
      onClose();
    } catch (err) {
      console.error("Upload avatar error:", err);
      setError(err.message || "Gagal mengupload foto profil");
    } finally {
      setIsLoading(false);
    }
  };

  const avatarInitials = getInitials(user?.username || "User");
  const avatarColor = getAvatarColor(user?.username || "User");

  return (
    <div className="upload-avatar-modal__overlay" onClick={onClose}>
      <div
        className="upload-avatar-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="upload-avatar-modal__header">
          <h2 className="upload-avatar-modal__title">Ganti Foto Profil</h2>
          <button onClick={onClose} className="upload-avatar-modal__close">
            <FiX />
          </button>
        </div>

        {/* Body */}
        <div className="upload-avatar-modal__body">
          {/* Avatar Preview */}
          <div className="upload-avatar-modal__preview-wrapper">
            <div className="upload-avatar-modal__preview">
              {preview ? (
                <img
                  src={preview}
                  alt="Avatar Preview"
                  className="upload-avatar-modal__preview-image"
                />
              ) : (
                <div
                  className="upload-avatar-modal__preview-placeholder"
                  style={{ backgroundColor: avatarColor }}
                >
                  <span className="upload-avatar-modal__preview-initials">
                    {avatarInitials}
                  </span>
                </div>
              )}

              {/* Camera Icon Overlay */}
              <div className="upload-avatar-modal__preview-overlay">
                <FiCamera className="upload-avatar-modal__preview-icon" />
              </div>
            </div>
          </div>

          {/* Upload Instructions */}
          <div className="upload-avatar-modal__instructions">
            <p className="upload-avatar-modal__instructions-title">
              Pilih foto terbaik Anda
            </p>
            <p className="upload-avatar-modal__instructions-text">
              Format: JPG, JPEG, PNG (Maksimal 2MB)
            </p>
            {error && <p className="upload-avatar-modal__error">{error}</p>}
          </div>

          {/* Action Buttons */}
          <div className="upload-avatar-modal__actions">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="upload-avatar-modal__file-input"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="upload-avatar-modal__button upload-avatar-modal__button--upload"
            >
              <FiUpload />
              {preview && selectedFile ? "Ganti Foto" : "Upload Foto"}
            </button>

            {preview && (
              <button
                onClick={handleRemovePhoto}
                className="upload-avatar-modal__button upload-avatar-modal__button--remove"
              >
                <FiTrash2 />
                Hapus Foto
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="upload-avatar-modal__footer">
          <button
            onClick={onClose}
            className="upload-avatar-modal__footer-button upload-avatar-modal__footer-button--cancel"
            disabled={isLoading}
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="upload-avatar-modal__footer-button upload-avatar-modal__footer-button--save"
            disabled={(!selectedFile && !wantsToRemove) || isLoading}
          >
            {isLoading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>

      {/* Remove Avatar Confirmation Modal */}
      <ConfirmModal
        isOpen={showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(false)}
        onConfirm={confirmRemovePhoto}
        title="Hapus Foto Profil"
        message="Apakah Anda yakin ingin menghapus foto profil Anda? Foto akan diganti dengan inisial nama."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="warning"
      />
    </div>
  );
}
