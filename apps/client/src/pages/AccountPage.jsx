import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useEffect, useState, useMemo } from "react";
import {
  FiEdit2,
  FiBookmark,
  FiCalendar,
  FiHeart,
  FiLogOut,
  FiMail,
  FiTrash2,
  FiCamera,
  FiList,
  FiClock,
} from "react-icons/fi";
import EditProfileModal from "../components/EditProfileModal";
import UploadAvatarModal from "../components/UploadAvatarModal";
import ConfirmModal from "../components/ConfirmModal";
import ComicCard from "../components/ComicCard";
import { getInitials, getAvatarColor } from "../utils/getInitials";
import * as formatDate from "../utils/formatDate";
import * as authService from "../services/authService";
import "../styles/AccountPage.css";
import accountImage from "../assets/images/account-img.jpg";

export default function AccountPage() {
  const { isLoggedIn, user, logout, updateProfile, refreshUserData } =
    useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    showToast("Anda telah logout.", "info");
    setShowLogoutConfirm(false);
    navigate("/");
  };

  const handleSaveProfile = async (profileData) => {
    try {
      await updateProfile(profileData);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await authService.deleteAccount();
      showToast("Akun Anda telah berhasil dihapus.", "success");
      logout();
      setShowDeleteConfirm(false);
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      showToast(
        error.message || "Gagal menghapus akun. Silakan coba lagi.",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUploadAvatar = async () => {
    // Refresh user data to get updated avatar
    try {
      await refreshUserData();
      console.log("✅ Avatar updated, user data refreshed");
    } catch (error) {
      console.error("Failed to refresh user data after avatar upload:", error);
    }
    setShowAvatarModal(false);
  };

  // 1. Bookmarked Comics from database
  const bookmarkedComics = useMemo(() => {
    if (!user?.bookmarks || !Array.isArray(user.bookmarks)) return [];
    return user.bookmarks.map((bookmark) => bookmark.comic).filter(Boolean);
  }, [user?.bookmarks]);

  // 2. Reading History from database
  const readingHistory = useMemo(() => {
    if (!user?.readHistory || !Array.isArray(user.readHistory)) return [];

    // Sort by read_at DESC to show latest read first
    const sorted = [...user.readHistory].sort((a, b) => {
      const dateA = new Date(a.read_at || 0);
      const dateB = new Date(b.read_at || 0);
      return dateB - dateA; // DESC: newest first
    });

    return sorted
      .map((historyItem) => {
        const comic = historyItem.comic;
        if (!comic) return null;

        let chapterInfo = "Chapter";
        let chapterNumber = "";
        let displayChapterId = historyItem.chapter_slug;

        try {
          const chapterSlug = historyItem.chapter_slug;

          if (typeof chapterSlug === "string") {
            // Extract chapter number from various formats
            if (chapterSlug.startsWith("/baca-chapter/")) {
              // Format: /baca-chapter/spy-x-family/chapter-142
              const parts = chapterSlug.split("/");
              const lastPart = parts[parts.length - 1];
              const match = lastPart.match(/chapter[-_]?(\d+)/i);
              chapterNumber = match ? match[1] : lastPart;
            } else if (chapterSlug.startsWith("http")) {
              // Format: https://api.example.com/.../chapter-142
              const match = chapterSlug.match(/chapter[-_]?(\d+)/i);
              chapterNumber = match ? match[1] : "";
            } else if (chapterSlug.match(/chapter[-_]?(\d+)/i)) {
              // Format: chapter-142 or chapter_142
              const match = chapterSlug.match(/chapter[-_]?(\d+)/i);
              chapterNumber = match ? match[1] : "";
            } else if (!isNaN(chapterSlug)) {
              // Pure number: "142"
              chapterNumber = chapterSlug;
            }

            chapterInfo = chapterNumber
              ? `Chapter ${chapterNumber}`
              : "Chapter";
          } else if (typeof chapterSlug === "number") {
            chapterNumber = String(chapterSlug);
            chapterInfo = `Chapter ${chapterNumber}`;
          }
        } catch (e) {
          console.error("Error parsing chapter:", e);
        }

        return {
          ...comic,
          lastReadChapter: chapterInfo, // "Chapter 142"
          lastReadChapterId: displayChapterId,
        };
      })
      .filter(Boolean);
  }, [user?.readHistory]);

  // 3. Favorite Genre from reading history
  const favoriteGenre = useMemo(() => {
    if (readingHistory.length === 0) return "Belum ada";

    const genreCounts = {};
    readingHistory.forEach((comic) => {
      // Database format: genres array of objects
      if (Array.isArray(comic.genres)) {
        comic.genres.forEach((genre) => {
          const genreName = genre.name || genre;
          if (!["Manga", "Manhwa", "Manhua", "Warna"].includes(genreName)) {
            genreCounts[genreName] = (genreCounts[genreName] || 0) + 1;
          }
        });
      }
      // Fallback: tags array
      else if (Array.isArray(comic.tags)) {
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
  }, [readingHistory]);

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
            <div className="account-page__title-wrapper">
              <h2 className="account-page__title">
                {user?.username || "Pengguna"}
              </h2>
              {user?.role === "admin" && (
                <span className="account-page__admin-badge">ADMIN</span>
              )}
            </div>
            {user?.email && (
              <p className="account-page__email">
                <FiMail className="account-page__email-icon" />
                {user.email}
              </p>
            )}
            <p className="account-page__joined">
              <FiCalendar className="account-page__joined-icon" />
              Bergabung{" "}
              {formatDate.relative(
                user?.created_at || user?.joinedAt || new Date()
              )}
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
              onClick={handleDeleteAccount}
              className="account-page__delete-button"
            >
              <FiTrash2 />
              Hapus Akun
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
              {readingHistory.slice(0, 5).map((comic) => {
                // Encode chapterId if it's a path or URL to avoid routing issues
                const encodedChapterId =
                  typeof comic.lastReadChapterId === "string" &&
                  (comic.lastReadChapterId.startsWith("/") ||
                    comic.lastReadChapterId.startsWith("http"))
                    ? encodeURIComponent(comic.lastReadChapterId)
                    : comic.lastReadChapterId;

                return (
                  <div
                    key={comic.slug || comic.id}
                    className="account-page__history-card-wrapper"
                  >
                    {/* ComicCard tetap mengarah ke DetailPage (karena internal link-nya) */}
                    <ComicCard comic={comic} maxGenres={2} />

                    {/* Tombol Chapter Terakhir (Mengarah langsung ke Reader) */}
                    <Link
                      to={`/read/${comic.id}/${encodedChapterId}`}
                      className="account-page__history-info"
                    >
                      <FiClock className="account-page__history-icon" />
                      <span className="account-page__history-text">
                        {comic.lastReadChapter}
                      </span>
                    </Link>
                  </div>
                );
              })}
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

      {showAvatarModal && (
        <UploadAvatarModal
          user={user}
          onClose={() => setShowAvatarModal(false)}
          onSave={handleUploadAvatar}
        />
      )}

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Logout"
        message="Apakah Anda yakin ingin keluar dari akun Anda?"
        confirmText="Ya, Logout"
        cancelText="Batal"
        type="info"
      />

      {/* Delete Account Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => !isDeleting && setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteAccount}
        title="Hapus Akun"
        message="⚠️ PERINGATAN! Semua data Anda termasuk riwayat bacaan dan bookmark akan dihapus secara permanen dan tidak dapat dikembalikan."
        confirmText="Hapus Akun"
        cancelText="Batal"
        type="danger"
        requireTyping={true}
        typingText="HAPUS"
        isLoading={isDeleting}
      />
    </div>
  );
}
