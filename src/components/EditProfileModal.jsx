import { useState } from "react";
import { FiX, FiUser, FiMail, FiFileText } from "react-icons/fi";
import "../styles/EditProfileModal.css";

export default function EditProfileModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  const [errors, setErrors] = useState({});

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

    if (formData.bio && formData.bio.length > 200) {
      newErrors.bio = "Bio maksimal 200 karakter";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
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
            />
            {errors.email && <p className="modal-error">{errors.email}</p>}
          </div>

          {/* Bio */}
          <div className="modal-field">
            <label className="modal-label">
              <FiFileText className="modal-label-icon" />
              Bio
              <span className="modal-label-optional">(Opsional)</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className={`modal-textarea ${
                errors.bio ? "modal-input--error" : ""
              }`}
              placeholder="Ceritakan tentang dirimu..."
              rows="4"
              maxLength="200"
            />
            <div className="modal-char-count">{formData.bio.length}/200</div>
            {errors.bio && <p className="modal-error">{errors.bio}</p>}
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="modal-button modal-button--cancel"
            >
              Batal
            </button>
            <button type="submit" className="modal-button modal-button--save">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
