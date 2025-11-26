import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { comics as fallbackComics } from "../data/comics";
import { searchComics } from "../services/comicService";
import ComicCard from "../components/ComicCard";
import Pagination from "../components/Pagination";
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

  // Fetch search results from backend
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([]);
        return;
      }

      try {
        setIsLoading(true);
        const results = await searchComics(query);

        if (results && results.length > 0) {
          // Map backend data to expected format
          const mappedResults = results.map((comic, index) => ({
            id: comic.id || index + 1,
            title: comic.title || comic.name,
            image: comic.thumbnail || comic.image,
            rating: comic.rating || 4.5,
            author: comic.author || "Unknown",
            genre: comic.genre || "Fantasy",
            type: comic.type || "Manga",
            tags: comic.tags || [],
            synopsis: comic.synopsis || "",
            slug: comic.slug || comic.apiDetailLink?.split("/").pop(),
          }));
          setSearchResults(mappedResults);
        } else {
          // Try fallback local search
          const localResults = fallbackComics.filter((comic) => {
            const searchLower = query.toLowerCase();
            const hasTagMatch =
              Array.isArray(comic.tags) &&
              comic.tags.some((tag) => tag.toLowerCase().includes(searchLower));

            return (
              comic.title.toLowerCase().includes(searchLower) ||
              comic.author.toLowerCase().includes(searchLower) ||
              (comic.synopsis &&
                comic.synopsis.toLowerCase().includes(searchLower)) ||
              hasTagMatch
            );
          });
          setSearchResults(localResults);
        }
      } catch (error) {
        console.error("Error searching comics:", error);
        // Fallback to local search
        const localResults = fallbackComics.filter((comic) => {
          const searchLower = query.toLowerCase();
          const hasTagMatch =
            Array.isArray(comic.tags) &&
            comic.tags.some((tag) => tag.toLowerCase().includes(searchLower));

          return (
            comic.title.toLowerCase().includes(searchLower) ||
            comic.author.toLowerCase().includes(searchLower) ||
            (comic.synopsis &&
              comic.synopsis.toLowerCase().includes(searchLower)) ||
            hasTagMatch
          );
        });
        setSearchResults(localResults);
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
        <div className="search-page__loading">Loading...</div>
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
