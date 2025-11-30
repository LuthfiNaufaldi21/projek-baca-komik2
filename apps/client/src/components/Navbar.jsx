import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
// Pastikan path logo benar
import logo from "../assets/logo.svg";
import { FiSearch, FiSun, FiMoon, FiUser } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { getInitials, getAvatarColor } from "../utils/getInitials";
import { API_BASE_URL } from "../utils/constants";
import "../styles/Navbar.css";

export default function Navbar() {
  const { isLoggedIn, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  const isReaderPage = location.pathname.startsWith("/read/");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Logic hide navbar saat scroll down, show saat scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery("");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const profileLink = isLoggedIn ? "/akun" : "/login";

  // Logic Avatar Initials
  const avatarInitials = user ? getInitials(user.username || "User") : "";
  const avatarColor = getAvatarColor(user?.username || "User");

  // Logic Avatar URL (Lebih Aman)
  const getFullAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith("http")) return avatarPath;

    // Hapus suffix /api jika ada, lalu gabung
    const baseUrl = API_BASE_URL.replace(/\/api\/?$/, "");
    // Pastikan ada slash di antara domain dan path
    const path = avatarPath.startsWith("/") ? avatarPath : `/${avatarPath}`;
    return `${baseUrl}${path}`;
  };

  const fullAvatarUrl = user?.avatar ? getFullAvatarUrl(user.avatar) : null;

  if (isReaderPage) return null; // Return null lebih bersih daripada nav display:none

  return (
    <nav className={`navbar ${!isVisible ? "navbar--hidden" : ""}`}>
      <div className="navbar__container">
        <Link to="/" className="navbar__logo-link">
          <div className="navbar__logo-glow-wrapper">
            <div className="navbar__logo-glow"></div>
            {/* PERBAIKAN 1: Gunakan variable logo yang diimport */}
            <img src={logo} alt="KomiKita Logo" className="navbar__logo" />
          </div>
          <span className="navbar__brand-name">KomiKita</span>
        </Link>

        <div className="navbar__content">
          <div className="navbar__links">
            {[
              { to: "/daftar-komik", label: "Daftar Komik" },
              { to: "/bookmark", label: "Bookmark" },
              { to: "/berwarna", label: "Berwarna" },
              { to: "/manga", label: "Manga" },
              { to: "/manhwa", label: "Manhwa" },
              { to: "/manhua", label: "Manhua" },
            ].map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`navbar__link ${
                    isActive ? "navbar__link--active" : ""
                  }`}
                >
                  {link.label}
                  <span className="navbar__link-underline"></span>
                </Link>
              );
            })}
          </div>

          <div className="navbar__actions">
            <form onSubmit={handleSearch} className="navbar__search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Cari komik..."
                className="navbar__search-input"
              />
              <FiSearch className="navbar__search-icon" />
            </form>

            <button
              onClick={toggleTheme}
              className="navbar__theme-toggle"
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              {theme === "dark" ? (
                <FiSun className="navbar__theme-icon" />
              ) : (
                <FiMoon className="navbar__theme-icon" />
              )}
            </button>

            <Link to={profileLink} className="navbar__profile-link">
              <div className="navbar__profile-gradient">
                {/* PERBAIKAN 2: Style statis dipindah ke CSS */}
                <div
                  className="navbar__profile-inner"
                  style={{
                    backgroundImage: fullAvatarUrl
                      ? `url(${fullAvatarUrl})`
                      : "none",
                  }}
                >
                  {isLoggedIn && !fullAvatarUrl ? (
                    <div
                      className="navbar__profile-initials"
                      style={{ backgroundColor: avatarColor }}
                    >
                      {avatarInitials}
                    </div>
                  ) : !isLoggedIn ? (
                    <FiUser className="navbar__profile-icon" />
                  ) : null}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}