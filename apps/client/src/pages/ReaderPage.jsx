import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getChapterImages, getComicBySlug } from "../services/comicService";
import { get } from "../services/api";
import "../styles/ReaderPage.css";

export default function ReaderPage() {
  const { comicId, chapterId } = useParams();
  const navigate = useNavigate();
  const { updateReadingHistory } = useAuth();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [detail, setDetail] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [prevChapter, setPrevChapter] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);

  // --- [FITUR DARI MASTER] STATE UNTUK SMART BADGE ---
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  // -------------------------------------------

  // Decode chapterId (menangani karakter encoding di URL)
  let decodedChapterId = chapterId;
  try {
    decodedChapterId = decodeURIComponent(chapterId);
  } catch {}

  // 1. Load detail komik + daftar chapter
  useEffect(() => {
    let mounted = true;
    const loadDetail = async () => {
      try {
        const localData = await getComicBySlug(comicId);
        if (!mounted) return;

        setDetail(localData);

        let chapters = Array.isArray(localData?.chapters)
          ? localData.chapters
          : [];

        try {
          const liveData = await get(`/detail-komik/${comicId}`);
          if (
            liveData &&
            Array.isArray(liveData.chapters) &&
            liveData.chapters.length > 0
          ) {
            chapters = liveData.chapters;
          }
        } catch {}

        let idx = -1;
        if (decodedChapterId.startsWith("/") || decodedChapterId.startsWith("http")) {
          idx = chapters.findIndex((ch) => ch.apiLink === decodedChapterId);
        } else {
          idx = chapters.findIndex(
            (ch) => String(ch.chapterNumber) === String(decodedChapterId)
          );
        }

        const cur = idx >= 0 ? chapters[idx] : null;
        setCurrentChapter(cur);

        setNextChapter(idx > 0 ? chapters[idx - 1] : null);
        setPrevChapter(
          idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null
        );
      } catch {
        setDetail(null);
      } finally {
        if (mounted) setLoadingDetail(false);
      }
    };

    loadDetail();
    return () => (mounted = false);
  }, [comicId, decodedChapterId]);

  // 2. Load gambar
  useEffect(() => {
    let mounted = true;
    const loadImages = async () => {
      try {
        setLoading(true);
        window.scrollTo({ top: 0, behavior: "instant" });
        
        // --- [FITUR DARI MASTER] RESET PROGRESS SAAT GANTI CHAPTER ---
        setScrollProgress(0);
        // -----------------------------------------------------

        const data = await getChapterImages(comicId, decodedChapterId);
        if (!mounted) return;

        const normalized = (Array.isArray(data?.images) ? data.images : [])
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
      } catch {
        setImages([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadImages();
    return () => (mounted = false);
  }, [comicId, decodedChapterId]);

  // 3. Update History
  useEffect(() => {
    if (comicId && decodedChapterId) {
      updateReadingHistory(comicId, decodedChapterId);
    }
  }, [comicId, decodedChapterId, updateReadingHistory]);

  // --- [FITUR DARI MASTER] LOGIC SCROLL LISTENER ---
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalHeight > 0) {
        setScrollProgress(Math.min((currentScroll / totalHeight) * 100, 100));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Sembunyikan back-to-top global agar tidak tumpang tindih dengan smart badge
    const style = document.createElement('style');
    style.innerHTML = '.back-to-top { display: none !important; }';
    document.head.appendChild(style);

    return () => { 
        window.removeEventListener("scroll", handleScroll);
        document.head.removeChild(style);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // ------------------------------------------

  // Handler Navigasi
  const handleNavigate = (targetChapter) => {
    const linkParam = targetChapter.apiLink
      ? encodeURIComponent(targetChapter.apiLink)
      : targetChapter.chapterNumber;

    navigate(`/read/${comicId}/${linkParam}`);
  };

  if (loading || loadingDetail) {
    return (
      <div className="reader-loading">
        <div className="spinner"></div>
        <p>Memuat Chapter...</p>
      </div>
    );
  }

  if (!currentChapter || images.length === 0) {
    return (
      <div className="reader-error">
        <h2>Chapter tidak ditemukan</h2>
        <Link to="/" className="reader-btn-back">Kembali ke Home</Link>
      </div>
    );
  }

  return (
    <div className="reader-page">
      {/* --- [FITUR DARI MASTER] FLOATING SMART BADGE --- */}
      <button 
        onClick={handleScrollToTop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="reader-progress-floating"
      >
        {isHovered ? (
          <svg className="reader-icon-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7 7 7 M12 3v18" />
          </svg>
        ) : (
          <span className="reader-progress-text">{Math.round(scrollProgress)}%</span>
        )}
        <svg className="reader-progress-circle" viewBox="0 0 36 36">
          <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path className="circle-value" strokeDasharray={`${scrollProgress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
      </button>
      {/* ----------------------------------------- */}

      {/* --- [FITUR DARI MASTER] Header Sticky (Tombol Tutup) --- */}
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

      {/* --- [LAYOUT DARI BRANCH BARU] JUDUL DI ATAS, TENGAH --- */}
      <div className="reader-title-center">
        <h1>{detail?.title || comicId}</h1>
        <p>{currentChapter.title}</p>
      </div>

      {/* === AREA KOMIK === */}
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

      {/* === NAVIGASI BAWAH === */}
      <footer className="reader-footer">
        <div className="reader-nav-buttons">
          <button
            onClick={() => prevChapter && handleNavigate(prevChapter)}
            disabled={!prevChapter}
            className="reader-nav-btn"
          >
            ← Prev Chapter
          </button>

          <button
            onClick={() => nextChapter && handleNavigate(nextChapter)}
            disabled={!nextChapter}
            className="reader-nav-btn"
          >
            Next Chapter →
          </button>
        </div>
      </footer>
    </div>
  );
}