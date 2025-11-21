import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { comics } from "../data/comics";
import ComicCard from "../components/ComicCard";
import Pagination from "../components/Pagination";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const searchResults = comics.filter((comic) => {
    const searchLower = query.toLowerCase();
    return (
      comic.title.toLowerCase().includes(searchLower) ||
      comic.author.toLowerCase().includes(searchLower) ||
      comic.synopsis.toLowerCase().includes(searchLower) ||
      comic.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
    );
  });

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComics = searchResults.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Hasil Pencarian untuk "{query}"
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Ditemukan {searchResults.length} komik
      </p>

      {searchResults.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Tidak ada hasil yang ditemukan untuk "{query}"
          </p>
          <p className="text-gray-400 mt-2">Coba gunakan kata kunci lain</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
