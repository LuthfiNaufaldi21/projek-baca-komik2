import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast"; // IMPORT HOOK
import "../styles/ComicCard.css";

export default function ComicCard({ comic }) {
  const { isBookmarked, addBookmark, removeBookmark, isLoggedIn } = useAuth();
  const { showToast } = useToast(); // PANGGIL HOOK

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

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      // GANTI ALERT JADI TOAST
      showToast("Login dulu bro buat bookmark!", "error");
      return;
    }
    if (bookmarked) {
      removeBookmark(bookmarkKey);
      showToast("Dihapus dari bookmark", "info"); // Feedback Halus
    } else {
      addBookmark(bookmarkKey);
      showToast("Berhasil disimpan!", "success"); // Feedback Halus
    }
  };

  return (
    <div className="comic-card group">
      <Link
        to={`/detail/${derivedSlug || comic.id}`}
        className="comic-card__link"
      >
        <div className="comic-card__image-wrapper">
          <img
            src={comic.cover || comic.image || comic.thumbnail}
            alt={comic.title}
            className="comic-card__image"
            loading="lazy"
          />
          <div className="comic-card__image-overlay"></div>

          <div className="comic-card__bookmark-wrapper">
            <button
              onClick={handleBookmarkClick}
              className={`comic-card__bookmark-button ${
                bookmarked
                  ? "comic-card__bookmark-button--saved"
                  : "comic-card__bookmark-button--unsaved"
              }`}
              title={bookmarked ? "Hapus Bookmark" : "Tambah Bookmark"}
            >
              <svg
                className="comic-card__bookmark-icon"
                fill={bookmarked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          </div>

          {bookmarked && (
            <div className="comic-card__bookmark-indicator">
              <div className="comic-card__bookmark-flag">
                <svg
                  className="comic-card__bookmark-flag-icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
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
              <svg
                className="comic-card__rating-icon"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="comic-card__rating-value">{comic.rating}</span>
            </div>
            <span className="comic-card__read-link">Baca Sekarang →</span>
          </div>
        </div>
      </Link>
    </div>
  );
}