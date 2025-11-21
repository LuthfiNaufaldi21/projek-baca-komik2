import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function HeroSlider({ comics }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % comics.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [comics.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto h-[300px] md:h-[450px] rounded-2xl overflow-hidden shadow-2xl mb-10 group">
      {comics.map((comic, index) => {
        const hoverTags = comic.tags
          .filter((t) => !["Warna", "Manga", "Manhwa", "Manhua"].includes(t))
          .slice(0, 3);

        return (
          <div
            key={comic.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            {/* Background Image with Blur */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${comic.cover}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
            </div>

            <div className="relative h-full flex items-center px-6 md:px-16">
              <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                {/* Cover Image Card */}
                <div
                  className={`hidden md:block flex-shrink-0 transform transition-all duration-700 delay-100 ${
                    index === currentSlide
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-10 opacity-0"
                  }`}
                >
                  <img
                    src={comic.cover}
                    alt={comic.title}
                    className="w-[200px] h-[300px] object-cover rounded-lg shadow-2xl border-2 border-white/20 rotate-[-3deg] hover:rotate-0 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div
                  className={`flex-1 text-white transform transition-all duration-700 delay-200 ${
                    index === currentSlide
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hoverTags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-primary/80 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider shadow-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight drop-shadow-lg line-clamp-2">
                    {comic.title}
                  </h2>

                  <p className="text-gray-200 text-sm md:text-base mb-8 line-clamp-3 max-w-2xl leading-relaxed opacity-90">
                    {comic.synopsis}
                  </p>

                  <Link
                    to={`/detail/${comic.id}`}
                    className="inline-flex items-center px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg group-hover:shadow-primary/50"
                  >
                    <span>Baca Sekarang</span>
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {comics.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-primary"
                : "w-2 bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Arrow Navigation */}
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev - 1 + comics.length) % comics.length)
        }
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % comics.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}
