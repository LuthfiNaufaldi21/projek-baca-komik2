import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { comics } from "../data/comics";
import ComicCard from "../components/ComicCard";
import Pagination from "../components/Pagination";
import "../styles/SearchPage.css";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- SOLUSI ERROR ESLINT ---
  // Kita simpan query terakhir yang kita lihat
  const [lastQuery, setLastQuery] = useState(query);

  // Cek saat render: Jika query URL beda dengan yang tersimpan
  if (query !== lastQuery) {
    setLastQuery(query); // Update query tersimpan
    setCurrentPage(1); // Reset halaman langsung (tanpa nunggu useEffect)
  }
  // ---------------------------

  // useEffect sekarang hanya untuk Scroll, bukan reset state
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [query, currentPage]); // Jalan saat query ganti atau pindah hal

  // --- LOGIC FILTERING ---
  const searchResults = comics.filter((comic) => {
    const searchLower = query.toLowerCase();

    // Validasi Tags (Anti Crash jika tags undefined)
    const hasTagMatch =
      Array.isArray(comic.tags) &&
      comic.tags.some((tag) => tag.toLowerCase().includes(searchLower));

    return (
      comic.title.toLowerCase().includes(searchLower) ||
      comic.author.toLowerCase().includes(searchLower) ||
      (comic.synopsis && comic.synopsis.toLowerCase().includes(searchLower)) ||
      hasTagMatch
    );
  });

  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentComics = searchResults.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <h1 className="search-page__title">Hasil Pencarian untuk "{query}"</h1>
      <p className="search-page__results-count">
        Ditemukan {searchResults.length} komik
      </p>

      {searchResults.length === 0 ? (
        <div className="search-page__empty-state">
          <p className="search-page__empty-text">
            Tidak ada hasil yang ditemukan untuk "{query}"
          </p>
          <p className="search-page__empty-hint">
            Coba gunakan kata kunci lain
          </p>
        </div>
      ) : (
        <>
          <div className="search-page__grid">
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