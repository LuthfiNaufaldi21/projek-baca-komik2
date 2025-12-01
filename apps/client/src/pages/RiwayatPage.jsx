import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { comics } from "../data/comics";
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

  // Jika belum login
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

  // === PROSES RIWAYAT BACAAN ===
  const readingHistory = (() => {
    if (!user?.readingHistory) return [];

    return Object.entries(user.readingHistory)
      .reverse()
      .map(([comicId, chapterId]) => {
        const comic = comics.find((c) => c.id === comicId);
        if (!comic) return null;

        let chapterInfo = "Chapter Terakhir";
        let displayChapterId = chapterId;

        try {
          if (typeof chapterId === "string") {
            if (chapterId.startsWith("/baca-chapter/")) {
              const parts = chapterId.split("/");
              chapterInfo = `Chapter ${parts[parts.length - 1]}`;
              displayChapterId = chapterId;
            } else if (chapterId.startsWith("http")) {
              const match = chapterId.match(/chapter[-_]?(\d+)/i);
              chapterInfo = match ? `Chapter ${match[1]}` : "Chapter Terakhir";
              displayChapterId = chapterId;
            } else if (!isNaN(chapterId)) {
              // chapterId berupa angka string, misal "1133"
              chapterInfo = `Chapter ${chapterId}`;
            }
          } else if (typeof chapterId === "number") {
            chapterInfo = `Chapter ${chapterId}`;
          }
        } catch (e) {
          console.error("Error parsing chapter:", e);
        }

        return {
          ...comic,
          lastReadChapter: chapterInfo,
          lastReadChapterId: displayChapterId,
        };
      })
      .filter(Boolean);
  })();

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
                <div key={comic.id} className="riwayat-page__card-wrapper">
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
