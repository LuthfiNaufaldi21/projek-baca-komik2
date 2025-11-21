import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { comics } from "../data/comics";
import ComicCard from "../components/ComicCard";
import Pagination from "../components/Pagination";

export default function BookmarkPage() {
  const { isLoggedIn, user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  if (!isLoggedIn) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-700 dark:text-gray-200 mb-4">
          Anda harus login terlebih dahulu
        </h2>
        <Link to="/login" className="text-primary hover:underline">
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
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Bookmark Saya
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
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
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Bookmark Saya
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Total {bookmarkedComics.length} komik tersimpan
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
