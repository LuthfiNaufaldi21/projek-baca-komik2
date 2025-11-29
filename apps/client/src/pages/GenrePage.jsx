import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getComicsByGenre } from "../services/comicService";
import ComicCard from "../components/ComicCard";
import "../styles/GenrePage.css";

export default function GenrePage() {
  const { tag } = useParams();
  const decodedTag = decodeURIComponent(tag);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div>
      <h1 className="genre-page__title">Genre: {decodedTag}</h1>
      <p className="genre-page__description">
        Menampilkan {filtered.length} komik dengan genre "{decodedTag}".
      </p>
      {isLoading ? (
        <div className="genre-page__loading">Loading...</div>
      ) : (
        <div className="genre-page__grid">
          {filtered.map((comic) => (
            <ComicCard key={comic.id} comic={comic} />
          ))}
        </div>
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
