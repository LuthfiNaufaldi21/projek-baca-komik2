import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { comics } from "../data/comics";
import ComicCard from "../components/ComicCard";
import Pagination from "../components/Pagination";
import "../styles/BookmarkPage.css";

export default function BookmarkPage() {
  const { isLoggedIn, user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (!isLoggedIn) {
    return (
      <div className="bookmark-page__auth-container">
        <div className="bookmark-page__auth-card">
          <div className="bookmark-page__auth-icon">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </div>
          <h2 className="bookmark-page__auth-title">Simpan Komik Favoritmu!</h2>
          <p className="bookmark-page__auth-desc">
            Login untuk mengakses bookmark dan melanjutkan bacaanmu dari
            perangkat mana saja.
          </p>
          <Link to="/login" className="bookmark-page__auth-button">
            Login Sekarang
          </Link>
          <p className="bookmark-page__auth-footer">
            Belum punya akun?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Daftar disini
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const bookmarkedComics = comics.filter((comic) =>
    user?.bookmarks?.includes(comic.id)
  );

  if (bookmarkedComics.length === 0) {
    return (
      <div>
        <h2 className="bookmark-page__empty-title">Bookmark Saya</h2>
        <p className="bookmark-page__empty-text">
          Anda belum memiliki bookmark.
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(bookmarkedComics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComics = bookmarkedComics.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <h1 className="bookmark-page__title">Bookmark Saya</h1>
      <p className="bookmark-page__count">
        Total {bookmarkedComics.length} komik tersimpan
      </p>

      <div className="bookmark-page__grid">
        {currentComics.map((comic) => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
