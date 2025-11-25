import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import {
  FiBookmark,
  FiCalendar,
  FiHeart,
  FiLogOut,
  FiMail,
  FiLock,
  FiCamera,
  FiList,
  FiClock,
} from "react-icons/fi";
// HANYA PERTAHANKAN IMPORT MODAL YANG ANDA BUTUHKAN
import ChangePasswordModal from "../components/ChangePasswordModal"; 
import UploadAvatarModal from "../components/UploadAvatarModal";

import ComicCard from "../components/ComicCard";
import { getInitials, getAvatarColor } from "../utils/getInitials";
import * as formatDate from "../utils/formatDate";
import { comics } from "../data/comics";
import "../styles/AccountPage.css";
import accountImage from "../assets/images/account-img.jpg";
import { API_BASE_URL } from "../config/api"; 

export default function AccountPage() {
  const { isLoggedIn, user, logout, updateProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Hapus state showEditModal
  const [showPasswordModal, setShowPasswordModal] = useState(false); 
  const [showAvatarModal, setShowAvatarModal] = useState(false); 

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, isLoading, navigate]);

  const handleLogout = () => {
    logout();
    alert("Anda telah logout.");
    navigate("/");
  };

  // Handler untuk ganti password
  const handleChangePassword = (passwordData) => {
    // Di sini Anda akan menambahkan logika fetch API untuk update password
    console.log("Password baru:", passwordData);
    setShowPasswordModal(false);
    alert("Password berhasil diubah!");
  };

  const handleUploadAvatarSuccess = () => {
    setShowAvatarModal(false);
  };


  // Logic Riwayat Bacaan
  const readingHistory = (() => {
    if (!user?.readingHistory || !Array.isArray(user.readingHistory)) return [];
    
    const sortedHistory = [...user.readingHistory].sort((a, b) => 
        new Date(b.readAt) - new Date(a.readAt)
    );

    return sortedHistory
      .map((historyItem) => {
        const comic = comics.find((c) => c.id === historyItem.comicId);
        if (!comic) return null;

        const lastChapter = comic.chapters?.find((ch) => ch.id === historyItem.lastReadChapter);

        return {
          ...comic,
          lastReadChapter: lastChapter?.title || "Chapter Terhapus",
          lastReadChapterId: historyItem.lastReadChapter, 
        };
      })
      .filter(Boolean);
  })();

  // Logic Bookmark
  const bookmarkedComics = comics.filter((comic) =>
    user?.bookmarks?.some(b => b.comicId === comic.id)
  );


  // Logic Genre Favorit
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


  if (isLoading) {
    return <div className="loading-screen">Memuat Profil...</div>;
  }
  
  if (!isLoggedIn) {
    return null; 
  }

  const avatarInitials = getInitials(user?.username || "User");
  const avatarColor = getAvatarColor(user?.username || "User");

  const fullAvatarUrl = user?.avatar 
    ? API_BASE_URL.replace('/api', '') + user.avatar 
    : null; 


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
                backgroundColor: fullAvatarUrl ? "transparent" : avatarColor,
                backgroundImage: fullAvatarUrl ? `url(${fullAvatarUrl})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white', 
                fontSize: '3em', 
                fontWeight: 'bold' 
              }}
            >
              {!fullAvatarUrl && avatarInitials} 
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
            <p className="account-page__joined">
              <FiCalendar className="account-page__joined-icon" />
              Bergabung {formatDate.relative(user?.createdAt)}
            </p>
          </div>

          <div className="account-page__action-buttons">
            {/* HANYA TINGGALKAN TOMBOL GANTI PASSWORD */}
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
                {bookmarkedComics.length}
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
                <div
                  key={comic.id}
                  className="account-page__history-card-wrapper"
                >
                  <ComicCard comic={comic} />

                  <Link
                    to={`/read/${comic.id}/${comic.lastReadChapterId}`}
                    className="account-page__history-info"
                  >
                    <FiClock className="account-page__history-icon" />
                    <span className="account-page__history-text">
                      {comic.lastReadChapter}
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleLogout} className="account-page__logout-button">
          <FiLogOut />
          Logout
        </button>
      </div>
    
      {/* Hapus rendering EditProfileModal */}

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSave={handleChangePassword}
        />
      )}

      {showAvatarModal && (
        <UploadAvatarModal
          onClose={() => setShowAvatarModal(false)}
          onSaveSuccess={() => setShowAvatarModal(false)}
        />
      )}
    </div>
  );
}