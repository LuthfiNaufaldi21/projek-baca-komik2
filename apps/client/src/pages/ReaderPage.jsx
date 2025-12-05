import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getChapterImages, getComicBySlug } from "../services/comicService";
import { get } from "../services/api";
import { markChapterRead } from "../services/authService";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiArrowUp,
  FiRefreshCw,
} from "react-icons/fi";
import "../styles/ReaderPage.css";

export default function ReaderPage() {
  const { comicId, chapterId } = useParams();
  const navigate = useNavigate();
  const { updateReadingHistory, isLoggedIn } = useAuth();

  // State Data
  const [images, setImages] = useState([]);
  const [loadingImages, setLoadingImages] = useState(true); // Ganti nama biar jelas
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [imageError, setImageError] = useState(false); // Error state for images

  const [detail, setDetail] = useState(null);
  const [allChapters, setAllChapters] = useState([]); // Daftar semua chapter

  // State Navigasi Chapter
  const [currentChapter, setCurrentChapter] = useState(null);
  const [prevChapter, setPrevChapter] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);

  // State UI
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const activeChapterRef = useRef(null); // Ref untuk auto-scroll dropdown
  const dropdownListRef = useRef(null); // Ref untuk container dropdown
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Decode ID aman
  let decodedChapterId = chapterId;
  try {
    decodedChapterId = decodeURIComponent(chapterId);
  } catch {
    console.error("Failed to decode chapterId");
  }

  // 1. OPTIMASI: Fetch Detail Komik HANYA jika comicId berubah
  useEffect(() => {
    let mounted = true;
    const fetchComicDetails = async () => {
      try {
        setLoadingDetail(true);
        // Cek data lokal dulu
        const localData = await getComicBySlug(comicId);
        if (!mounted) return;

        setDetail(localData);
        let chapters = Array.isArray(localData?.chapters)
          ? localData.chapters
          : [];

        // Cek data live (jika perlu update chapter terbaru)
        try {
          const liveData = await get(`/detail-komik/${comicId}`);
          if (liveData?.chapters?.length > 0) {
            chapters = liveData.chapters;
          }
        } catch (err) {
          console.log("Using cached chapters due to error:", err);
        }

        setAllChapters(chapters);
      } catch (e) {
        console.error("Failed to load comic details:", e);
      } finally {
        if (mounted) setLoadingDetail(false);
      }
    };

    fetchComicDetails();
    return () => {
      mounted = false;
    };
  }, [comicId]); // Dependency hanya comicId, bukan chapterId!

  // 2. OPTIMASI: Kalkulasi Prev/Next HANYA jika allChapters atau chapterId berubah
  // Ini tidak melakukan fetch API, hanya logika JS. Cepat.
  useEffect(() => {
    if (allChapters.length === 0) return;

    let idx = -1;
    // Logika pencarian index yang robust
    if (
      decodedChapterId.startsWith("/") ||
      decodedChapterId.startsWith("http")
    ) {
      idx = allChapters.findIndex((ch) => ch.apiLink === decodedChapterId);
    } else {
      idx = allChapters.findIndex(
        (ch) => String(ch.chapterNumber) === String(decodedChapterId)
      );
    }

    const cur = idx >= 0 ? allChapters[idx] : null;
    setCurrentChapter(cur);

    // Logika Next/Prev (Sesuai request: Next = Chapter Baru, Prev = Chapter Lama)
    // Asumsi Array Descending (Index 0 = Chapter Paling Baru)
    setNextChapter(idx > 0 ? allChapters[idx - 1] : null);
    setPrevChapter(
      idx >= 0 && idx < allChapters.length - 1 ? allChapters[idx + 1] : null
    );
  }, [allChapters, decodedChapterId]);

  // 3. Fetch Images (Tetap berjalan saat chapterId berubah)
  useEffect(() => {
    let mounted = true;
    const loadImages = async () => {
      try {
        setLoadingImages(true);
        setImageError(false); // Reset error state
        window.scrollTo({ top: 0, behavior: "instant" });
        setScrollProgress(0);

        const data = await getChapterImages(comicId, decodedChapterId);
        if (!mounted) return;

        const imgs = Array.isArray(data?.images) ? data.images : [];
        const normalized = imgs
          .map((it) =>
            typeof it === "string"
              ? { src: it, fallbackSrc: it }
              : {
                  src: it?.src || it?.url || "",
                  fallbackSrc: it?.fallbackSrc || it?.src || "",
                  alt: it?.alt || "",
                }
          )
          .filter((it) => it.src);
        setImages(normalized);
      } catch (e) {
        console.error("Failed to load images:", e);
        setImages([]);
        if (mounted) setImageError(true); // Set error state
      } finally {
        if (mounted) setLoadingImages(false);
      }
    };
    loadImages();
    return () => {
      mounted = false;
    };
  }, [comicId, decodedChapterId]);

  // 4. Update History & Mark Chapter as Read (DATABASE)
  useEffect(() => {
    if (comicId && decodedChapterId && isLoggedIn) {
      // Update read history (last chapter - upsert in read_history table)
      updateReadingHistory(comicId, decodedChapterId);

      // Mark chapter as read (all chapters - insert to read_chapters table)
      markChapterRead(comicId, decodedChapterId)
        .then(() => {
          console.log(
            `✅ [ReaderPage] Chapter ${decodedChapterId} marked as read in database`
          );
        })
        .catch((error) => {
          console.error(
            "❌ [ReaderPage] Failed to mark chapter as read:",
            error
          );
        });
    }
    // eslint-disable-next-line
  }, [comicId, decodedChapterId, isLoggedIn]);

  // 5. Scroll Handler & Hide Global BackToTop
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalHeight > 0) {
        setScrollProgress(Math.min((currentScroll / totalHeight) * 100, 100));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // CSS Injection (Masih dipakai tapi dengan cleanup yang pasti)
    const styleId = "hide-back-to-top-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = ".back-to-top { display: none !important; }";
      document.head.appendChild(style);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      const style = document.getElementById(styleId);
      if (style) document.head.removeChild(style);
    };
  }, []);

  // 6. UX Dropdown: Auto scroll ke active chapter
  useEffect(() => {
    if (isDropdownOpen && activeChapterRef.current && dropdownListRef.current) {
      const container = dropdownListRef.current;
      const item = activeChapterRef.current;

      // Manual scroll calculation to avoid window scrolling
      const itemTop = item.offsetTop;
      const itemHeight = item.offsetHeight;
      const containerHeight = container.offsetHeight;

      container.scrollTop = itemTop - containerHeight / 2 + itemHeight / 2;
    }
  }, [isDropdownOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  // Reload images when failed
  const handleReloadImages = async () => {
    try {
      setLoadingImages(true);
      setImageError(false);

      const data = await getChapterImages(comicId, decodedChapterId);
      const imgs = Array.isArray(data?.images) ? data.images : [];
      const normalized = imgs
        .map((it) =>
          typeof it === "string"
            ? { src: it, fallbackSrc: it }
            : {
                src: it?.src || it?.url || "",
                fallbackSrc: it?.fallbackSrc || it?.src || "",
                alt: it?.alt || "",
              }
        )
        .filter((it) => it.src);
      setImages(normalized);
    } catch (e) {
      console.error("Failed to reload images:", e);
      setImageError(true);
    } finally {
      setLoadingImages(false);
    }
  };

  if (loadingDetail && allChapters.length === 0) {
    return (
      <div className="reader-loading">
        <div className="spinner"></div>
        <p>Memuat Informasi Komik...</p>
      </div>
    );
  }

  if (loadingImages) {
    return (
      <div className="reader-loading">
        <div className="spinner"></div>
        <p>Memuat Gambar Chapter...</p>
      </div>
    );
  }

  if (!currentChapter || (images.length === 0 && !loadingImages)) {
    return (
      <div className="reader-error">
        <h2>Chapter tidak ditemukan atau gagal dimuat</h2>
        {imageError && (
          <p className="reader-error-message">
            Gagal memuat gambar chapter. Silakan coba lagi.
          </p>
        )}
        <div className="reader-error-actions">
          {imageError && (
            <button onClick={handleReloadImages} className="reader-btn-reload">
              <FiRefreshCw className="reader-icon-reload" />
              Coba Lagi
            </button>
          )}
          <Link to={`/detail/${comicId}`} className="reader-btn-back">
            Kembali ke Detail
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="reader-page">
      {/* Floating Badge */}
      <button
        onClick={handleScrollToTop}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="reader-progress-floating"
      >
        {isHovered ? (
          <FiArrowUp className="reader-icon-arrow" />
        ) : (
          <span className="reader-progress-text">
            {Math.round(scrollProgress)}%
          </span>
        )}
        <svg className="reader-progress-circle" viewBox="0 0 36 36">
          <path
            className="circle-bg"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
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
          <span className="reader-header__subtitle">
            {currentChapter.title}
          </span>
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

      {/* Main Content */}
      <main className="reader-content">
        {images.map((img, index) => (
          <img
            // Gunakan src sebagai key jika unik, jika tidak gunakan index
            key={img.src || index}
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
          <button
            onClick={() => prevChapter && handleNavigate(prevChapter)}
            disabled={!prevChapter}
            className="reader-nav-btn reader-nav-btn--prev"
            title="Chapter Sebelumnya"
          >
            <FiChevronLeft className="reader-nav-btn__icon" />
            <span className="reader-nav-btn__text">Prev</span>
          </button>

          <div className="reader-dropdown-wrapper" ref={dropdownRef}>
            <button
              className="reader-dropdown-trigger"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{currentChapter.title}</span>
              <FiChevronDown
                className={`reader-dropdown-icon ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="reader-dropdown-menu" ref={dropdownListRef}>
                {allChapters.map((ch) => {
                  const isActive =
                    ch.apiLink === currentChapter.apiLink ||
                    String(ch.chapterNumber) ===
                      String(currentChapter.chapterNumber);

                  return (
                    <div
                      // Tambahkan ref jika ini adalah chapter aktif
                      ref={isActive ? activeChapterRef : null}
                      key={ch.apiLink || ch.chapterNumber}
                      className={`reader-dropdown-item ${
                        isActive ? "active" : ""
                      }`}
                      onClick={() => handleNavigate(ch)}
                    >
                      {ch.title}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => nextChapter && handleNavigate(nextChapter)}
            disabled={!nextChapter}
            className="reader-nav-btn reader-nav-btn--next"
            title="Chapter Selanjutnya"
          >
            <span className="reader-nav-btn__text">Next</span>
            <FiChevronRight className="reader-nav-btn__icon" />
          </button>
        </div>

        <p className="reader-footer__text">
          Kamu sedang membaca {currentChapter.title}
        </p>
      </footer>
    </div>
  );
}
