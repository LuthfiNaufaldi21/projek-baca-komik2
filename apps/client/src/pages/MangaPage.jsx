import { useState, useEffect } from "react";
import { getComicsByType } from "../services/comicService";
import ComicCard from "../components/ComicCard";
import Pagination from "../components/Pagination";
import "../styles/CategoryPage.css";

export default function MangaPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredComics, setFilteredComics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchComics = async () => {
      try {
        setIsLoading(true);
        const data = await getComicsByType("manga");
        setFilteredComics(data);
      } catch (error) {
        console.error("Error fetching manga:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComics();
  }, []);

  const totalPages = Math.ceil(filteredComics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComics = filteredComics.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <h1 className="category-page__title">Manga</h1>
      <p className="category-page__description">
        Koleksi Manga Jepang ({filteredComics.length} komik)
      </p>

      {isLoading ? (
        <div className="category-page__loading">Loading...</div>
      ) : filteredComics.length === 0 ? (
        <p className="category-page__empty">Tidak ada manga saat ini.</p>
      ) : (
        <>
          <div className="category-page__grid">
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
