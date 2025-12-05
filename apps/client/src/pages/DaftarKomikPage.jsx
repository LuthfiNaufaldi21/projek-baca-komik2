import { useState, useMemo, useEffect } from "react";
import { getAllComics } from "../services/comicService";
import { useAuth } from "../hooks/useAuth";
import ComicCard from "../components/ComicCard";
import Pagination from "../components/Pagination";
import FilterBar from "../components/FilterBar";
import AddComicModal from "../components/AddComicModal";
import { FiPlus } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import "../styles/DaftarKomikPage.css";

export default function DaftarKomikPage() {
  const { user } = useAuth();
  const [comics, setComics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [showAddModal, setShowAddModal] = useState(false);
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

  // Get unique genres from all comics (from database)
  const uniqueTags = useMemo(() => {
    const allGenres = new Set();
    comics.forEach((comic) => {
      // Database format: genres array of objects with name property
      if (Array.isArray(comic.genres)) {
        comic.genres.forEach((genre) => {
          if (genre && genre.name) {
            allGenres.add(genre.name);
          }
        });
      }
      // Fallback for old format: tags array of strings
      else if (Array.isArray(comic.tags)) {
        comic.tags.forEach((tag) => allGenres.add(tag));
      }
    });
    return Array.from(allGenres).sort();
  }, [comics]);

  // Filter and sort comics
  const processedComics = useMemo(() => {
    let result = [...comics];

    // Apply filters based on genres from database
    if (activeFilters.length > 0) {
      result = result.filter((comic) => {
        // Database format: genres array of objects
        if (Array.isArray(comic.genres)) {
          const genreNames = comic.genres.map((g) => g.name);
          return activeFilters.every((filterTag) =>
            genreNames.includes(filterTag)
          );
        }
        // Fallback for old format: tags array
        else if (Array.isArray(comic.tags)) {
          return activeFilters.every((filterTag) =>
            comic.tags.includes(filterTag)
          );
        }
        return false;
      });
    }

    // Apply sorting
    if (sortOrder === "rating_desc") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === "rating_asc") {
      result.sort((a, b) => a.rating - b.rating);
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

  const handleComicAdded = (newComic) => {
    setComics((prev) => [newComic, ...prev]);
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="daftar-komik__title">Semua Komik</h1>
        <div className="daftar-komik__loading">
          <FaSpinner className="daftar-komik__loading-spinner" />
          <p>Memuat daftar komik...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="daftar-komik__header">
        <div>
          <h1 className="daftar-komik__title">Daftar Semua Komik</h1>
          <p className="daftar-komik__description">
            Koleksi lengkap komik kami ({processedComics.length} hasil
            ditemukan)
          </p>
        </div>
        {user?.role === "admin" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="daftar-komik__add-button"
          >
            <FiPlus /> Tambah Komik
          </button>
        )}
      </div>

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
              <ComicCard
                key={`comic-${comic.id}-${comic.slug}`}
                comic={comic}
              />
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

      {showAddModal && (
        <AddComicModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleComicAdded}
        />
      )}
    </div>
  );
}
