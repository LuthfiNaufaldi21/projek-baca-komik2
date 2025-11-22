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
      <div className="bookmark-page__auth-required">
        <h2 className="bookmark-page__auth-title">
          Anda harus login terlebih dahulu
        </h2>
        <Link to="/login" className="bookmark-page__auth-link">
          Klik di sini untuk login
        </Link>
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
