import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../styles/HeroSlider.css";

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
    <div className="hero-slider">
      {comics.map((comic, index) => {
        const hoverTags = comic.tags
          .filter((t) => !["Warna", "Manga", "Manhwa", "Manhua"].includes(t))
          .slice(0, 3);

        return (
          <div
            key={comic.id}
            className={`hero-slider__slide ${
              index === currentSlide
                ? "hero-slider__slide--active"
                : "hero-slider__slide--inactive"
            }`}
          >
            {/* Background Image with Blur */}
            <div
              className="hero-slider__background"
              style={{ backgroundImage: `url('${comic.cover}')` }}
            >
              <div className="hero-slider__overlay"></div>
            </div>

            <div className="hero-slider__content-wrapper">
              <div className="hero-slider__content-layout">
                {/* Cover Image Card */}
                <div
                  className={`hero-slider__cover-wrapper ${
                    index === currentSlide
                      ? "hero-slider__cover-wrapper--visible"
                      : "hero-slider__cover-wrapper--hidden"
                  }`}
                >
                  <img
                    src={comic.cover}
                    alt={comic.title}
                    className="hero-slider__cover"
                  />
                </div>

                {/* Content */}
                <div
                  className={`hero-slider__text-content ${
                    index === currentSlide
                      ? "hero-slider__text-content--visible"
                      : "hero-slider__text-content--hidden"
                  }`}
                >
                  <div className="hero-slider__tags">
                    {hoverTags.map((tag, i) => (
                      <Link
                        key={i}
                        to={`/genre/${tag}`}
                        className="hero-slider__tag"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>

                  <h2 className="hero-slider__title">{comic.title}</h2>

                  <p className="hero-slider__synopsis">{comic.synopsis}</p>

                  <Link
                    to={`/detail/${comic.id}`}
                    className="hero-slider__cta-button"
                  >
                    <span>Baca Sekarang</span>
                    <FiArrowRight className="hero-slider__cta-icon" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Dots */}
      <div className="hero-slider__dots">
        {comics.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`hero-slider__dot ${
              index === currentSlide
                ? "hero-slider__dot--active"
                : "hero-slider__dot--inactive"
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
        className="hero-slider__nav-button hero-slider__nav-button--prev"
      >
        <FiChevronLeft className="hero-slider__nav-icon" />
      </button>
      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % comics.length)}
        className="hero-slider__nav-button hero-slider__nav-button--next"
      >
        <FiChevronRight className="hero-slider__nav-icon" />
      </button>
    </div>
  );
}
