import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "../styles/LoginPage.css";
import loginImage from "../assets/images/login-img.jpg";

export default function LoginPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLoginView) {
      if (!email || !password) {
        alert("Email dan password harus diisi!");
        return;
      }
      const username = email.split("@")[0];
      login(username, email);
      alert("Login Berhasil!");
      navigate("/akun");
    } else {
      if (!email || !password || !confirmPassword) {
        alert("Semua field harus diisi!");
        return;
      }
      if (password !== confirmPassword) {
        alert("Password dan konfirmasi password tidak cocok!");
        return;
      }
      const username = email.split("@")[0];
      login(username, email);
      alert("Pendaftaran Berhasil!");
      navigate("/akun");
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
                    <svg
                      className="login-page__icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
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
                    <svg
                      className="login-page__icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
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
                {isLoginView && (
                  <div className="login-page__forgot-password">
                    <a href="#" className="login-page__forgot-link">
                      Lupa passwordmu?
                    </a>
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
                      <svg
                        className="login-page__icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
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

              <button type="submit" className="login-page__submit-button">
                {isLoginView ? "LOGIN" : "SIGN UP"}
              </button>
            </form>

            <div className="login-page__divider-container">
              <div className="login-page__divider-line-container">
                <div className="login-page__divider-line"></div>
              </div>
              <div className="login-page__divider-text-container">
                <span className="login-page__divider-text">
                  Bisa juga dengan
                </span>
              </div>
            </div>

            <div className="login-page__social-buttons">
              <button className="login-page__social-button">
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="login-page__social-icon"
                />
              </button>
              <button className="login-page__social-button">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png"
                  alt="Facebook"
                  className="login-page__social-icon"
                />
              </button>
              <button className="login-page__social-button">
                <img
                  src="https://www.apple.com/favicon.ico"
                  alt="Apple"
                  className="login-page__social-icon"
                />
              </button>
            </div>

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
