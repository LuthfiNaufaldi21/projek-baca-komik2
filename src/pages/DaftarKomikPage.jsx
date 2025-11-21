import { useState } from "react";
import { comics } from "../data/comics";
import ComicCard from "../components/ComicCard";
import Pagination from "../components/Pagination";
import "../styles/DaftarKomikPage.css";

export default function DaftarKomikPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(comics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComics = comics.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <h1 className="daftar-komik__title">Daftar Semua Komik</h1>
      <p className="daftar-komik__description">
        Koleksi lengkap komik kami ({comics.length} komik)
      </p>

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
    </div>
  );
}
