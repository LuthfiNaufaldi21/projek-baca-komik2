import { useState } from "react";
import { FiX, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import * as authService from "../services/authService";
import "../styles/ChangePasswordModal.css";

export default function ChangePasswordModal({ onClose }) {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
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

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = "Password lama tidak boleh kosong";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "Password baru tidak boleh kosong";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password baru minimal 6 karakter";
    } else if (formData.newPassword === formData.oldPassword) {
      newErrors.newPassword =
        "Password baru harus berbeda dengan password lama";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Konfirmasi password tidak boleh kosong";
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
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
    setErrors({});

    try {
      await authService.changePassword(
        formData.oldPassword,
        formData.newPassword
      );

      alert("Password berhasil diubah!");
      onClose();
    } catch (err) {
      console.error("Change password error:", err);
      setErrors({
        general: err.message || "Gagal mengubah password. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="change-password-modal__overlay" onClick={onClose}>
      <div
        className="change-password-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="change-password-modal__header">
          <h2 className="change-password-modal__title">Ganti Password</h2>
          <button onClick={onClose} className="change-password-modal__close">
            <FiX />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="change-password-modal__form">
          {errors.general && (
            <div className="change-password-modal__error-banner">
              {errors.general}
            </div>
          )}

          {/* Old Password */}
          <div className="change-password-modal__field">
            <label className="change-password-modal__label">
              <FiLock className="change-password-modal__label-icon" />
              Password Lama
            </label>
            <div className="change-password-modal__input-wrapper">
              <input
                type={showPasswords.old ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className={`change-password-modal__input ${
                  errors.oldPassword
                    ? "change-password-modal__input--error"
                    : ""
                }`}
                placeholder="Masukkan password lama"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("old")}
                className="change-password-modal__toggle"
                disabled={isLoading}
              >
                {showPasswords.old ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="change-password-modal__error">
                {errors.oldPassword}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="change-password-modal__field">
            <label className="change-password-modal__label">
              <FiLock className="change-password-modal__label-icon" />
              Password Baru
            </label>
            <div className="change-password-modal__input-wrapper">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`change-password-modal__input ${
                  errors.newPassword
                    ? "change-password-modal__input--error"
                    : ""
                }`}
                placeholder="Masukkan password baru"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="change-password-modal__toggle"
                disabled={isLoading}
              >
                {showPasswords.new ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="change-password-modal__error">
                {errors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="change-password-modal__field">
            <label className="change-password-modal__label">
              <FiLock className="change-password-modal__label-icon" />
              Konfirmasi Password Baru
            </label>
            <div className="change-password-modal__input-wrapper">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`change-password-modal__input ${
                  errors.confirmPassword
                    ? "change-password-modal__input--error"
                    : ""
                }`}
                placeholder="Ulangi password baru"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="change-password-modal__toggle"
                disabled={isLoading}
              >
                {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="change-password-modal__error">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="change-password-modal__actions">
            <button
              type="button"
              onClick={onClose}
              className="change-password-modal__button change-password-modal__button--cancel"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              className="change-password-modal__button change-password-modal__button--save"
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
