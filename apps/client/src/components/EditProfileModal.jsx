import { useState } from "react";
import { FiX, FiUser, FiMail } from "react-icons/fi";
import "../styles/EditProfileModal.css";

export default function EditProfileModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username tidak boleh kosong";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email tidak boleh kosong";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      alert("Profil berhasil diperbarui!");
      onClose();
    } catch (err) {
      console.error("Update profile error:", err);
      setErrors({
        general: err.message || "Gagal memperbarui profil. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Edit Profil</h2>
          <button onClick={onClose} className="modal-close">
            <FiX />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          {errors.general && (
            <div className="modal-error-banner">{errors.general}</div>
          )}

          {/* Username */}
          <div className="modal-field">
            <label className="modal-label">
              <FiUser className="modal-label-icon" />
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`modal-input ${
                errors.username ? "modal-input--error" : ""
              }`}
              placeholder="Masukkan username"
              disabled={isLoading}
            />
            {errors.username && (
              <p className="modal-error">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div className="modal-field">
            <label className="modal-label">
              <FiMail className="modal-label-icon" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`modal-input ${
                errors.email ? "modal-input--error" : ""
              }`}
              placeholder="Masukkan email"
              disabled={isLoading}
            />
            {errors.email && <p className="modal-error">{errors.email}</p>}
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="modal-button modal-button--cancel"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="modal-button modal-button--save"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
