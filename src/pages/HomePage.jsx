import { useState } from "react";
import { Link } from "react-router-dom";
import { comics } from "../data/comics";
import ComicCard from "../components/ComicCard";
import HeroSlider from "../components/HeroSlider";

export default function HomePage() {
  const featuredComics = comics.slice(0, 5);
  const latestComics = comics.slice(0, 25); // show 5 rows x 5 columns

  return (
    <div>
      <h2 className="text-3xl font-bold font-serif text-gray-800 dark:text-gray-100 mb-6 border-l-4 border-primary pl-4">
        Komik Populer
      </h2>

      <HeroSlider comics={featuredComics} />

      <h2 className="text-3xl font-bold font-serif text-gray-800 dark:text-gray-100 mb-2 mt-12 border-l-4 border-primary pl-4">
        Komik Terbaru
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Telusuri 10 komik terbaru yang tersedia di web kami.
      </p>
      <hr className="mb-4 border-gray-200 dark:border-gray-700" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {latestComics.map((comic) => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
      </div>

      <div className="text-center mt-6">
        <Link
          to="/daftar-komik"
          className="inline-block px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-hover transition-colors duration-200"
        >
          Lihat Semua Komik
        </Link>
      </div>
    </div>
  );
}
