import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { comics } from "../data/comics";
import ComicCard from "../components/ComicCard";
import Pagination from "../components/Pagination";
import { FiClock, FiList, FiLock } from "react-icons/fi";
import "../styles/RiwayatPage.css";

export default function RiwayatPage() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Tampilkan 10 komik per halaman

  // Redirect jika belum login
  if (!isLoggedIn) {
    return (
      <div className="riwayat-page__auth-required">
        <FiLock className="riwayat-page__empty-icon" />
        <h2 className="riwayat-page__auth-title">
          Anda harus login untuk melihat riwayat
        </h2>
        <Link to="/login" className="riwayat-page__auth-link">
          Login sekarang
        </Link>
      </div>
    );
  }

  // 1. Ambil Data Riwayat (Sama seperti logic AccountPage)
  const readingHistory = (() => {
    if (!user?.readingHistory) return [];

    return Object.entries(user.readingHistory)
      .reverse()
      .map(([comicId, chapterId]) => {
        const comic = comics.find((c) => c.id === comicId);
        if (!comic) return null;

        // Parse chapter info from chapterId
        // chapterId could be: number, /baca-chapter/slug/num, or full URL
        let chapterInfo = "Chapter Terakhir";
        let displayChapterId = chapterId;

        try {
          if (typeof chapterId === "string") {
            if (chapterId.startsWith("/baca-chapter/")) {
              // Extract chapter number from path like /baca-chapter/one-piece/1133
              const parts = chapterId.split("/");
              const chapterNum = parts[parts.length - 1];
              chapterInfo = `Chapter ${chapterNum}`;
              displayChapterId = chapterId;
            } else if (chapterId.startsWith("http")) {
              // Extract from URL
              const urlParts = chapterId.split("/");
              const lastPart =
                urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
              const match = lastPart.match(/chapter[_-]?(\d+)/i);
              chapterInfo = match ? `Chapter ${match[1]}` : "Chapter Terakhir";
              displayChapterId = chapterId;
            } else {
              // Plain chapter number or ID
              chapterInfo = `Chapter ${chapterId}`;
              displayChapterId = chapterId;
            }
          } else {
            chapterInfo = `Chapter ${chapterId}`;
            displayChapterId = chapterId;
          }
        } catch (e) {
          console.error("Error parsing chapter info:", e);
        }

        return {
          ...comic,
          lastReadChapter: chapterInfo,
          lastReadChapterId: displayChapterId,
        };
      })
      .filter(Boolean);
  })();

  // 2. Logic Pagination
  const totalPages = Math.ceil(readingHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComics = readingHistory.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="riwayat-page__container">
      <div className="riwayat-page__header">
        <h1 className="riwayat-page__title">Riwayat Bacaan</h1>
        <p className="riwayat-page__count">
          Total {readingHistory.length} komik pernah dibaca
        </p>
      </div>

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
              // Encode chapterId if it's a path or URL to avoid routing issues
              const encodedChapterId =
                typeof comic.lastReadChapterId === "string" &&
                (comic.lastReadChapterId.startsWith("/") ||
                  comic.lastReadChapterId.startsWith("http"))
                  ? encodeURIComponent(comic.lastReadChapterId)
                  : comic.lastReadChapterId;

              return (
                <div key={comic.id} className="riwayat-page__card-wrapper">
                  <ComicCard comic={comic} />

                  {/* Info Chapter Terakhir */}
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
