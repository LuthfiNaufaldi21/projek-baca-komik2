import { Link } from "react-router-dom";
import { comics } from "../data/comics";
import ComicCard from "../components/ComicCard";
import HeroSlider from "../components/HeroSlider";
import "../styles/HomePage.css";

export default function HomePage() {
  const featuredComics = comics.slice(0, 5);
  const latestComics = comics.slice(0, 10);

  return (
    <div>
      <h2 className="home-page__title">Komik Populer</h2>

      <HeroSlider comics={featuredComics} />

      <h2 className="home-page__subtitle">Komik Terbaru</h2>
      <p className="home-page__description">
        Telusuri 10 komik terbaru yang tersedia di web kami.
      </p>
      <hr className="home-page__divider" />

      <div className="home-page__grid">
        {latestComics.map((comic) => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
      </div>

      <div className="home-page__view-all-container">
        <Link to="/daftar-komik" className="home-page__view-all-link">
          Lihat Semua Komik
        </Link>
      </div>
    </div>
  );
}
