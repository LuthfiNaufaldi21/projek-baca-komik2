import { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";
import "../styles/BackToTop.css";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`back-to-top ${
        isVisible ? "back-to-top--visible" : "back-to-top--hidden"
      }`}
      title="Kembali ke atas"
      aria-label="Back to top"
    >
      <FiArrowUp className="back-to-top__icon" />
    </button>
  );
}
