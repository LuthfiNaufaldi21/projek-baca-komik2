import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ComicCard({ comic }) {
  const { isBookmarked, addBookmark, removeBookmark, isLoggedIn } = useAuth();
  const bookmarked = isBookmarked(comic.id);

  const handleBookmarkClick = (e) => {
    e.preventDefault();
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
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100 dark:border-gray-700">
      <Link to={`/detail/${comic.id}`} className="block">
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-200 dark:bg-gray-700">
          {/* Blurred Background Effect */}
          <div
            className="absolute inset-0 bg-cover bg-center blur-xl opacity-50 scale-110 transition-transform duration-500 group-hover:scale-125"
            style={{ backgroundImage: `url('${comic.cover}')` }}
          ></div>

          {/* Main Image */}
          <div className="absolute inset-0 flex items-center justify-center p-2 z-10">
            <img
              src={comic.cover}
              alt={comic.title}
              className="max-h-full max-w-full object-contain drop-shadow-lg rounded-sm transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* Bookmark Button */}
          <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleBookmarkClick}
              className={`p-2 rounded-full shadow-lg ${
                bookmarked
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:text-primary"
              } transform hover:scale-110 transition-all duration-200`}
              title={bookmarked ? "Hapus Bookmark" : "Tambah Bookmark"}
            >
              <svg
                className="w-5 h-5"
                fill={bookmarked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          </div>

          {/* Always visible bookmark indicator if bookmarked */}
          {bookmarked && (
            <div className="absolute top-0 left-2 z-20">
              <div className="w-6 h-8 bg-primary flex items-end justify-center pb-1 shadow-md">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {comic.title}
          </h3>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></span>
            {comic.author}
          </p>

          {comic.tags && comic.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 h-12 overflow-hidden content-start">
              {comic.tags.slice(0, 3).map((tag, index) => (
                <Link
                  to={`/genre/${encodeURIComponent(tag)}`}
                  key={index}
                  className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-sm hover:bg-primary hover:text-white transition-colors"
                >
                  {tag}
                </Link>
              ))}
              {comic.tags.length > 3 && (
                <span className="px-2 py-0.5 text-[10px] text-gray-400">
                  + {comic.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 text-yellow-400 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                {comic.rating}
              </span>
            </div>
            <span className="text-xs text-primary font-medium hover:underline">
              Baca Sekarang →
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
