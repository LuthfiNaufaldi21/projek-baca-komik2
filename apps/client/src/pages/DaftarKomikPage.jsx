import { useState, useMemo, useEffect } from "react";
import { getAllComics } from "../services/comicService";
import ComicCard from "../components/ComicCard";
import Pagination from "../components/Pagination";
import FilterBar from "../components/FilterBar";
import "../styles/DaftarKomikPage.css";

export default function DaftarKomikPage() {
  const [comics, setComics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchComics = async () => {
      try {
        setIsLoading(true);
        const data = await getAllComics();
        setComics(data);
      } catch (error) {
        console.error("Error fetching comics:", error);
        // Keep empty or previously loaded data
      } finally {
        setIsLoading(false);
      }
    };

    fetchComics();
  }, []);

  // Get unique tags from all comics
  const uniqueTags = useMemo(() => {
    const allTags = new Set();
    comics.forEach((comic) => {
      if (Array.isArray(comic.tags)) {
        comic.tags.forEach((tag) => allTags.add(tag));
      }
    });
    return Array.from(allTags).sort();
  }, [comics]);

  // Filter and sort comics
  const processedComics = useMemo(() => {
    let result = [...comics];

    // Apply filters
    if (activeFilters.length > 0) {
      result = result.filter((comic) =>
        activeFilters.every((filterTag) => comic.tags?.includes(filterTag))
      );
    }

    // Apply sorting
    if (sortOrder === "rating_desc") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === "title_asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === "title_desc") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
  }, [activeFilters, sortOrder, comics]);

  const totalPages = Math.ceil(processedComics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComics = processedComics.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortOrder(newSort);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="daftar-komik__title">Daftar Semua Komik</h1>
        <div className="daftar-komik__loading">Loading comics...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="daftar-komik__title">Daftar Semua Komik</h1>
      <p className="daftar-komik__description">
        Koleksi lengkap komik kami ({processedComics.length} hasil ditemukan)
      </p>

      <FilterBar
        uniqueTags={uniqueTags}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      {processedComics.length > 0 ? (
        <>
          <div className="daftar-komik__grid">
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
      ) : (
        <div className="daftar-komik__no-results">
          Tidak ada komik yang cocok dengan filter ini.
        </div>
      )}
    </div>
  );
}
