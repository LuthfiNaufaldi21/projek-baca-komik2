import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBookmark, FaRegBookmark, FaStar } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import "../styles/ComicCard.css";

export default function ComicCard({ comic }) {
  const { isBookmarked, addBookmark, removeBookmark, isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  // Prefer slug; fallback to derive from apiDetailLink; lastly use id
  const derivedSlug =
    comic?.slug ||
    (comic?.apiDetailLink
      ? String(comic.apiDetailLink).split("/").filter(Boolean).pop()
      : null) ||
    (comic?.originalLink
      ? String(comic.originalLink).split("/").filter(Boolean).pop()
      : null);

  const bookmarkKey = comic?.id || derivedSlug;
  const bookmarked = isBookmarked(bookmarkKey);

  const handleBookmarkClick = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      showToast(
        "Silakan login terlebih dahulu untuk menambahkan bookmark",
        "error"
      );
      return;
    }

    if (isBookmarkLoading) return; // Prevent double click

    setIsBookmarkLoading(true);
    try {
      if (bookmarked) {
        await removeBookmark(bookmarkKey);
        showToast("Bookmark dihapus", "info");
      } else {
        await addBookmark(bookmarkKey);
        showToast("Berhasil ditambahkan ke bookmark!", "success");
      }
    } catch (error) {
      console.error("Bookmark error:", error);
      showToast("Gagal memproses bookmark", "error");
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  return (
    <div className="comic-card group">
      <Link
        to={`/detail/${derivedSlug || comic.id}`}
        className="comic-card__link"
      >
        <div className="comic-card__image-wrapper">
          {/* Main Image */}
          <img
            src={comic.cover || comic.image || comic.thumbnail}
            alt={comic.title}
            className="comic-card__image"
            loading="lazy"
          />

          {/* Gradient Overlay */}
          <div className="comic-card__image-overlay"></div>

          {/* Bookmark Button */}
          <div className="comic-card__bookmark-wrapper">
            <button
              onClick={handleBookmarkClick}
              className={`comic-card__bookmark-button ${
                bookmarked
                  ? "comic-card__bookmark-button--saved"
                  : "comic-card__bookmark-button--unsaved"
              } ${
                isBookmarkLoading ? "comic-card__bookmark-button--loading" : ""
              }`}
              title={bookmarked ? "Hapus Bookmark" : "Tambah Bookmark"}
              disabled={isBookmarkLoading}
            >
              {isBookmarkLoading ? (
                <FiLoader className="comic-card__bookmark-icon comic-card__bookmark-icon--spinner" />
              ) : bookmarked ? (
                <FaBookmark className="comic-card__bookmark-icon" />
              ) : (
                <FaRegBookmark className="comic-card__bookmark-icon" />
              )}
            </button>
          </div>

          {/* Always visible bookmark indicator if bookmarked */}
          {bookmarked && (
            <div className="comic-card__bookmark-indicator">
              <div className="comic-card__bookmark-flag">
                <FaBookmark className="comic-card__bookmark-flag-icon" />
              </div>
            </div>
          )}
        </div>

        <div className="comic-card__content">
          <h3 className="comic-card__title">{comic.title}</h3>
          <p className="comic-card__author">
            <span className="comic-card__author-dot"></span>
            {comic.author}
          </p>

          {comic.tags && comic.tags.length > 0 && (
            <div className="comic-card__tags">
              {comic.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="comic-card__tag">
                  {tag}
                </span>
              ))}
              {comic.tags.length > 3 && (
                <span className="comic-card__tag-more">
                  + {comic.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="comic-card__footer">
            <div className="comic-card__rating-wrapper">
              <FaStar className="comic-card__rating-icon" />
              <span className="comic-card__rating-value">{comic.rating}</span>
            </div>
            <span className="comic-card__read-link">Baca Sekarang →</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
