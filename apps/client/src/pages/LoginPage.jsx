import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import * as authService from "../services/authService";
import { FiEye, FiEyeOff, FiMail, FiLock, FiCheck } from "react-icons/fi";
import "../styles/LoginPage.css";
import loginImage from "../assets/images/login-img.jpg";

export default function LoginPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Password Validation Logic
  const hasMinLength = password.length >= 8;
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasMinLength && hasNumberOrSymbol;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLoginView) {
        // Login
        if (!email || !password) {
          showToast("Email dan password harus diisi!", "error");
          setIsLoading(false);
          return;
        }

        await login(email, password);
        showToast("Login Berhasil!", "success");
        navigate("/akun");
      } else {
        // Register
        if (!email || !password || !confirmPassword) {
          showToast("Semua field harus diisi!", "error");
          setIsLoading(false);
          return;
        }

        if (!isPasswordValid) {
          showToast("Password belum memenuhi syarat!", "error");
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          showToast("Password dan konfirmasi password tidak cocok!", "error");
          setIsLoading(false);
          return;
        }

        // Generate username dari email + random number untuk menghindari duplikat
        const username =
          email.split("@")[0] + Math.floor(Math.random() * 10000);

        await authService.register({ username, email, password });
        showToast(
          "Pendaftaran Berhasil! Anda sekarang sudah login.",
          "success"
        );
        navigate("/akun");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      showToast(
        error.message || "Terjadi kesalahan. Silakan coba lagi.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page__container">
      {/* Seamless Background Pattern */}
      <div className="login-page__bg-pattern">
        <div className="login-page__bg-blob-top"></div>
        <div className="login-page__bg-blob-bottom"></div>
      </div>

      <div className="login-page__card">
        {/* Left Side - Image & Branding */}
        <div
          className="login-page__image-section"
          style={{ backgroundImage: `url(${loginImage})` }}
        >
          <div className="login-page__image-overlay"></div>
          <div className="login-page__branding">
            <h1 className="login-page__brand-title">KomiKita</h1>
            <p className="login-page__brand-description">
              Tempat seru membaca komik aduhay, menghadirkan cerita seru, gambar
              no burik burik, update cepat, dan pengalaman membaca yang selalu
              bikin ketagihan
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="login-page__form-section">
          <div className="login-page__form-wrapper">
            <div className="login-page__form-header">
              <h2 className="login-page__form-title">
                {isLoginView ? "Salam, pecinta komik" : "Gabung Komunitas Kami"}
              </h2>
              <p className="login-page__form-subtitle">
                {isLoginView
                  ? "Masuk dengan email"
                  : "Daftar sekarang dan mulai membaca"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-page__form">
              <div>
                <label className="login-page__label">Alamat email</label>
                <div className="login-page__input-group">
                  <div className="login-page__input-icon">
                    <FiMail className="login-page__icon" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="login-page__input"
                  />
                </div>
              </div>

              <div>
                <label className="login-page__label">Password</label>
                <div className="login-page__input-group">
                  <div className="login-page__input-icon">
                    <FiLock className="login-page__icon" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-page__input login-page__input--with-toggle"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-page__password-toggle"
                  >
                    {showPassword ? (
                      <FiEyeOff className="login-page__icon" />
                    ) : (
                      <FiEye className="login-page__icon" />
                    )}
                  </button>
                </div>
                {!isLoginView && (
                  <div className="login-page__password-requirements">
                    <p className="login-page__requirements-title">
                      Syarat Password:
                    </p>
                    <ul className="login-page__requirements-list">
                      <li
                        className={`login-page__requirement-item ${
                          hasMinLength
                            ? "login-page__requirement-item--valid"
                            : ""
                        }`}
                      >
                        <span
                          className={`login-page__requirement-icon ${
                            hasMinLength
                              ? "login-page__requirement-icon--valid"
                              : ""
                          }`}
                        >
                          {hasMinLength && <FiCheck />}
                        </span>
                        Minimal 8 karakter
                      </li>
                      <li
                        className={`login-page__requirement-item ${
                          hasNumberOrSymbol
                            ? "login-page__requirement-item--valid"
                            : ""
                        }`}
                      >
                        <span
                          className={`login-page__requirement-icon ${
                            hasNumberOrSymbol
                              ? "login-page__requirement-icon--valid"
                              : ""
                          }`}
                        >
                          {hasNumberOrSymbol && <FiCheck />}
                        </span>
                        Mengandung angka atau simbol
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {!isLoginView && (
                <div>
                  <label className="login-page__label">
                    Konfirmasi Password
                  </label>
                  <div className="login-page__input-group">
                    <div className="login-page__input-icon">
                      <FiLock className="login-page__icon" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={!isLoginView}
                      className="login-page__input login-page__input--with-toggle"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="login-page__password-toggle"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff className="login-page__icon" />
                      ) : (
                        <FiEye className="login-page__icon" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="login-page__submit-button"
                disabled={isLoading}
              >
                {isLoading ? "LOADING..." : isLoginView ? "LOGIN" : "SIGN UP"}
              </button>
            </form>

            <p className="login-page__toggle-view">
              {isLoginView ? "Belum punya akun? " : "Sudah punya akun? "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLoginView(!isLoginView);
                }}
                className="login-page__toggle-link"
              >
                {isLoginView ? "Daftar disini" : "Login sekarang"}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
