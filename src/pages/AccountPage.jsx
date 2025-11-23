import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import {
  FiEdit2,
  FiBookmark,
  FiCalendar,
  FiHeart,
  FiLogOut,
  FiMail,
  FiLock,
  FiCamera,
    FiList,
} from "react-icons/fi";
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import UploadAvatarModal from "../components/UploadAvatarModal";
import ComicCard from "../components/ComicCard";
import { getInitials, getAvatarColor } from "../utils/getInitials";
import * as formatDate from "../utils/formatDate";
import { comics } from "../data/comics";
import "../styles/AccountPage.css";
import accountImage from "../assets/images/account-img.jpg";

export default function AccountPage() {
  const { isLoggedIn, user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

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

  const handleSaveProfile = (profileData) => {
    updateProfile(profileData);
    setShowEditModal(false);
    alert("Profil berhasil diperbarui!");
  };

  const handleChangePassword = (passwordData) => {
    console.log("Password change:", passwordData);
    setShowPasswordModal(false);
    alert("Password berhasil diubah!");
  };

  const handleUploadAvatar = (avatarData) => {
    updateProfile(avatarData);
    setShowAvatarModal(false);
    alert("Foto profil berhasil diperbarui!");
  };

  const readingHistory = comics
    .filter((comic) => user?.bookmarks?.includes(comic.id))
    .reverse();

  const favoriteGenre = (() => {
    if (readingHistory.length === 0) return "Belum ada";

    const genreCounts = {};
    readingHistory.forEach((comic) => {
      if (comic.tags) {
        comic.tags.forEach((tag) => {
          if (!["Manga", "Manhwa", "Manhua", "Warna"].includes(tag)) {
            genreCounts[tag] = (genreCounts[tag] || 0) + 1;
          }
        });
      }
    });

    const sortedGenres = Object.entries(genreCounts).sort(
      (a, b) => b[1] - a[1]
    );
    return sortedGenres.length > 0 ? sortedGenres[0][0] : "Belum ada";
  })();

  if (!isLoggedIn) {
    return null;
  }

  const avatarInitials = getInitials(user?.username || "User");
  const avatarColor = getAvatarColor(user?.username || "User");

  return (
    <div className="account-page__container">
      <div
        className="account-page__header"
        style={{ backgroundImage: `url(${accountImage})` }}
      >
        <div className="account-page__header-overlay"></div>
        <div className="account-page__profile">
          <div className="account-page__avatar-wrapper">
            <div
              className="account-page__avatar"
              style={{
                backgroundColor: user?.avatar ? "transparent" : avatarColor,
                backgroundImage: user?.avatar ? `url(${user.avatar})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!user?.avatar && avatarInitials}
            </div>
            <button
              onClick={() => setShowAvatarModal(true)}
              className="account-page__avatar-edit"
              title="Ganti Foto Profil"
            >
              <FiCamera />
            </button>
          </div>

          <div className="account-page__profile-info">
            <h2 className="account-page__title">
              {user?.username || "Pengguna"}
            </h2>
            {user?.email && (
              <p className="account-page__email">
                <FiMail className="account-page__email-icon" />
                {user.email}
              </p>
            )}
            {user?.bio && <p className="account-page__bio">{user.bio}</p>}
            <p className="account-page__joined">
              <FiCalendar className="account-page__joined-icon" />
              Bergabung {formatDate.relative(user?.joinedAt || new Date())}
            </p>
          </div>

          <div className="account-page__action-buttons">
            <button
              onClick={() => setShowEditModal(true)}
              className="account-page__edit-button"
            >
              <FiEdit2 />
              Edit Profil
            </button>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="account-page__password-button"
            >
              <FiLock />
              Ganti Password
            </button>
          </div>
        </div>
      </div>

      <div className="account-page__content">
        <div className="account-page__stats">
          <div className="account-page__stats-card">
            <div className="account-page__stats-icon account-page__stats-icon--bookmark">
              <FiBookmark />
            </div>
            <div>
              <p className="account-page__stats-value">
                {readingHistory.length}
              </p>
              <p className="account-page__stats-label">Total Bookmark</p>
            </div>
          </div>

          <div className="account-page__stats-card">
            <div className="account-page__stats-icon account-page__stats-icon--genre">
              <FiHeart />
            </div>
            <div>
              <p className="account-page__stats-value">{favoriteGenre}</p>
              <p className="account-page__stats-label">Genre Favorit</p>
            </div>
          </div>
        </div>

        {/* Riwayat Bacaan Terakhir */}
        <div className="account-page__bookmarks">
          <div className="account-page__bookmarks-header">
            <h3 className="account-page__section-title">
              <FiList className="account-page__section-icon" />
              Riwayat Bacaan Terakhir
            </h3>
            {readingHistory.length > 0 && (
              <button
                onClick={() => navigate("/riwayat")}
                className="account-page__view-all"
              >
                Lihat Semua
              </button>
            )}
          </div>

          {readingHistory.length === 0 ? (
            <div className="account-page__empty">
              <FiList className="account-page__empty-icon" />
              <p className="account-page__empty-text">
                Belum ada riwayat bacaan yang tercatat
              </p>
              <button
                onClick={() => navigate("/daftar-komik")}
                className="account-page__browse-button"
              >
                Jelajahi Komik
              </button>
            </div>
          ) : (
            <div className="account-page__bookmarks-grid">
              {readingHistory.slice(0, 5).map((comic) => (
                <ComicCard key={comic.id} comic={comic} />
              ))}
            </div>
          )}
        </div>

        <button onClick={handleLogout} className="account-page__logout-button">
          <FiLogOut />
          Logout
        </button>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSave={handleChangePassword}
        />
      )}

      {showAvatarModal && (
        <UploadAvatarModal
          user={user}
          onClose={() => setShowAvatarModal(false)}
          onSave={handleUploadAvatar}
        />
      )}
    </div>
  );
}