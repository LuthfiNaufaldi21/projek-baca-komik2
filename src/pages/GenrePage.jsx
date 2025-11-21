import { useParams, Link } from "react-router-dom";
import { comics } from "../data/comics";
import ComicCard from "../components/ComicCard";

export default function GenrePage() {
  const { tag } = useParams();
  const decodedTag = decodeURIComponent(tag);
  const filtered = comics.filter((c) => c.tags?.includes(decodedTag));

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
        Genre: {decodedTag}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Menampilkan {filtered.length} komik dengan genre "{decodedTag}".
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {filtered.map((comic) => (
          <ComicCard key={comic.id} comic={comic} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="mt-8 p-6 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Tidak ada komik dengan genre ini.
          </p>
          <Link
            to="/daftar-komik"
            className="inline-block px-5 py-2 bg-primary text-white rounded-md hover:bg-primary-hover"
          >
            Kembali ke Daftar Komik
          </Link>
        </div>
      )}
    </div>
  );
}
