import { useState } from "react";
import {
  FiX,
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiFileText,
} from "react-icons/fi";
import * as authService from "../services/authService";
import "../styles/EditProfileModal.css";

export default function EditProfileModalNew({ user, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'password'

  // Profile form state
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
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

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    // Limit bio to 100 characters
    if (name === "bio") {
      if (value.length > 100) {
        return; // Don't update if exceeds 100 characters
      }
    }

    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

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

  const validateProfile = () => {
    const newErrors = {};

    if (!profileData.username.trim()) {
      newErrors.username = "Username tidak boleh kosong";
    } else if (profileData.username.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    }

    // Email is disabled, so we don't validate it for changes

    return newErrors;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.oldPassword.trim()) {
      newErrors.oldPassword = "Password lama tidak boleh kosong";
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = "Password baru tidak boleh kosong";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password baru minimal 6 karakter";
    } else if (passwordData.newPassword === passwordData.oldPassword) {
      newErrors.newPassword =
        "Password baru harus berbeda dengan password lama";
    }

    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Konfirmasi password tidak boleh kosong";
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
    }

    return newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateProfile();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      // Only send username and bio, not email
      await onSave({
        username: profileData.username,
        bio: profileData.bio,
      });
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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validatePassword();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await authService.changePassword(
        passwordData.oldPassword,
        passwordData.newPassword
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

  const bioCharCount = profileData.bio.length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-content--tabbed"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Edit Profil</h2>
          <button onClick={onClose} className="modal-close">
            <FiX />
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button
            className={`modal-tab ${
              activeTab === "profile" ? "modal-tab--active" : ""
            }`}
            onClick={() => {
              setActiveTab("profile");
              setErrors({});
            }}
          >
            Info Profil
          </button>
          <button
            className={`modal-tab ${
              activeTab === "password" ? "modal-tab--active" : ""
            }`}
            onClick={() => {
              setActiveTab("password");
              setErrors({});
            }}
          >
            Ganti Password
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {errors.general && (
            <div className="modal-error-banner">{errors.general}</div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileSubmit} className="modal-form">
              {/* Username */}
              <div className="modal-field">
                <label className="modal-label">
                  <FiUser className="modal-label-icon" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
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

              {/* Email (Disabled) */}
              <div className="modal-field">
                <label className="modal-label">
                  <FiMail className="modal-label-icon" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  className="modal-input modal-input--disabled"
                  disabled
                  title="Email tidak dapat diubah"
                />
                <p className="modal-hint">Email tidak dapat diubah</p>
              </div>

              {/* Bio */}
              <div className="modal-field">
                <label className="modal-label">
                  <FiFileText className="modal-label-icon" />
                  Bio
                  <span className="modal-label-counter">
                    {bioCharCount}/100 karakter
                  </span>
                </label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleProfileChange}
                  className={`modal-textarea ${
                    errors.bio ? "modal-input--error" : ""
                  }`}
                  placeholder="Ceritakan tentang dirimu..."
                  rows="4"
                  disabled={isLoading}
                />
                {errors.bio && <p className="modal-error">{errors.bio}</p>}
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
          )}

          {/* Password Tab */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordSubmit} className="modal-form">
              {/* Old Password */}
              <div className="modal-field">
                <label className="modal-label">
                  <FiLock className="modal-label-icon" />
                  Password Lama
                </label>
                <div className="modal-input-wrapper">
                  <input
                    type={showPasswords.old ? "text" : "password"}
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className={`modal-input ${
                      errors.oldPassword ? "modal-input--error" : ""
                    }`}
                    placeholder="Masukkan password lama"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("old")}
                    className="modal-toggle"
                    disabled={isLoading}
                  >
                    {showPasswords.old ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.oldPassword && (
                  <p className="modal-error">{errors.oldPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div className="modal-field">
                <label className="modal-label">
                  <FiLock className="modal-label-icon" />
                  Password Baru
                </label>
                <div className="modal-input-wrapper">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`modal-input ${
                      errors.newPassword ? "modal-input--error" : ""
                    }`}
                    placeholder="Masukkan password baru"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="modal-toggle"
                    disabled={isLoading}
                  >
                    {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="modal-error">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="modal-field">
                <label className="modal-label">
                  <FiLock className="modal-label-icon" />
                  Konfirmasi Password Baru
                </label>
                <div className="modal-input-wrapper">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`modal-input ${
                      errors.confirmPassword ? "modal-input--error" : ""
                    }`}
                    placeholder="Ulangi password baru"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="modal-toggle"
                    disabled={isLoading}
                  >
                    {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="modal-error">{errors.confirmPassword}</p>
                )}
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
                  {isLoading ? "Menyimpan..." : "Simpan Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
