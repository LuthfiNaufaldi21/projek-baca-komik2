import { useState } from "react";
import { comics } from "../data/comics";
import ComicCard from "../components/ComicCard";
import Pagination from "../components/Pagination";

export default function ManhwaPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // 5 rows x 5 columns

  const filteredComics = comics.filter((comic) =>
    comic.tags?.includes("Manhwa")
  );

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
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Manhwa
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Koleksi Manhwa Korea ({filteredComics.length} komik)
      </p>

      {filteredComics.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
          Tidak ada manhwa saat ini.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
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
