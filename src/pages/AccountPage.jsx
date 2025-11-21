import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";
import "../styles/AccountPage.css";

export default function AccountPage() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    alert("Anda telah logout.");
    navigate("/");
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="account-page__container">
      {/* Profile Header with Background Image */}
      <div
        className="account-page__header"
        style={{ backgroundImage: "url(/images/account-img.jpg)" }}
      >
        <div className="account-page__header-overlay"></div>
        <div className="account-page__profile">
          <div className="account-page__avatar">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <h2 className="account-page__title">
            {user?.username || "Pengguna"}
          </h2>
        </div>
      </div>

      <div className="account-page__content">
        <p className="account-page__welcome">
          Selamat datang kembali! Kelola akun dan bookmark komik favorit Anda di
          sini.
        </p>

        <div className="account-page__stats">
          <div className="account-page__stats-card">
            <p className="account-page__stats-label">Total Bookmark</p>
            <p className="account-page__stats-value">
              {user?.bookmarks?.length || 0}
            </p>
          </div>
        </div>

        <button onClick={handleLogout} className="account-page__logout-button">
          Logout
        </button>
      </div>
    </div>
  );
}
