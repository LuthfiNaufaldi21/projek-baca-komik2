import { useState, useRef } from "react";
import { FiX, FiCamera, FiUpload, FiTrash2 } from "react-icons/fi";
import { getInitials, getAvatarColor } from "../utils/getInitials";
import "../styles/UploadAvatarModal.css";

export default function UploadAvatarModal({ user, onClose, onSave }) {
  const [preview, setPreview] = useState(user?.avatar || null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("File harus berupa gambar");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file maksimal 5MB");
        return;
      }

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
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    if (preview) {
      onSave({ avatar: preview });
    } else {
      onSave({ avatar: null });
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
              Format: JPG, PNG, GIF (Maksimal 5MB)
            </p>
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
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="upload-avatar-modal__footer-button upload-avatar-modal__footer-button--save"
            disabled={!selectedFile && preview === user?.avatar}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
