import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getChapterImages, getComicBySlug } from "../services/comicService";
import "../styles/ReaderPage.css";

export default function ReaderPage() {
  const { comicId, chapterId } = useParams(); // comicId is slug, chapterId is number
  const navigate = useNavigate();
  const { updateReadingHistory } = useAuth();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [prevChapter, setPrevChapter] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);

  // Load komik detail untuk mendapatkan daftar chapter (untuk prev/next)
  useEffect(() => {
    let mounted = true;
    const loadDetail = async () => {
      try {
        const data = await getComicBySlug(comicId);
        if (!mounted) return;
        setDetail(data);
        const chapters = Array.isArray(data?.chapters) ? data.chapters : [];
        // Temukan index berdasarkan chapterNumber (string/number tolerate)
        const idx = chapters.findIndex(
          (ch) => String(ch.chapterNumber) === String(chapterId)
        );
        const cur = idx >= 0 ? chapters[idx] : null;
        setCurrentChapter(cur);
        setPrevChapter(idx > 0 ? chapters[idx - 1] : null);
        setNextChapter(
          idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null
        );
      } catch (e) {
        console.error("Failed to load detail list:", e);
        setDetail(null);
        setCurrentChapter(null);
        setPrevChapter(null);
        setNextChapter(null);
      }
    };
    loadDetail();
    return () => {
      mounted = false;
    };
  }, [comicId, chapterId]);

  // Load gambar chapter dari backend
  useEffect(() => {
    let mounted = true;
    const loadImages = async () => {
      try {
        setLoading(true);
        window.scrollTo({ top: 0, behavior: "instant" });
        const data = await getChapterImages(comicId, chapterId);
        if (!mounted) return;
        const imgs = Array.isArray(data?.images) ? data.images : [];
        // Normalize to array of objects { src, fallbackSrc }
        const normalized = imgs
          .map((it) =>
            typeof it === "string"
              ? { src: it, fallbackSrc: it }
              : {
                  src: it?.src || it?.url || "",
                  fallbackSrc: it?.fallbackSrc || it?.src || it?.url || "",
                  alt: it?.alt || "",
                }
          )
          .filter((it) => it.src);
        setImages(normalized);
      } catch (e) {
        console.error("Failed to load chapter images:", e);
        setImages([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadImages();
    return () => {
      mounted = false;
    };
  }, [comicId, chapterId]);

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

  if (!currentChapter) {
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
          <h1 className="reader-header__title">{detail?.title || comicId}</h1>
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
        {images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.alt || `Page ${index + 1}`}
            className="reader-image"
            loading="lazy"
            onError={(e) => {
              if (img.fallbackSrc && e.currentTarget.src !== img.fallbackSrc) {
                e.currentTarget.src = img.fallbackSrc;
              }
            }}
          />
        ))}
      </main>

      {/* Navigasi Bawah */}
      <footer className="reader-footer">
        <div className="reader-nav-buttons">
          <button
            onClick={() =>
              prevChapter && handleNavigate(prevChapter.chapterNumber)
            }
            disabled={!prevChapter}
            className="reader-nav-btn reader-nav-btn--prev"
          >
            ← Prev Chapter
          </button>

          <button
            onClick={() =>
              nextChapter && handleNavigate(nextChapter.chapterNumber)
            }
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
