import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { comics } from "../data/comics";
import ComicCard from "../components/ComicCard";
import Pagination from "../components/Pagination";
import "../styles/SearchPage.css";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  // Reset currentPage to 1 when query changes using key prop
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    <div key={query}>
      <h1 className="search-page__title">Hasil Pencarian untuk "{query}"</h1>
      <p className="search-page__results-count">
        Ditemukan {searchResults.length} komik
      </p>

      {searchResults.length === 0 ? (
        <div className="search-page__empty-state">
          <p className="search-page__empty-text">
            Tidak ada hasil yang ditemukan untuk "{query}"
          </p>
          <p className="search-page__empty-hint">
            Coba gunakan kata kunci lain
          </p>
        </div>
      ) : (
        <>
          <div className="search-page__grid">
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
