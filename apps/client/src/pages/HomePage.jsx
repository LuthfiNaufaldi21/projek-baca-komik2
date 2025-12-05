import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPopularComics, getLatestComics } from "../services/comicService";
import ComicCard from "../components/ComicCard";
import HeroSlider from "../components/HeroSlider";
import { FaSpinner } from "react-icons/fa";
import "../styles/HomePage.css";

export default function HomePage() {
  const [featuredComics, setFeaturedComics] = useState([]);
  const [latestComics, setLatestComics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        setIsLoading(true);

        // Fetch popular comics for featured section (local service)
        const popular = await getPopularComics();
        setFeaturedComics(popular.slice(0, 5));

        // Fetch latest comics
        const latest = await getLatestComics();
        setLatestComics(latest.slice(0, 10));
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
        <div className="home-page__loading">
          <FaSpinner className="home-page__loading-spinner" />
          <p>Memuat komik populer...</p>
        </div>
      ) : (
        <HeroSlider comics={featuredComics} />
      )}

      <h2 className="home-page__subtitle">Komik Terbaru</h2>
      <p className="home-page__description">
        Telusuri 10 komik terbaru yang tersedia di web kami.
      </p>
      <hr className="home-page__divider" />

      {isLoading ? (
        <div className="home-page__loading">
          <FaSpinner className="home-page__loading-spinner" />
          <p>Memuat komik terbaru...</p>
        </div>
      ) : (
        <div className="home-page__grid">
          {latestComics.map((comic) => (
            <ComicCard key={comic.slug || comic.id} comic={comic} />
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
