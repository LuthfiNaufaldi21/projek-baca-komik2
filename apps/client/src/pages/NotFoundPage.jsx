import { Link } from "react-router-dom";
import { FiHome, FiAlertCircle } from "react-icons/fi";
import "../styles/NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-page__content">
        <div className="not-found-page__icon-wrapper">
          <FiAlertCircle className="not-found-page__icon" />
        </div>

        <h1 className="not-found-page__title">404</h1>
        <h2 className="not-found-page__subtitle">Halaman Tidak Ditemukan</h2>
        <p className="not-found-page__description">
          Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>

        <Link to="/" className="not-found-page__button">
          <FiHome className="not-found-page__button-icon" />
          Kembali ke Beranda
        </Link>
      </div>

      {/* Decorative elements */}
      <div className="not-found-page__bg-blob not-found-page__bg-blob--1"></div>
      <div className="not-found-page__bg-blob not-found-page__bg-blob--2"></div>
    </div>
  );
}
