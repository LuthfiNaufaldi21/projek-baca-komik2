import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getChapterImages, getComicBySlug } from "../services/comicService";
import { get } from "../services/api";
// 1. Tambah FiArrowUp di sini
import { FiChevronLeft, FiChevronRight, FiChevronDown, FiArrowUp } from "react-icons/fi"; 
import "../styles/ReaderPage.css";

export default function ReaderPage() {
  const { comicId, chapterId } = useParams();
  const navigate = useNavigate();
  const { updateReadingHistory, isLoggedIn } = useAuth();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [detail, setDetail] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [prevChapter, setPrevChapter] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);

  const [allChapters, setAllChapters] = useState([]);

  // State Dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  let decodedChapterId = chapterId;
  try {
    decodedChapterId = decodeURIComponent(chapterId);
  } catch (e) {}

  // Close dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let mounted = true;
    const loadDetail = async () => {
      try {
        const localData = await getComicBySlug(comicId);
        if (!mounted) return;
        setDetail(localData);

        let chapters = Array.isArray(localData?.chapters) ? localData.chapters : [];
        try {
          const liveData = await get(`/detail-komik/${comicId}`);
          if (liveData && Array.isArray(liveData.chapters) && liveData.chapters.length > 0) {
            chapters = liveData.chapters;
          }
        } catch (liveErr) {
          console.log("Using dummy chapters:", liveErr);
        }

        setAllChapters(chapters);

        let idx = -1;
        if (decodedChapterId.startsWith("/") || decodedChapterId.startsWith("http")) {
          idx = chapters.findIndex((ch) => ch.apiLink === decodedChapterId);
        } else {
          idx = chapters.findIndex((ch) => String(ch.chapterNumber) === String(decodedChapterId));
        }

        const cur = idx >= 0 ? chapters[idx] : null;
        setCurrentChapter(cur);
        setNextChapter(idx > 0 ? chapters[idx - 1] : null);
        setPrevChapter(idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null);
      } catch (e) {
        console.error("Failed to load detail:", e);
      } finally {
        if (mounted) setLoadingDetail(false);
      }
    };
    loadDetail();
    return () => { mounted = false; };
  }, [comicId, decodedChapterId]);

  useEffect(() => {
    let mounted = true;
    const loadImages = async () => {
      try {
        setLoading(true);
        window.scrollTo({ top: 0, behavior: "instant" });
        setScrollProgress(0);

        const data = await getChapterImages(comicId, decodedChapterId);
        if (!mounted) return;
        const imgs = Array.isArray(data?.images) ? data.images : [];
        const normalized = imgs
          .map((it) =>
            typeof it === "string"
              ? { src: it, fallbackSrc: it }
              : { src: it?.src || it?.url || "", fallbackSrc: it?.fallbackSrc || it?.src || "", alt: it?.alt || "" }
          )
          .filter((it) => it.src);
        setImages(normalized);
      } catch (e) {
        console.error("Failed to load images:", e);
        setImages([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadImages();
    return () => { mounted = false; };
  }, [comicId, decodedChapterId]);

  useEffect(() => {
    if (comicId && decodedChapterId && isLoggedIn) {
      updateReadingHistory(comicId, decodedChapterId);
    }
    // eslint-disable-next-line
  }, [comicId, decodedChapterId, isLoggedIn]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalHeight > 0) {
        setScrollProgress(Math.min((currentScroll / totalHeight) * 100, 100));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const style = document.createElement("style");
    style.innerHTML = ".back-to-top { display: none !important; }";
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (targetChapter) => {
    const linkParam = targetChapter.apiLink
      ? encodeURIComponent(targetChapter.apiLink)
      : targetChapter.chapterNumber;
    setIsDropdownOpen(false);
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
        <Link to="/" className="reader-btn-back">
          Kembali ke Home
        </Link>
      </div>
    );
  }

  return (
    <div className="reader-page">
      {/* Floating Badge (Updated Icon) */}
      <button
        onClick={handleScrollToTop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="reader-progress-floating"
      >
        {isHovered ? (
          // 2. Menggunakan FiArrowUp menggantikan <svg> manual
          <FiArrowUp className="reader-icon-arrow" />
        ) : (
          <span className="reader-progress-text">{Math.round(scrollProgress)}%</span>
        )}
        
        {/* Lingkaran Progress tetap SVG karena butuh kalkulasi strokeDasharray */}
        <svg className="reader-progress-circle" viewBox="0 0 36 36">
          <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path
            className="circle-value"
            strokeDasharray={`${scrollProgress}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
      </button>

      {/* Header */}
      <header className="reader-header">
        <div className="reader-header__info">
          <h1 className="reader-header__title">{detail?.title || comicId}</h1>
          <span className="reader-header__subtitle">{currentChapter.title}</span>
        </div>

        <div className="reader-header__actions">
          <button
            onClick={() => prevChapter && handleNavigate(prevChapter)}
            disabled={!prevChapter}
            className="reader-header__btn"
            title="Chapter Sebelumnya"
          >
            <FiChevronLeft />
          </button>
          <span className="reader-header__divider"></span>
          <button
            onClick={() => nextChapter && handleNavigate(nextChapter)}
            disabled={!nextChapter}
            className="reader-header__btn"
            title="Chapter Selanjutnya"
          >
            <FiChevronRight />
          </button>
        </div>

        <Link to={`/detail/${comicId}`} className="reader-header__close">
          ✕ Tutup
        </Link>
      </header>

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

      {/* Footer Navigation */}
      <footer className="reader-footer">
        <div className="reader-nav-buttons">
          
          {/* Prev Button */}
          <button
            onClick={() => prevChapter && handleNavigate(prevChapter)}
            disabled={!prevChapter}
            className="reader-nav-btn reader-nav-btn--prev"
          >
            <FiChevronLeft className="mr-2" /> Prev
          </button>

          {/* CUSTOM DROPDOWN */}
          <div className="reader-dropdown-wrapper" ref={dropdownRef}>
            <button
              className="reader-dropdown-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{currentChapter.title}</span>
              <FiChevronDown
                className={`reader-dropdown-icon ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="reader-dropdown-menu">
                {allChapters.map((ch) => {
                   const isActive = ch.apiLink === currentChapter.apiLink || 
                                    String(ch.chapterNumber) === String(currentChapter.chapterNumber);
                   return (
                    <div
                      key={ch.apiLink || ch.chapterNumber}
                      className={`reader-dropdown-item ${isActive ? "active" : ""}`}
                      onClick={() => handleNavigate(ch)}
                    >
                      {ch.title}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => nextChapter && handleNavigate(nextChapter)}
            disabled={!nextChapter}
            className="reader-nav-btn reader-nav-btn--next"
          >
            Next <FiChevronRight className="ml-2" />
          </button>

        </div>

        <p className="reader-footer__text">
          Kamu sedang membaca {currentChapter.title}
        </p>
      </footer>
    </div>
  );
}