import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { FiX, FiBookmark, FiImage, FiFileText } from "react-icons/fi";
import { useToast } from "../hooks/useToast";
import "../styles/Modal.css";

const genreOptions = [
  { value: "action", label: "Action" },
  { value: "adventure", label: "Adventure" },
  { value: "comedy", label: "Comedy" },
  { value: "dark-fantasy", label: "Dark Fantasy" },
  { value: "fantasy", label: "Fantasy" },
  { value: "horror", label: "Horror" },
  { value: "isekai", label: "Isekai" },
  { value: "martial-arts", label: "Martial Arts" },
  { value: "post-apocalyptic", label: "Post-apocalyptic" },
  { value: "psychological", label: "Psychological" },
  { value: "romance", label: "Romance" },
  { value: "slice-of-life", label: "Slice of Life" },
  { value: "superhero", label: "Superhero" },
  { value: "supernatural", label: "Supernatural" },
  { value: "thriller", label: "Thriller" },
  { value: "historical", label: "Historical" },
  { value: "apocalypse", label: "Apocalypse" },
  { value: "warna", label: "Warna" },
];

const typeOptions = [
  { value: "Manga", label: "Manga" },
  { value: "Manhwa", label: "Manhwa" },
  { value: "Manhua", label: "Manhua" },
];

const statusOptions = [
  { value: "Ongoing", label: "Ongoing" },
  { value: "Tamat", label: "Tamat" },
  { value: "Update Tiap Minggu", label: "Update Tiap Minggu" },
  { value: "Update Tiap 2 Minggu", label: "Update Tiap 2 Minggu" },
  { value: "Update Tiap Bulan", label: "Update Tiap Bulan" },
  { value: "Update Tidak Tentu", label: "Update Tidak Tentu" },
];

export default function AddComicModal({ onClose, onSuccess }) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    alternative_title: "",
    author: "",
    status: "Ongoing",
    cover_url: "",
    synopsis: "",
    rating: "",
    type: "Manga",
    genres: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleGenreToggle = (genreSlug) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genreSlug)
        ? prev.genres.filter((g) => g !== genreSlug)
        : [...prev.genres, genreSlug],
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug wajib diisi";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Judul wajib diisi";
    }

    if (
      formData.rating &&
      (isNaN(formData.rating) || formData.rating < 0 || formData.rating > 10)
    ) {
      newErrors.rating = "Rating harus antara 0-10";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";
      const token = localStorage.getItem("komikita-token");

      const submitData = {
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : 0,
      };

      const response = await fetch(`${API_BASE_URL}/api/comics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || "Gagal membuat komik");
      }

      const data = await response.json();
      showToast("Komik berhasil ditambahkan!", "success");
      onSuccess(data.comic);
      onClose();
    } catch (err) {
      console.error("Error creating comic:", err);
      setErrors({
        general: err.message || "Gagal membuat komik. Silakan coba lagi.",
      });
      showToast(err.message || "Gagal membuat komik", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-content--wide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Tambah Komik Baru</h2>
          <button onClick={onClose} className="modal-close">
            <FiX />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {errors.general && (
            <div className="modal-error-banner">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className="modal-form">
            {/* Slug */}
            <div className="modal-field">
              <label className="modal-label">
                <FiBookmark className="modal-label-icon" />
                Slug (URL-friendly ID) *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className={`modal-input ${
                  errors.slug ? "modal-input--error" : ""
                }`}
                placeholder="contoh: one-piece"
                disabled={isLoading}
              />
              {errors.slug && <p className="modal-error">{errors.slug}</p>}
              <p className="modal-hint">
                Harus unik, tanpa spasi, gunakan tanda hubung (-)
              </p>
            </div>

            {/* Title */}
            <div className="modal-field">
              <label className="modal-label">
                <FiFileText className="modal-label-icon" />
                Judul *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`modal-input ${
                  errors.title ? "modal-input--error" : ""
                }`}
                placeholder="Judul komik"
                disabled={isLoading}
              />
              {errors.title && <p className="modal-error">{errors.title}</p>}
            </div>

            {/* Alternative Title */}
            <div className="modal-field">
              <label className="modal-label">Judul Alternatif</label>
              <input
                type="text"
                name="alternative_title"
                value={formData.alternative_title}
                onChange={handleChange}
                className="modal-input"
                placeholder="Judul alternatif (opsional)"
                disabled={isLoading}
              />
            </div>

            {/* Author */}
            <div className="modal-field">
              <label className="modal-label">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="modal-input"
                placeholder="Nama author"
                disabled={isLoading}
              />
            </div>

            {/* Type & Status */}
            <div className="modal-field-group">
              <div className="modal-field">
                <label className="modal-label">Tipe</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="modal-select"
                  disabled={isLoading}
                >
                  {typeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-field">
                <label className="modal-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="modal-select"
                  disabled={isLoading}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cover URL */}
            <div className="modal-field">
              <label className="modal-label">
                <FiImage className="modal-label-icon" />
                Cover URL
              </label>
              <input
                type="url"
                name="cover_url"
                value={formData.cover_url}
                onChange={handleChange}
                className="modal-input"
                placeholder="https://example.com/cover.jpg"
                disabled={isLoading}
              />
            </div>

            {/* Rating */}
            <div className="modal-field">
              <label className="modal-label">Rating (0-10)</label>
              <input
                type="number"
                name="rating"
                step="0.1"
                min="0"
                max="10"
                value={formData.rating}
                onChange={handleChange}
                className={`modal-input ${
                  errors.rating ? "modal-input--error" : ""
                }`}
                placeholder="9.5"
                disabled={isLoading}
              />
              {errors.rating && <p className="modal-error">{errors.rating}</p>}
            </div>

            {/* Synopsis */}
            <div className="modal-field">
              <label className="modal-label">Sinopsis</label>
              <textarea
                name="synopsis"
                value={formData.synopsis}
                onChange={handleChange}
                className="modal-textarea"
                placeholder="Deskripsi singkat tentang komik..."
                rows="4"
                disabled={isLoading}
              />
            </div>

            {/* Genres */}
            <div className="modal-field">
              <label className="modal-label">Genre</label>
              <div className="genre-grid">
                {genreOptions.map((genre) => (
                  <button
                    key={genre.value}
                    type="button"
                    onClick={() => handleGenreToggle(genre.value)}
                    className={`genre-chip ${
                      formData.genres.includes(genre.value)
                        ? "genre-chip--active"
                        : ""
                    }`}
                    disabled={isLoading}
                  >
                    {genre.label}
                  </button>
                ))}
              </div>
              <p className="modal-hint">Pilih satu atau lebih genre</p>
            </div>

            {/* Actions */}
            <div className="modal-actions">
              <button
                type="button"
                onClick={onClose}
                className="modal-button modal-button--cancel"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="modal-button modal-button--save"
                disabled={isLoading}
              >
                {isLoading ? "Menyimpan..." : "Tambah Komik"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
