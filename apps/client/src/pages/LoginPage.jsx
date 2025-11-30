import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import * as authService from "../services/authService";
import { FiEye, FiEyeOff, FiMail, FiLock, FiCheck } from "react-icons/fi";
import "../styles/LoginPage.css";
import loginImage from "../assets/images/login-img.jpg";

// --- Sub-Component untuk Input Field ---
const FormInput = ({
  label,
  name,
  type,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  icon: Icon,
  showToggle,
  onToggle,
  isPasswordVisible,
}) => (
  <div>
    <label className="login-page__label">{label}</label>
    <div className="login-page__input-group">
      <div className="login-page__input-icon">
        {Icon && <Icon className="login-page__icon" />}
      </div>
      <input
        name={name}
        type={showToggle ? (isPasswordVisible ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`login-page__input ${
          showToggle ? "login-page__input--with-toggle" : ""
        } ${touched && error ? "login-page__input--error" : ""}`}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="login-page__password-toggle"
          tabIndex="-1"
        >
          {isPasswordVisible ? (
            <FiEyeOff className="login-page__icon" />
          ) : (
            <FiEye className="login-page__icon" />
          )}
        </button>
      )}
    </div>
    {touched && error && <p className="login-page__error-message">{error}</p>}
  </div>
);

// --- Component Utama ---
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateField = (name, value, formDataRef = formData) => {
    let errorMsg = "";

    switch (name) {
      case "email": {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) errorMsg = "Email harus diisi";
        else if (!emailRegex.test(value)) errorMsg = "Format email tidak valid";
        break;
      }
      case "password":
        if (!value) errorMsg = "Password harus diisi";
        else if (!isLoginView) {
          if (value.length < 8) errorMsg = "Password minimal 8 karakter";
          else if (!/[0-9!@#$%^&*(),.?":{}|<>]/.test(value))
            errorMsg = "Password harus mengandung angka atau simbol";
        }
        break;
      case "confirmPassword":
        if (!isLoginView) {
          if (!value) errorMsg = "Konfirmasi password harus diisi";
          else if (value !== formDataRef.password)
            errorMsg = "Password tidak cocok";
        }
        break;
      default:
        break;
    }
    return errorMsg;
  };

  const checkPasswordRequirements = (pwd) => ({
    hasMinLength: pwd.length >= 8,
    hasSymbol: /[0-9!@#$%^&*(),.?":{}|<>]/.test(pwd),
  });

  const passReqs = checkPasswordRequirements(formData.password);

  const toggleView = () => {
    setIsLoginView((prev) => !prev);
    setFormData({ email: "", password: "", confirmPassword: "" });
    setErrors({});
    setTouched({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (touched[name]) {
        const error = validateField(name, value, newData);
        setErrors((prevErr) => ({ ...prevErr, [name]: error }));

        if (name === "password" && touched.confirmPassword && !isLoginView) {
          const confirmErr = validateField(
            "confirmPassword",
            newData.confirmPassword,
            newData
          );
          setErrors((prevErr) => ({
            ...prevErr,
            confirmPassword: confirmErr,
            [name]: error,
          }));
        }
      }
      return newData;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const fieldsToCheck = isLoginView
      ? ["email", "password"]
      : ["email", "password", "confirmPassword"];

    let isValid = true;
    fieldsToCheck.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(
      fieldsToCheck.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );

    if (!isValid) {
      showToast("Mohon perbaiki kesalahan pada form", "error");
      return;
    }

    setIsLoading(true);

    try {
      const cleanEmail = formData.email.trim();

      if (isLoginView) {
        await login(cleanEmail, formData.password);
        showToast("Login Berhasil!", "success");
        navigate("/akun");
      } else {
        const username =
          cleanEmail.split("@")[0] + Math.floor(Math.random() * 10000);
        await authService.register({
          username,
          email: cleanEmail,
          password: formData.password,
        });
        showToast(
          "Pendaftaran Berhasil! Anda sekarang sudah login.",
          "success"
        );
        navigate("/akun");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      showToast(error.message || "Terjadi kesalahan.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page__container">
      <div className="login-page__bg-pattern">
        <div className="login-page__bg-blob-top"></div>
        <div className="login-page__bg-blob-bottom"></div>
      </div>

      <div className="login-page__card">
        {/* Left Side */}
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

        {/* Right Side */}
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
              <FormInput
                label="Alamat email"
                name="email"
                type="email"
                icon={FiMail}
                placeholder="contoh@email.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
              />

              {/* Grouping Password & Requirements agar jaraknya rapat */}
              <div>
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  icon={FiLock}
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password}
                  touched={touched.password}
                  showToggle={true}
                  isPasswordVisible={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />

                {!isLoginView && (
                  <div className="login-page__password-requirements">
                    <p className="login-page__requirements-title">
                      Syarat Password:
                    </p>
                    <ul className="login-page__requirements-list">
                      <RequirementItem
                        isValid={passReqs.hasMinLength}
                        text="Minimal 8 karakter"
                      />
                      <RequirementItem
                        isValid={passReqs.hasSymbol}
                        text="Mengandung angka atau simbol"
                      />
                    </ul>
                  </div>
                )}
              </div>

              {!isLoginView && (
                <FormInput
                  label="Konfirmasi Password"
                  name="confirmPassword"
                  type="password"
                  icon={FiLock}
                  placeholder="Ketik ulang password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  showToggle={true}
                  isPasswordVisible={showConfirmPassword}
                  onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              )}

              <button
                type="submit"
                className="login-page__submit-button disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "LOADING..." : isLoginView ? "LOGIN" : "SIGN UP"}
              </button>
            </form>

            <p className="login-page__toggle-view">
              {isLoginView ? "Belum punya akun? " : "Sudah punya akun? "}
              <button
                type="button"
                onClick={toggleView}
                className="login-page__toggle-link"
              >
                {isLoginView ? "Daftar disini" : "Login sekarang"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const RequirementItem = ({ isValid, text }) => (
  <li
    className={`login-page__requirement-item ${
      isValid ? "login-page__requirement-item--valid" : ""
    }`}
  >
    <span
      className={`login-page__requirement-icon ${
        isValid ? "login-page__requirement-icon--valid" : ""
      }`}
    >
      {isValid && <FiCheck />}
    </span>
    {text}
  </li>
);
