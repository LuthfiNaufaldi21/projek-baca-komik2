import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";
import { getInitials, getAvatarColor } from "../utils/getInitials";
import "../styles/Navbar.css";

export default function Navbar() {
  const { isLoggedIn, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    // Sembunyikan jika scroll ke bawah dan sudah melewati 100px dari atas
    if (window.scrollY > lastScrollY && window.scrollY > 100) {
      setIsVisible(false);
    } else {
      // Tampilkan jika scroll ke atas
      setIsVisible(true);
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

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
  const avatarInitials = user ? getInitials(user.username || "User") : "";
  const avatarColor = user
    ? getAvatarColor(user.username || "User")
    : "#6366f1";

  return (
    <nav className={`navbar ${!isVisible ? 'navbar--hidden' : ''}`}>
      <div className="navbar__container">
        <Link to="/" className="navbar__logo-link">
          <div className="navbar__logo-glow-wrapper">
            <div className="navbar__logo-glow"></div>
            <img src="/logo.svg" alt="Logo" className="navbar__logo" />
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
              <svg
                className="navbar__search-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </form>

            <button
              onClick={toggleTheme}
              className="navbar__theme-toggle"
              title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            >
              {theme === "dark" ? (
                <svg
                  className="navbar__theme-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="navbar__theme-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            <Link to={profileLink} className="navbar__profile-link">
              <div className="navbar__profile-gradient">
                <div className="navbar__profile-inner">
                  {isLoggedIn && user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="navbar__profile-avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  ) : isLoggedIn && user ? (
                    <div
                      className="navbar__profile-initials"
                      style={{
                        backgroundColor: avatarColor,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: "white",
                      }}
                    >
                      {avatarInitials}
                    </div>
                  ) : (
                    <svg
                      className="navbar__profile-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}