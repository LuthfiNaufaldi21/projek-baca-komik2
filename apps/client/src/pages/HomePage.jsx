import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { comics as fallbackComics } from "../data/comics";
import { getPopularComics, getLatestComics } from "../services/comicService";
import ComicCard from "../components/ComicCard";
import HeroSlider from "../components/HeroSlider";
import "../styles/HomePage.css";

export default function HomePage() {
  const [featuredComics, setFeaturedComics] = useState(
    fallbackComics.slice(0, 5)
  );
  const [latestComics, setLatestComics] = useState(fallbackComics.slice(0, 10));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        setIsLoading(true);

        // Fetch popular comics for featured section
        const popular = await getPopularComics();
        if (popular && popular.length > 0) {
          // Map backend data to expected format
          const mappedPopular = popular.slice(0, 5).map((comic, index) => ({
            id: index + 1,
            title: comic.title || comic.name,
            image: comic.thumbnail || comic.image,
            rating: 4.5,
            slug: comic.slug || comic.apiDetailLink?.split("/").pop(),
          }));
          setFeaturedComics(mappedPopular);
        }

        // Fetch latest comics
        const latest = await getLatestComics();
        if (latest && latest.length > 0) {
          // Map backend data to expected format
          const mappedLatest = latest.slice(0, 10).map((comic, index) => ({
            id: index + 1,
            title: comic.title || comic.name,
            image: comic.thumbnail || comic.image,
            rating: 4.5,
            genre: comic.genre || "Fantasy",
            type: comic.type || "Manga",
            slug: comic.slug || comic.apiDetailLink?.split("/").pop(),
          }));
          setLatestComics(mappedLatest);
        }
      } catch (error) {
        console.error("Error fetching comics:", error);
        // Keep using fallback data
      } finally {
        setIsLoading(false);
      }
    };

    fetchComics();
  }, []);

  return (
    <div>
      <h2 className="home-page__title">Komik Populer</h2>

      {isLoading ? (
        <div className="home-page__loading">Loading...</div>
      ) : (
        <HeroSlider comics={featuredComics} />
      )}

      <h2 className="home-page__subtitle">Komik Terbaru</h2>
      <p className="home-page__description">
        Telusuri 10 komik terbaru yang tersedia di web kami.
      </p>
      <hr className="home-page__divider" />

      {isLoading ? (
        <div className="home-page__loading">Loading...</div>
      ) : (
        <div className="home-page__grid">
          {latestComics.map((comic) => (
            <ComicCard key={comic.id} comic={comic} />
          ))}
        </div>
      )}

      <div className="home-page__view-all-container">
        <Link to="/daftar-komik" className="home-page__view-all-link">
          Lihat Semua Komik
        </Link>
      </div>
    </div>
  );
}
