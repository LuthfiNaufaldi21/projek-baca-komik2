import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { comics } from "../data/comics";
import { dummyChapterImages } from "../data/chapterImages"; // Pastikan path ini sesuai
import { useAuth } from "../hooks/useAuth";
import "../styles/ReaderPage.css";

export default function ReaderPage() {
  const { comicId, chapterId } = useParams();
  const navigate = useNavigate();
  const { updateReadingHistory } = useAuth();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Cari Data Komik & Chapter saat ini
  const comic = comics.find((c) => c.id === comicId);
  const currentChapterIndex = comic?.chapters?.findIndex(
    (ch) => ch.id === chapterId
  );
  const currentChapter = comic?.chapters?.[currentChapterIndex];

  // 2. Logika Navigasi (Next/Prev)
  const prevChapter =
    currentChapterIndex > 0 ? comic?.chapters[currentChapterIndex - 1] : null;

  const nextChapter =
    currentChapterIndex < (comic?.chapters?.length || 0) - 1
      ? comic?.chapters[currentChapterIndex + 1]
      : null;

  // 3. Load Gambar (Simulasi API)
  useEffect(() => {
    setLoading(true);

    // Scroll ke atas saat pindah chapter
    window.scrollTo({ top: 0, behavior: "instant" });

    // Simulasi delay network
    const timer = setTimeout(() => {
      // LOGIKA PENTING:
      // Jika di data comics.js chapter ini punya gambar, pakai itu.
      // Jika tidak (array kosong), pakai dummyChapterImages dari file lokalmu.
      if (currentChapter?.images && currentChapter.images.length > 0) {
        setImages(currentChapter.images);
      } else {
        setImages(dummyChapterImages);
      }
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [comicId, chapterId, currentChapter]);

  // 4. Update History (Bug Fixed: Dependency minimal)
  useEffect(() => {
    if (comicId && chapterId) {
      updateReadingHistory(comicId, chapterId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comicId, chapterId]);

  // Handler Navigasi
  const handleNavigate = (targetChapterId) => {
    navigate(`/read/${comicId}/${targetChapterId}`);
  };

  // --- TAMPILAN ---

  if (!comic || !currentChapter) {
    return (
      <div className="reader-error">
        <h2>Chapter tidak ditemukan</h2>
        <Link to="/" className="reader-btn-back">
          Kembali ke Home
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="reader-loading">
        <div className="spinner"></div>
        <p>Memuat Chapter...</p>
      </div>
    );
  }

  return (
    <div className="reader-page">
      {/* Header Sticky */}
      <header className="reader-header">
        <div className="reader-header__info">
          <h1 className="reader-header__title">{comic.title}</h1>
          <span className="reader-header__subtitle">
            {currentChapter.title}
          </span>
        </div>
        <Link to={`/detail/${comicId}`} className="reader-header__close">
          ✕ Tutup
        </Link>
      </header>

      {/* Area Baca */}
      <main className="reader-content">
        {images.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Page ${index + 1}`}
            className="reader-image"
            loading="lazy"
          />
        ))}
      </main>

      {/* Navigasi Bawah */}
      <footer className="reader-footer">
        <div className="reader-nav-buttons">
          <button
            onClick={() => prevChapter && handleNavigate(prevChapter.id)}
            disabled={!prevChapter}
            className="reader-nav-btn reader-nav-btn--prev"
          >
            ← Prev Chapter
          </button>

          <button
            onClick={() => nextChapter && handleNavigate(nextChapter.id)}
            disabled={!nextChapter}
            className="reader-nav-btn reader-nav-btn--next"
          >
            Next Chapter →
          </button>
        </div>
        <p className="reader-footer__text">
          Kamu sedang membaca {currentChapter.title}
        </p>
      </footer>
    </div>
  );
}
