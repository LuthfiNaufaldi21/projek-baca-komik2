import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getComicBySlug } from "../services/comicService";
import { get } from "../services/api";
import { useToast } from "../hooks/useToast";
import { comics as localComicsData } from "../data/comics";
import ComicCard from "../components/ComicCard";
import { FaStar, FaUser, FaClock, FaBookmark, FaRegBookmark, FaSpinner } from "react-icons/fa";
import "../styles/DetailPage.css";

export default function DetailPage() {
  const { id } = useParams();
  const {
    isBookmarked,
    addBookmark,
    removeBookmark,
    isLoggedIn,
    getReadingHistory,
  } = useAuth();
  const [isLoadingBookmark, setIsLoadingBookmark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [liveChapters, setLiveChapters] = useState([]);

  const { showToast } = useToast();
  const readingHistory = getReadingHistory();
  const lastReadChapterId = readingHistory[id];

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        // Ambil data lokal dulu
        const localData = await getComicBySlug(id);
        if (!mounted) return;

        // Coba ambil live chapters dari backend
        try {
          const liveData = await get(`/detail-komik/${id}`);
          if (liveData && liveData.chapters) setLiveChapters(liveData.chapters);
        } catch {
          // 🛠️ PERBAIKAN 1: Hapus '(err)' karena tidak dipakai
          console.log("Using local chapters fallback");
        }

        setDetail(localData);
      } catch {
        // 🛠️ PERBAIKAN 2: Hapus '(e)' karena tidak dipakai
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

  // --- Variabel Defensive (Cadangan) ---
  const cover = detail?.cover || detail?.thumbnail || detail?.image;
  const title = detail?.title || "";
  const author =
    detail?.author || detail?.info?.Pengarang || detail?.info?.Author || "-";
  const rating = detail?.rating || detail?.info?.Rating || "-";

  // ✅ Variabel status ditambahkan disini agar tidak error
  const status = detail?.status || "Update Tiap Minggu";

  const tags = detail?.tags || detail?.genres || [];
  const synopsis =
    detail?.synopsis ||
    detail?.sinopsis ||
    detail?.description ||
    "Sinopsis belum tersedia untuk komik ini.";

  const chapters =
    liveChapters.length > 0 ? liveChapters : detail?.chapters || [];

  const relatedComics = detail
    ? localComicsData
        .filter(
          (c) => c.id !== detail.id && c.tags?.some((tag) => tags.includes(tag))
        )
        .slice(0, 5)
    : [];

  const bookmarkKey = detail?.slug || id;
  const bookmarked = isBookmarked(bookmarkKey);

  const handleBookmarkClick = async () => {
    if (!isLoggedIn) {
      showToast("Login dulu bro kalau mau bookmark!", "error");
      return;
    }
    setIsLoadingBookmark(true);
    try {
      if (bookmarked) {
        await removeBookmark(bookmarkKey);
        showToast("Dihapus dari bookmark", "info");
      } else {
        await addBookmark(bookmarkKey);
        showToast("Berhasil disimpan!", "success");
      }
    } catch {
      // 🛠️ PERBAIKAN 3: Hapus '(error)' karena tidak dipakai
      showToast("Gagal bookmark", "error");
    } finally {
      setIsLoadingBookmark(false);
    }
  };

  if (loading)
    return (
      <div className="detail-page__not-found">
        <p>Memuat...</p>
      </div>
    );

  if (!detail) {
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

  return (
    <div className="detail-page__container">
      <div className="detail-page__hero-banner">
        <div
          className="detail-page__hero-bg"
          style={{ backgroundImage: `url('${cover}')` }}
        ></div>
        <div className="detail-page__hero-overlay"></div>
      </div>

      <div className="detail-page__content">
        <div className="detail-page__layout">
          {/* KOLOM KIRI: Cover & Tombol */}
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
                  <FaSpinner className="detail-page__icon detail-page__icon--spin" />
                  Loading...
                </>
              ) : bookmarked ? (
                <>
                  <FaBookmark className="detail-page__icon" />
                  Tersimpan
                </>
              ) : (
                <>
                  <FaRegBookmark className="detail-page__icon" />
                  Bookmark
                </>
              )}
            </button>
          </div>

          {/* KOLOM KANAN: Detail Info */}
          <div className="detail-page__info">
            <h1 className="detail-page__title">{title}</h1>

            <div className="detail-page__meta">
              <div className="detail-page__rating-badge">
                <FaStar className="detail-page__icon" />
                <span className="detail-page__rating-value">
                  {String(rating)}
                </span>
                /10
              </div>

              <div className="detail-page__meta-item">
                <FaUser className="detail-page__icon detail-page__icon--mr" />
                <span>{author}</span>
              </div>

              <div className="detail-page__meta-item">
                <FaClock className="detail-page__icon detail-page__icon--mr" />
                <span>{status}</span>
              </div>
            </div>

            <div className="detail-page__tags">
              {tags.map((tag, i) => (
                <Link
                  to={`/genre/${encodeURIComponent(tag)}`}
                  key={i}
                  className="detail-page__tag"
                >
                  {tag}
                </Link>
              ))}
            </div>

            <div className="detail-page__synopsis-container">
              <h3 className="detail-page__synopsis-title">Sinopsis</h3>
              <p className="detail-page__synopsis-text">{synopsis}</p>
            </div>
          </div>
        </div>

        <div className="detail-page__chapters">
          <h2 className="detail-page__chapters-title">Daftar Chapter</h2>

          {chapters && chapters.length > 0 ? (
            <div className="detail-page__chapters-list">
              {chapters.map((chapter, idx) => {
                const chapterNum =
                  chapter.chapterNumber || chapter.id || idx + 1;
                const linkParam = chapter.apiLink
                  ? encodeURIComponent(chapter.apiLink)
                  : chapterNum;
                const isRead = String(lastReadChapterId) === String(linkParam);

                return (
                  <Link
                    key={idx}
                    to={`/read/${detail.slug || id}/${linkParam}`}
                    className={`detail-page__chapter-link ${
                      isRead ? "detail-page__chapter-link--read" : ""
                    }`}
                  >
                    <span className="detail-page__chapter-title">
                      {chapter.title || `Chapter ${chapterNum}`}
                    </span>
                    {isRead && (
                      <span className="detail-page__chapter-badge">
                        Terakhir Dibaca
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="detail-page__no-chapters">
              Belum ada chapter tersedia untuk saat ini.
            </p>
          )}
        </div>

        {relatedComics.length > 0 && (
          <div className="detail-page__related">
            <h3 className="detail-page__related-title">Komik Sejenis</h3>
            <div className="detail-page__related-grid">
              {relatedComics.map((related) => (
                <ComicCard key={related.id} comic={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
