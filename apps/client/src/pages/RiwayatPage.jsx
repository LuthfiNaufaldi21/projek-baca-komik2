import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ComicCard from "../components/ComicCard";
import Pagination from "../components/Pagination";
import { FiClock, FiList, FiLock, FiArrowLeft } from "react-icons/fi";
import "../styles/RiwayatPage.css";

export default function RiwayatPage() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navigationIndexRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Track navigation index on mount
  useEffect(() => {
    navigationIndexRef.current = window.history.length;
  }, []);

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="riwayat-page__container">
        <div className="riwayat-page__auth-required">
          <FiLock className="riwayat-page__empty-icon" />
          <h2 className="riwayat-page__auth-title">
            Anda harus login untuk melihat riwayat
          </h2>
          <Link to="/login" className="riwayat-page__auth-link">
            Login sekarang
          </Link>
        </div>
      </div>
    );
  }

  // Process reading history from database
  // Backend returns: user.readHistory = [{ id, comic_id, chapter_slug: "chapter-142", read_at, comic: {...} }]
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
              const lastPart = parts[parts.length - 1]; // "chapter-142"
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

  // Pagination
  const totalPages = Math.ceil(readingHistory.length / itemsPerPage);
  const currentComics = readingHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    // Check if previous page was ReaderPage
    if (window.history.length > 1 && navigationIndexRef.current) {
      const previousState = location.state;
      // If coming from ReaderPage, go back twice
      if (previousState?.fromReader || document.referrer.includes("/read/")) {
        navigate(-2);
      } else {
        navigate(-1);
      }
    } else {
      navigate("/");
    }
  };

  return (
    <div className="riwayat-page__container">
      {/* HEADER + TOMBOL KEMBALI */}
      <div className="riwayat-page__header">
        <div className="riwayat-page__header-text">
          <h1 className="riwayat-page__title">Riwayat Bacaan</h1>
          <p className="riwayat-page__count">
            Total {readingHistory.length} komik
          </p>
        </div>

        {/* TOMBOL KEMBALI */}
        <button onClick={handleBack} className="riwayat-page__back-button">
          <FiArrowLeft className="riwayat-page__back-icon" />
          Kembali
        </button>
      </div>

      {/* KONTEN UTAMA */}
      {readingHistory.length === 0 ? (
        <div className="riwayat-page__empty">
          <FiList className="riwayat-page__empty-icon" />
          <p className="riwayat-page__empty-text">
            Belum ada riwayat bacaan yang tercatat.
          </p>
          <button
            onClick={() => navigate("/daftar-komik")}
            className="riwayat-page__browse-button"
          >
            Mulai Membaca
          </button>
        </div>
      ) : (
        <>
          <div className="riwayat-page__grid">
            {currentComics.map((comic) => {
              const encodedChapterId =
                typeof comic.lastReadChapterId === "string" &&
                (comic.lastReadChapterId.startsWith("/") ||
                  comic.lastReadChapterId.startsWith("http"))
                  ? encodeURIComponent(comic.lastReadChapterId)
                  : comic.lastReadChapterId;

              return (
                <div
                  key={comic.slug || comic.id}
                  className="riwayat-page__card-wrapper"
                >
                  <ComicCard comic={comic} />

                  <Link
                    to={`/read/${comic.id}/${encodedChapterId}`}
                    className="riwayat-page__info"
                  >
                    <FiClock className="riwayat-page__info-icon" />
                    <span className="riwayat-page__info-text">
                      {comic.lastReadChapter}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
