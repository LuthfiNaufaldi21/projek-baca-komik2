import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getComicBySlug } from "../services/comicService";
import "../styles/DetailPage.css";

export default function DetailPage() {
  const { id } = useParams(); // treat as slug
  const { isBookmarked, addBookmark, removeBookmark, isLoggedIn } = useAuth();
  const [isLoadingBookmark, setIsLoadingBookmark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const data = await getComicBySlug(id);
        if (!mounted) return;
        setDetail(data);
      } catch (e) {
        console.error("Failed to load detail:", e);
        setDetail(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Jika komik tidak ditemukan
  if (!loading && !detail) {
    return (
      <div className="detail-page__not-found">
        <h2 className="detail-page__not-found-title">
          🚨 404 - Komik Tidak Ditemukan
        </h2>
        <p className="detail-page__not-found-text">
          Maaf, komik yang Anda cari tidak ada di database kami.
        </p>
        <Link to="/" className="detail-page__not-found-link">
          Kembali ke Home
        </Link>
      </div>
    );
  }

  const bookmarkKey = detail?.slug || id;
  const bookmarked = isBookmarked(bookmarkKey);

  const handleBookmarkClick = async () => {
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk menambahkan bookmark");
      return;
    }

    setIsLoadingBookmark(true);
    try {
      if (bookmarked) {
        await removeBookmark(bookmarkKey);
      } else {
        await addBookmark(bookmarkKey);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      alert("Gagal mengubah bookmark. Silakan coba lagi.");
    } finally {
      setIsLoadingBookmark(false);
    }
  };

  if (loading) {
    return (
      <div className="detail-page__not-found">
        <p>Memuat detail komik...</p>
      </div>
    );
  }

  const cover = detail?.thumbnail;
  const title = detail?.title || "";
  const author = detail?.info?.Pengarang || detail?.info?.Author || "-";
  const rating = detail?.info?.Rating || "-";
  const tags = detail?.genres || [];
  const synopsis = detail?.sinopsis || detail?.description || "";
  const chapters = Array.isArray(detail?.chapters) ? detail.chapters : [];

  return (
    <div className="detail-page__container">
      {/* Hero Banner Background */}
      <div className="detail-page__hero-banner">
        <div
          className="detail-page__hero-bg"
          style={{ backgroundImage: `url('${cover}')` }}
        ></div>
        <div className="detail-page__hero-overlay"></div>
      </div>

      <div className="detail-page__content">
        <div className="detail-page__layout">
          {/* Kolom Kiri: Cover & Tombol Bookmark */}
          <div className="detail-page__cover-container">
            <div className="detail-page__cover-wrapper">
              <img
                src={cover}
                alt={title}
                className="detail-page__cover-image"
              />
            </div>

            <button
              onClick={handleBookmarkClick}
              disabled={isLoadingBookmark}
              className={`detail-page__bookmark-button ${
                bookmarked
                  ? "detail-page__bookmark-button--saved"
                  : "detail-page__bookmark-button--unsaved"
              } ${
                isLoadingBookmark ? "detail-page__bookmark-button--loading" : ""
              }`}
            >
              {isLoadingBookmark ? (
                <>
                  <svg
                    className="detail-page__icon detail-page__icon--spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </>
              ) : bookmarked ? (
                <>
                  <svg
                    className="detail-page__icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 2h14a2 2 0 012 2v18l-7-3.5L5 22V4a2 2 0 012-2z"></path>
                  </svg>
                  Tersimpan
                </>
              ) : (
                <>
                  <svg
                    className="detail-page__icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v18l7-5 7 5V3a2 2 0 00-2-2H7a2 2 0 00-2 2z"
                    />
                  </svg>
                  Bookmark
                </>
              )}
            </button>
          </div>

          {/* Kolom Kanan: Detail Info & Chapter */}
          <div className="detail-page__info">
            <h1 className="detail-page__title">{title}</h1>

            <div className="detail-page__meta">
              <div className="detail-page__rating-badge">
                <svg
                  className="detail-page__icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold">{String(rating)}</span>
                <span className="opacity-75 ml-1">/ 10</span>
              </div>

              <div className="detail-page__meta-item">
                <svg
                  className="detail-page__icon mr-2"
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
                <span>{author}</span>
              </div>

              <div className="detail-page__meta-item">
                <svg
                  className="detail-page__icon mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Update Tiap Minggu</span>
              </div>
            </div>

            {/* Tags */}
            <div className="detail-page__tags">
              {tags?.map((tag, index) => (
                <Link
                  to={`/genre/${encodeURIComponent(tag)}`}
                  key={index}
                  className="detail-page__tag"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Sinopsis */}
            <div className="detail-page__synopsis-container">
              <h3 className="detail-page__synopsis-title">Sinopsis</h3>
              <p className="detail-page__synopsis-text">{synopsis}</p>
            </div>
          </div>
        </div>

        {/* Daftar Chapter */}
        <div className="detail-page__chapters">
          <h2 className="detail-page__chapters-title">Daftar Chapter</h2>

          {chapters && chapters.length > 0 ? (
            <div className="detail-page__chapters-list">
              {chapters.map((chapter, idx) => (
                <Link
                  key={chapter.apiLink || idx}
                  to={`/read/${detail?.slug || id}/${chapter.chapterNumber}`}
                  className="detail-page__chapter-link"
                >
                  <span className="detail-page__chapter-title">
                    {chapter.title || `Chapter ${chapter.chapterNumber}`}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="detail-page__no-chapters">
              Belum ada chapter tersedia untuk saat ini.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
