import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchComics } from "../services/comicService";
import ComicCard from "../components/ComicCard";
import Pagination from "../components/Pagination";
import { FaSpinner } from "react-icons/fa";
import "../styles/SearchPage.css";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [lastQuery, setLastQuery] = useState(query);

  // Reset page when query changes
  if (query !== lastQuery) {
    setLastQuery(query);
    setCurrentPage(1);
  }

  // Fetch search results from local service
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([]);
        return;
      }

      try {
        setIsLoading(true);
        const results = await searchComics(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching comics:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [query]);

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComics = searchResults.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1 className="search-page__title">Hasil Pencarian untuk "{query}"</h1>
      <p className="search-page__results-count">
        {isLoading ? "Mencari..." : `Ditemukan ${searchResults.length} komik`}
      </p>

      {isLoading ? (
        <div className="search-page__loading">
          <FaSpinner className="search-page__loading-spinner" />
          <p>Mencari komik...</p>
        </div>
      ) : searchResults.length === 0 ? (
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
              <ComicCard key={comic.slug || comic.id} comic={comic} />
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
