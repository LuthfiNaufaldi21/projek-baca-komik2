import { useState } from "react";
import { FiX, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth"; 
import "../styles/ChangePasswordModal.css";

export default function ChangePasswordModal({ onClose, onSave }) {
  const { updatePassword } = useAuth(); 
  
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
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name] || errors.general) {
      setErrors({});
    }
    setSuccessMsg(null);
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
      newErrors.newPassword = "Password baru harus berbeda dengan password lama";
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

    setIsSaving(true);
    setErrors({});
    setSuccessMsg(null);

    // 🎯 LOGIC API UPDATE PASSWORD
    try {
        const result = await updatePassword({ 
            oldPassword: formData.oldPassword, 
            newPassword: formData.newPassword 
        });

        if (result.success) {
            setSuccessMsg(result.msg || "Password berhasil diubah!");
            onSave(formData); // Panggil onSave dari parent (AccountPage)
            
            // Tutup modal setelah 1.5 detik
            setTimeout(onClose, 1500); 
        } else {
            // Tampilkan error dari backend (misalnya 'Password lama tidak cocok')
            setErrors({ general: result.msg || "Gagal mengubah password." });
        }

    } catch (err) {
        setErrors({ general: "Kesalahan jaringan saat mengganti password." });
    } finally {
        setIsSaving(false);
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

        {/* Notifikasi Sukses/Error Umum */}
        {successMsg && (
            <div style={{ backgroundColor: '#e6ffed', color: '#187c3d', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>{successMsg}</div>
        )}
        {errors.general && (
            <p className="change-password-modal__error" style={{ marginBottom: '10px' }}>
                {errors.general}
            </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="change-password-modal__form">
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
                disabled={isSaving}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("old")}
                className="change-password-modal__toggle"
                disabled={isSaving}
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
                disabled={isSaving}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="change-password-modal__toggle"
                disabled={isSaving}
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
                disabled={isSaving}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="change-password-modal__toggle"
                disabled={isSaving}
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
                disabled={isSaving}
            >
              Batal
            </button>
            <button
              type="submit"
              className="change-password-modal__button change-password-modal__button--save"
                disabled={isSaving || Object.keys(errors).length > 0}
            >
              Simpan Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}