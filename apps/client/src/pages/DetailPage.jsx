import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getComicBySlug } from "../services/comicService";
import { get, deleteRequest } from "../services/api";
import { getReadChapters } from "../services/authService";
import { useToast } from "../hooks/useToast";
import ComicCard from "../components/ComicCard";
import EditComicModal from "../components/EditComicModal";
import ConfirmModal from "../components/ConfirmModal";

import {
  FaStar,
  FaUser,
  FaClock,
  FaBookmark,
  FaRegBookmark,
  FaSpinner,
  FaCheckCircle,
} from "react-icons/fa";
import {
  FiRefreshCw,
  FiArrowDown,
  FiArrowUp,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import "../styles/DetailPage.css";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    isBookmarked,
    addBookmark,
    removeBookmark,
    isLoggedIn,
    user, // Get user to access readHistory from database
  } = useAuth();

  const [isLoadingBookmark, setIsLoadingBookmark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [liveChapters, setLiveChapters] = useState([]);
  const [chapterError, setChapterError] = useState(false);
  const [readChapters, setReadChapters] = useState(new Set());
  const [relatedComics, setRelatedComics] = useState([]); // Related comics by genre
  const [sortOrder, setSortOrder] = useState("desc"); // 'desc' = terbaru ke lama, 'asc' = lama ke terbaru
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 100;

  const { showToast } = useToast();

  // Get last read chapter from DATABASE (user.readHistory)
  // readHistory = [{ id, comic_id, chapter_slug: "chapter-142", comic: {...} }]
  const lastReadChapter = user?.readHistory?.find(
    (h) => h.comic?.slug === id || String(h.comic?.id) === String(id)
  );
  const lastReadChapterSlug = lastReadChapter?.chapter_slug; // "chapter-142" or full URL

  // Load read chapters from DATABASE (not localStorage anymore!)
  useEffect(() => {
    if (isLoggedIn && id) {
      const loadReadChapters = async () => {
        try {
          const chapters = await getReadChapters(id);
          setReadChapters(new Set(chapters));
          console.log(
            `✅ [DetailPage] Loaded ${chapters.length} read chapters from database`
          );
        } catch (error) {
          console.error("❌ [DetailPage] Failed to load read chapters:", error);
        }
      };
      loadReadChapters();
    } else {
      // Clear read chapters if not logged in
      setReadChapters(new Set());
    }
  }, [id, isLoggedIn]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);

        // 1. Data lokal (fallback)
        const localData = await getComicBySlug(id);
        if (!mounted) return;

        // 2. Coba ambil chapter live dari backend
        try {
          const liveData = await get(`/detail-komik/${id}`);
          if (liveData?.chapters?.length > 0) {
            setLiveChapters(liveData.chapters);
            setChapterError(false);
          }
        } catch {
          console.log("Live chapters gagal → pakai data lokal");
          setChapterError(true);
        }

        setDetail(localData);

        // 3. Fetch related comics by same genre
        if (localData && localData.genres && localData.genres.length > 0) {
          try {
            const firstGenre = localData.genres[0];
            const genreName =
              typeof firstGenre === "object" ? firstGenre.name : firstGenre;
            const relatedData = await get(
              `/api/comics?genre=${encodeURIComponent(genreName)}&limit=6`
            );
            // Filter out current comic from related
            const filtered = (relatedData.data || []).filter(
              (c) => c.slug !== localData.slug && c.id !== localData.id
            );
            setRelatedComics(filtered.slice(0, 5)); // Show max 5 related comics
          } catch (error) {
            console.log("Failed to load related comics:", error);
          }
        }
      } catch {
        setDetail(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Defensive data - support both database and dummy format
  const cover =
    detail?.cover_url || detail?.cover || detail?.thumbnail || detail?.image;
  const title = detail?.title || "Untitled";
  const alternativeTitle =
    detail?.alternative_title || detail?.alternativeTitle || null;
  const author =
    detail?.author || detail?.info?.Pengarang || detail?.info?.Author || "-";
  const rating = detail?.rating || detail?.info?.Rating || "-";
  const status = detail?.status || "Update Tiap Minggu";

  // Database format: genres = [{id, name, slug}], Dummy: tags = ["Action"]
  const tags = detail?.genres
    ? detail.genres.map((g) => (typeof g === "object" ? g.name : g))
    : detail?.tags || [];

  const synopsis =
    detail?.synopsis ||
    detail?.sinopsis ||
    detail?.description ||
    "Sinopsis belum tersedia untuk komik ini.";

  const chapters =
    liveChapters.length > 0 ? liveChapters : detail?.chapters || [];

  // Sort chapters based on sortOrder
  const sortedChapters = [...chapters].sort((a, b) => {
    const numA = a.chapterNumber ?? a.id ?? 0;
    const numB = b.chapterNumber ?? b.id ?? 0;
    return sortOrder === "desc" ? numB - numA : numA - numB;
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedChapters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentChapters = sortedChapters.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setTimeout(() => {
        const listElement = document.querySelector(
          ".detail-page__chapters-header"
        );
        if (listElement) {
          listElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  // Helper for pagination ellipsis
  const getPaginationItems = () => {
    const rangeWithDots = [];
    const delta = 1; // Neighbors around current page
    const leftSide = 2; // Always show first X pages
    const rightSide = 2; // Always show last X pages

    const pages = new Set();

    // Add first pages
    for (let i = 1; i <= leftSide; i++) {
      if (i <= totalPages) pages.add(i);
    }

    // Add last pages
    for (let i = totalPages - rightSide + 1; i <= totalPages; i++) {
      if (i > 0) pages.add(i);
    }

    // Add current and neighbors
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 0 && i <= totalPages) pages.add(i);
    }

    const sortedPages = Array.from(pages).sort((a, b) => a - b);

    let l;
    for (let i of sortedPages) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  // Reset page on sort/id change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortOrder, id]);

  const bookmarkKey = detail?.slug || id;
  const bookmarked = isBookmarked(bookmarkKey);

  const handleBookmarkClick = async () => {
    if (!isLoggedIn) {
      showToast("Login dulu bro kalau mau bookmark!", "error");
      return;
    }
    setIsLoadingBookmark(true);
    try {
      if (bookmarked) {
        await removeBookmark(bookmarkKey);
        showToast("Dihapus dari bookmark", "info");
      } else {
        await addBookmark(bookmarkKey);
        showToast("Berhasil disimpan!", "success");
      }
    } catch {
      showToast("Gagal bookmark", "error");
    } finally {
      setIsLoadingBookmark(false);
    }
  };

  const handleReloadChapters = async () => {
    try {
      setChapterError(false);
      const liveData = await get(`/detail-komik/${id}`);
      if (liveData?.chapters?.length > 0) {
        setLiveChapters(liveData.chapters);
        showToast("Chapter berhasil dimuat!", "success");
      } else {
        setChapterError(true);
        showToast("Tidak ada chapter ditemukan", "error");
      }
    } catch {
      setChapterError(true);
      showToast("Gagal memuat chapter, coba lagi", "error");
    }
  };

  // Admin functions
  const handleEditComic = () => {
    setShowEditModal(true);
  };

  const handleDeleteComic = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteComic = async () => {
    setIsDeleting(true);
    try {
      await deleteRequest(`/api/comics/${detail.slug}`);
      showToast(`Komik "${detail.title}" berhasil dihapus!`, "success");
      setShowDeleteConfirm(false);
      // Redirect to comics list after successful delete
      navigate("/daftar-komik");
    } catch (error) {
      console.error("Error deleting comic:", error);
      showToast(
        error.message || "Gagal menghapus komik. Silakan coba lagi.",
        "error"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSuccess = async () => {
    // Refresh comic data
    try {
      const localData = await getComicBySlug(id);
      setDetail(localData);
      showToast("Data komik berhasil diperbarui!", "success");
    } catch (error) {
      console.error("Error refreshing comic data:", error);
    }
  };

  const markChapterAsRead = (chapterKey) => {
    if (!isLoggedIn) return;
    const newReadChapters = new Set(readChapters);
    newReadChapters.add(String(chapterKey));
    setReadChapters(newReadChapters);
    // Save to localStorage
    localStorage.setItem(
      `readChapters_${id}`,
      JSON.stringify(Array.from(newReadChapters))
    );
  };

  const isChapterRead = (chapter) => {
    const chapterKey = getChapterKey(chapter);
    return readChapters.has(String(chapterKey));
  };

  const getChapterKey = (chapter) => {
    if (chapter.apiLink) return chapter.apiLink;
    if (chapter.chapterNumber !== undefined)
      return `ch-${chapter.chapterNumber}`;
    return `idx-${chapters.indexOf(chapter)}`;
  };

  // Check if this chapter is the last read chapter from DATABASE
  const isLastReadChapter = (chapter) => {
    if (!lastReadChapterSlug) return false;

    const chapterKey = getChapterKey(chapter);

    // Extract chapter slug from various formats
    let chapterSlug = lastReadChapterSlug;
    if (chapterSlug.startsWith("/baca-chapter/")) {
      // Format: /baca-chapter/spy-x-family/chapter-5 → chapter-5
      const parts = chapterSlug.split("/");
      chapterSlug = parts[parts.length - 1];
    } else if (chapterSlug.startsWith("http")) {
      // Format: https://api.example.com/.../chapter-142 → chapter-142
      const match = chapterSlug.match(/chapter[-_]?(\d+)/i);
      chapterSlug = match ? `chapter-${match[1]}` : chapterSlug;
    }

    // Compare with chapter key
    return (
      String(chapterKey) === String(chapterSlug) ||
      String(chapterKey) === String(lastReadChapterSlug) ||
      chapterKey.includes(chapterSlug) ||
      chapterSlug.includes(chapterKey)
    );
  };

  if (loading)
    return (
      <div className="detail-page__loading">
        <div className="detail-page__loading-content">
          <FaSpinner className="detail-page__loading-spinner" />
          <p className="detail-page__loading-text">Memuat detail komik...</p>
        </div>
      </div>
    );

  if (!detail)
    return (
      <div className="detail-page__not-found">
        <h2 className="detail-page__not-found-title">
          404 - Komik Tidak Ditemukan
        </h2>
        <p className="detail-page__not-found-text">
          Maaf, komik yang Anda cari tidak ada di database kami.
        </p>
        <Link to="/daftar-komik" className="detail-page__not-found-button">
          Jelajahi Daftar Komik
        </Link>
      </div>
    );

  return (
    <div className="detail-page__container">
      <div className="detail-page__hero-banner">
        <div
          className="detail-page__hero-bg"
          style={{ backgroundImage: `url('${cover}')` }}
        ></div>
        <div className="detail-page__hero-overlay"></div>

        {/* Admin Actions - Only visible to admin */}
        {user?.role === "admin" && (
          <div className="detail-page__admin-actions">
            <button
              onClick={handleEditComic}
              className="detail-page__admin-button detail-page__admin-button--edit"
              title="Edit Komik"
            >
              <FiEdit2 className="detail-page__admin-icon" />
              <span className="detail-page__admin-text">Edit</span>
            </button>
            <button
              onClick={handleDeleteComic}
              className="detail-page__admin-button detail-page__admin-button--delete"
              title="Hapus Komik"
            >
              <FiTrash2 className="detail-page__admin-icon" />
              <span className="detail-page__admin-text">Hapus</span>
            </button>
          </div>
        )}
      </div>

      <div className="detail-page__content">
        <div className="detail-page__layout">
          <div className="detail-page__cover-container">
            <div className="detail-page__cover-wrapper">
              <img
                src={cover}
                alt={title}
                className="detail-page__cover-image"
              />
            </div>

            <button
              onClick={handleBookmarkClick}
              disabled={isLoadingBookmark}
              className={`detail-page__bookmark-button ${
                bookmarked
                  ? "detail-page__bookmark-button--saved"
                  : "detail-page__bookmark-button--unsaved"
              } ${
                isLoadingBookmark ? "detail-page__bookmark-button--loading" : ""
              }`}
            >
              {isLoadingBookmark ? (
                <>
                  <FaSpinner className="detail-page__icon detail-page__icon--spin" />
                  Loading...
                </>
              ) : bookmarked ? (
                <>
                  <FaBookmark className="detail-page__icon" />
                  Tersimpan
                </>
              ) : (
                <>
                  <FaRegBookmark className="detail-page__icon" />
                  Bookmark
                </>
              )}
            </button>
          </div>

          <div className="detail-page__info">
            <h1
              className={`detail-page__title ${
                alternativeTitle ? "detail-page__title--with-alt" : ""
              }`}
            >
              {title}
            </h1>
            {alternativeTitle && (
              <p className="detail-page__alternative-title">
                {alternativeTitle}
              </p>
            )}

            <div className="detail-page__meta">
              <div className="detail-page__rating-badge">
                <FaStar className="detail-page__icon" />
                <span className="detail-page__rating-value">{rating}</span>/10
              </div>
              <div className="detail-page__meta-item">
                <FaUser className="detail-page__icon detail-page__icon--mr" />
                <span>{author}</span>
              </div>
              <div className="detail-page__meta-item">
                <FaClock className="detail-page__icon detail-page__icon--mr" />
                <span>{status}</span>
              </div>
            </div>

            <div className="detail-page__tags">
              {tags.map((tag, i) => (
                <Link
                  to={`/genre/${encodeURIComponent(tag)}`}
                  key={i}
                  className="detail-page__tag"
                >
                  {tag}
                </Link>
              ))}
            </div>

            <div className="detail-page__synopsis-container">
              <h3 className="detail-page__synopsis-title">Sinopsis</h3>
              <p className="detail-page__synopsis-text">{synopsis}</p>
            </div>
          </div>
        </div>

        <div className="detail-page__chapters">
          <div className="detail-page__chapters-header">
            <h2 className="detail-page__chapters-title">Daftar Chapter</h2>
            <div className="detail-page__chapters-actions">
              {/* HANYA TAMPILKAN SORT JIKA ADA CHAPTER */}
              {sortedChapters.length > 0 && (
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
                  }
                  className="detail-page__sort-button"
                  title={
                    sortOrder === "desc"
                      ? "Urutkan dari Chapter Lama ke Baru"
                      : "Urutkan dari Chapter Baru ke Lama"
                  }
                >
                  {sortOrder === "desc" ? (
                    <>
                      <FiArrowDown className="detail-page__sort-icon" />
                      Terbaru
                    </>
                  ) : (
                    <>
                      <FiArrowUp className="detail-page__sort-icon" />
                      Terlama
                    </>
                  )}
                </button>
              )}

              {/* TOMBOL RELOAD */}
              {chapterError && liveChapters.length === 0 && (
                <button
                  onClick={handleReloadChapters}
                  className="detail-page__reload-button"
                  title="Muat ulang chapter"
                >
                  <FiRefreshCw className="detail-page__reload-icon" />
                  Muat Ulang
                </button>
              )}
            </div>
          </div>

          {chapterError &&
          liveChapters.length === 0 &&
          chapters.length === 0 ? (
            <div className="detail-page__chapter-error">
              <p>Gagal memuat daftar chapter. Silakan coba lagi.</p>
            </div>
          ) : currentChapters.length > 0 ? (
            <>
              <div className="detail-page__chapters-list">
                {currentChapters.map((chapter, idx) => {
                  const chapterNumber =
                    chapter.chapterNumber ?? chapter.id ?? idx + 1;
                  const chapterTitle =
                    chapter.title || `Chapter ${chapterNumber}`;
                  const urlParam = chapter.apiLink
                    ? encodeURIComponent(chapter.apiLink)
                    : chapterNumber;

                  const isLastRead = isLastReadChapter(chapter);
                  const isRead = isChapterRead(chapter);
                  const chapterKey = getChapterKey(chapter);

                  return (
                    <Link
                      key={idx}
                      to={`/read/${detail.slug || id}/${urlParam}`}
                      onClick={() => markChapterAsRead(chapterKey)}
                      className={`detail-page__chapter-link ${
                        isLastRead ? "detail-page__chapter-link--read" : ""
                      } ${
                        isRead && !isLastRead
                          ? "detail-page__chapter-link--completed"
                          : ""
                      }`}
                    >
                      <span className="detail-page__chapter-title">
                        {isRead && !isLastRead && (
                          <FaCheckCircle className="detail-page__chapter-check-icon" />
                        )}
                        {chapterTitle}
                      </span>

                      {isLastRead && (
                        <span className="detail-page__chapter-badge">
                          Terakhir Dibaca
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="detail-page__pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="detail-page__pagination-btn"
                  >
                    <FiChevronLeft /> Prev
                  </button>

                  {getPaginationItems().map((item, index) =>
                    item === "..." ? (
                      <span
                        key={`dots-${index}`}
                        className="detail-page__pagination-dots"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => handlePageChange(item)}
                        className={`detail-page__pagination-btn ${
                          currentPage === item ? "active" : ""
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="detail-page__pagination-btn"
                  >
                    Next <FiChevronRight />
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="detail-page__no-chapters">
              Belum ada chapter tersedia untuk saat ini.
            </p>
          )}
        </div>

        {relatedComics.length > 0 && (
          <div className="detail-page__related">
            <h3 className="detail-page__related-title">Komik Sejenis</h3>
            <div className="detail-page__related-grid">
              {relatedComics.map((related) => (
                <ComicCard key={related.slug || related.id} comic={related} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditComicModal
          comic={detail}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => !isDeleting && setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteComic}
        title="Hapus Komik"
        message={`⚠️ PERINGATAN! Apakah Anda yakin ingin menghapus komik "${detail?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus Komik"
        cancelText="Batal"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
