import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getComicsByGenre } from "../services/comicService";
import ComicCard from "../components/ComicCard";
import Pagination from "../components/Pagination";
import { FiArrowLeft } from "react-icons/fi";
import "../styles/GenrePage.css";

export default function GenrePage() {
  const { tag } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const navigationIndexRef = useRef(null);
  const decodedTag = decodeURIComponent(tag);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const comicsPerPage = 10;

  // Track navigation index on mount
  useEffect(() => {
    navigationIndexRef.current = window.history.length;
  }, []);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        setIsLoading(true);
        const data = await getComicsByGenre(decodedTag);
        setFiltered(data);
      } catch (error) {
        console.error("Error fetching genre comics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComics();
  }, [decodedTag]);

  // Reset to page 1 when tag changes
  useEffect(() => {
    setCurrentPage(1);
  }, [decodedTag]);

  const handleBack = () => {
    // Check if previous page was ReaderPage
    if (window.history.length > 1 && navigationIndexRef.current) {
      const previousState = location.state;
      // If coming from ReaderPage, go back twice
      if (previousState?.fromReader || document.referrer.includes("/read/")) {
        navigate(-2);
      } else {
        navigate(-1);
      }
    } else {
      navigate("/");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / comicsPerPage);
  const startIndex = (currentPage - 1) * comicsPerPage;
  const endIndex = startIndex + comicsPerPage;
  const currentComics = filtered.slice(startIndex, endIndex);

  return (
    <div>
      {/* Header dengan tombol kembali */}
      <div className="genre-page__header">
        <h1 className="genre-page__header-title">Genre: {decodedTag}</h1>
        <button onClick={handleBack} className="genre-page__back-button">
          <FiArrowLeft className="genre-page__back-icon" />
          Kembali
        </button>
      </div>

      <p className="genre-page__description">
        Menampilkan {filtered.length} komik dengan genre "{decodedTag}".
      </p>
      {isLoading ? (
        <div className="genre-page__loading">Loading...</div>
      ) : (
        <>
          <div className="genre-page__grid">
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
      {!isLoading && filtered.length === 0 && (
        <div className="genre-page__empty-state">
          <p className="genre-page__empty-text">
            Tidak ada komik dengan genre ini.
          </p>
          <Link to="/daftar-komik" className="genre-page__back-link">
            Kembali ke Daftar Komik
          </Link>
        </div>
      )}
    </div>
  );
}
