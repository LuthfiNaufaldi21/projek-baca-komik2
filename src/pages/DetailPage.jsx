import { useParams, Link } from "react-router-dom";
import { comics } from "../data/comics";
import { useAuth } from "../context/AuthContext";

export default function DetailPage() {
  const { id } = useParams();
  const { isBookmarked, addBookmark, removeBookmark, isLoggedIn } = useAuth();

  const comic = comics.find((c) => c.id === id);

  if (!comic) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-red-600 mb-4">
          🚨 404 - Komik Tidak Ditemukan
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Maaf, komik yang Anda cari tidak ada.
        </p>
        <Link to="/" className="text-primary hover:underline">
          Kembali ke Home
        </Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(comic.id);

  const handleBookmarkClick = () => {
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk menambahkan bookmark");
      return;
    }
    if (bookmarked) {
      removeBookmark(comic.id);
    } else {
      addBookmark(comic.id);
    }
  };

  return (
    <div className="animate-fade-in pb-12">
      {/* Hero Banner Background */}
      <div className="relative w-full max-w-7xl mx-auto mt-6 h-[400px] overflow-hidden rounded-3xl shadow-2xl mb-[-150px] border border-gray-100 dark:border-gray-800 group">
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-50 transition-transform duration-1000 group-hover:scale-125"
          style={{ backgroundImage: `url('${comic.cover}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-white/90 dark:to-gray-900/90"></div>
      </div>

      <div className="relative z-10 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Cover Image */}
          <div className="md:w-1/3 lg:w-1/4 flex-shrink-0 mx-auto md:mx-0 w-2/3">
            <div className="rounded-2xl shadow-2xl overflow-hidden border-4 border-white dark:border-gray-700 transform hover:scale-105 transition-transform duration-300 aspect-[3/4] relative z-20">
              <img
                src={comic.cover}
                alt={comic.title}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleBookmarkClick}
              className={`w-full mt-6 py-3 px-6 rounded-full font-bold shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 relative z-20 ${
                bookmarked
                  ? "bg-red-500 hover:bg-red-600 text-white ring-2 ring-red-200 dark:ring-red-900"
                  : "bg-blue-600 hover:bg-blue-700 text-white ring-2 ring-blue-200 dark:ring-blue-900"
              }`}
            >
              {bookmarked ? (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Tersimpan
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Bookmark
                </>
              )}
            </button>
          </div>

          {/* Comic Details */}
          <div className="md:w-2/3 lg:w-3/4 pt-16 md:pt-32">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight drop-shadow-sm">
              {comic.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm md:text-base">
              <div className="flex items-center px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700">
                <svg
                  className="w-5 h-5 mr-1.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold">{comic.rating}</span>
                <span className="opacity-75 ml-1">/ 10</span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-300 font-medium">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{comic.author}</span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-300 font-medium">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Update Tiap Minggu</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {comic.tags?.map((tag, index) => (
                <Link
                  to={`/genre/${encodeURIComponent(tag)}`}
                  key={index}
                  className="px-4 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full text-sm font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 shadow-sm"
                >
                  {tag}
                </Link>
              ))}
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Sinopsis
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {comic.synopsis}
              </p>
            </div>
          </div>
        </div>

        {/* Chapters Section */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Daftar Chapter
          </h2>
          {comic.chapters && comic.chapters.length > 0 ? (
            <div className="space-y-2">
              {comic.chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  to={`/read/${comic.id}/${chapter.id}`}
                  className="block p-3 bg-gray-100 dark:bg-gray-600 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-md transition-colors"
                >
                  <span className="text-gray-800 dark:text-gray-100">
                    {chapter.title}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Belum ada chapter tersedia.</p>
          )}
        </div>
      </div>
    </div>
  );
}
