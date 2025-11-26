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

        const lastChapter = comic.chapters?.find((ch) => ch.id === chapterId);

        return {
          ...comic,
          lastReadChapter: lastChapter?.title || "Chapter Terhapus",
          lastReadChapterId: chapterId,
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
            {currentComics.map((comic) => (
              <div key={comic.id} className="riwayat-page__card-wrapper">
                <ComicCard comic={comic} />
                
                {/* Info Chapter Terakhir */}
                <Link
                  to={`/read/${comic.id}/${comic.lastReadChapterId}`}
                  className="riwayat-page__info"
                >
                  <FiClock className="riwayat-page__info-icon" />
                  <span className="riwayat-page__info-text">
                    {comic.lastReadChapter}
                  </span>
                </Link>
              </div>
            ))}
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