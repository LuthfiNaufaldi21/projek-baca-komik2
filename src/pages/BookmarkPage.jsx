import { Link, useLocation } from "react-router-dom"; // 👈 Import useLocation
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { comics } from "../data/comics";
import ComicCard from "../components/ComicCard";
import Pagination from "../components/Pagination";
import "../styles/BookmarkPage.css";

export default function BookmarkPage() {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation(); // 👈 Definisikan useLocation
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [bookmarkedComics, setBookmarkedComics] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  // 🎯 LOGIC: Recalculate comics whenever the 'user' object or the 'location' changes
  useEffect(() => {
    if (!user || !user.bookmarks) {
      setBookmarkedComics([]);
      setTotalPages(0);
      setCurrentPage(1); 
      return;
    }
    
    // 1. Ekstrak hanya comicId dari array of objects
    const bookmarkedIds = user.bookmarks.map(item => item.comicId);

    // 2. Filter komik lokal yang cocok dengan ID
    const filteredComics = comics.filter((comic) =>
      bookmarkedIds.includes(comic.id)
    );

    // 3. Simpan hasil kalkulasi ke state
    setBookmarkedComics(filteredComics);
    setTotalPages(Math.ceil(filteredComics.length / itemsPerPage));
    setCurrentPage(1); 

  }, [user, location]); // 👈 KUNCI PERBAIKAN: Dependensi pada user DAN location

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

  if (bookmarkedComics.length === 0 && !user?.bookmarks?.length) { 
    return (
      <div>
        <h2 className="bookmark-page__empty-title">Bookmark Saya</h2>
        <p className="bookmark-page__empty-text">
          Anda belum memiliki bookmark.
        </p>
      </div>
    );
  }

  // Logic untuk pagination (menggunakan state yang baru)
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

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}