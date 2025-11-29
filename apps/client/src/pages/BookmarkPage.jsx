import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { comics } from "../data/comics";
import ComicCard from "../components/ComicCard";
import Pagination from "../components/Pagination";
import { FiBookmark, FiLock } from "react-icons/fi"; // Pastikan install: npm install react-icons
import "../styles/BookmarkPage.css";

export default function BookmarkPage() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- LOGIKA DATA (FRONTEND VERSION) ---
  // Convert user.bookmarks to simple array of comic IDs
  const bookmarkIds = (() => {
    if (!user?.bookmarks || !Array.isArray(user.bookmarks)) return [];
    // Handle both formats: [{comicId, bookmarkedAt}] or [comicId]
    return user.bookmarks.map((b) => (typeof b === "object" ? b.comicId : b));
  })();

  const bookmarkedComics = comics.filter((comic) =>
    bookmarkIds.includes(comic.id)
  );

  const totalPages = Math.ceil(bookmarkedComics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComics = bookmarkedComics.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- TAMPILAN UI BARU (Agar tidak gepeng) ---
  return (
    <div className="bookmark-page__container">
      {/* Header: Selalu Tampil */}
      <div className="bookmark-page__header">
        <h1 className="bookmark-page__title">Bookmark Saya</h1>
        <p className="bookmark-page__count">
          {isLoggedIn
            ? `Total ${bookmarkedComics.length} komik tersimpan`
            : "Kelola koleksi komik favoritmu"}
        </p>
      </div>

      {/* KONDISI 1: BELUM LOGIN */}
      {!isLoggedIn ? (
        <div className="bookmark-page__auth-required">
          <FiLock className="bookmark-page__empty-icon" />
          <h2 className="bookmark-page__auth-title">Akses Terbatas</h2>
          <p className="bookmark-page__empty-text">
            Silakan login terlebih dahulu untuk melihat bookmark kamu.
          </p>
          <Link to="/login" className="bookmark-page__auth-link">
            Login Sekarang
          </Link>
        </div>
      ) : /* KONDISI 2: SUDAH LOGIN TAPI KOSONG */
      bookmarkedComics.length === 0 ? (
        <div className="bookmark-page__empty">
          <FiBookmark className="bookmark-page__empty-icon" />
          <p className="bookmark-page__empty-text">
            Belum ada komik yang dibookmark.
          </p>
          <button
            onClick={() => navigate("/daftar-komik")}
            className="bookmark-page__browse-button"
          >
            Jelajahi Komik
          </button>
        </div>
      ) : (
        /* KONDISI 3: ADA DATA (GRID) */
        <>
          <div className="bookmark-page__grid">
            {currentComics.map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
