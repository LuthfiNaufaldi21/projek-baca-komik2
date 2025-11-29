import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getChapterImages, getComicBySlug } from "../services/comicService";
import { get } from "../services/api";
import "../styles/ReaderPage.css";

export default function ReaderPage() {
  const { comicId, chapterId } = useParams();
  const navigate = useNavigate();
  const { updateReadingHistory } = useAuth();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [detail, setDetail] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(null);
  const [prevChapter, setPrevChapter] = useState(null);
  const [nextChapter, setNextChapter] = useState(null);

  let decodedChapterId = chapterId;
  try {
    decodedChapterId = decodeURIComponent(chapterId);
  } catch {}

  // Load detail komik + daftar chapter
  useEffect(() => {
    let mounted = true;
    const loadDetail = async () => {
      try {
        const localData = await getComicBySlug(comicId);
        if (!mounted) return;

        setDetail(localData);

        let chapters = Array.isArray(localData?.chapters)
          ? localData.chapters
          : [];

        try {
          const liveData = await get(`/detail-komik/${comicId}`);
          if (
            liveData &&
            Array.isArray(liveData.chapters) &&
            liveData.chapters.length > 0
          ) {
            chapters = liveData.chapters;
          }
        } catch {}

        let idx = -1;
        if (decodedChapterId.startsWith("/") || decodedChapterId.startsWith("http")) {
          idx = chapters.findIndex((ch) => ch.apiLink === decodedChapterId);
        } else {
          idx = chapters.findIndex(
            (ch) => String(ch.chapterNumber) === String(decodedChapterId)
          );
        }

        const cur = idx >= 0 ? chapters[idx] : null;
        setCurrentChapter(cur);

        setNextChapter(idx > 0 ? chapters[idx - 1] : null);
        setPrevChapter(
          idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null
        );
      } catch {
        setDetail(null);
      } finally {
        if (mounted) setLoadingDetail(false);
      }
    };

    loadDetail();
    return () => (mounted = false);
  }, [comicId, decodedChapterId]);

  // Load gambar
  useEffect(() => {
    let mounted = true;
    const loadImages = async () => {
      try {
        setLoading(true);
        window.scrollTo({ top: 0, behavior: "instant" });

        const data = await getChapterImages(comicId, decodedChapterId);
        if (!mounted) return;

        const normalized = (Array.isArray(data?.images) ? data.images : [])
          .map((it) =>
            typeof it === "string"
              ? { src: it, fallbackSrc: it }
              : {
                  src: it?.src || it?.url || "",
                  fallbackSrc: it?.fallbackSrc || it?.src || it?.url || "",
                  alt: it?.alt || "",
                }
          )
          .filter((it) => it.src);

        setImages(normalized);
      } catch {
        setImages([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadImages();
    return () => (mounted = false);
  }, [comicId, decodedChapterId]);

  useEffect(() => {
    if (comicId && decodedChapterId) {
      updateReadingHistory(comicId, decodedChapterId);
    }
  }, [comicId, decodedChapterId]);

  const handleNavigate = (targetChapter) => {
    const linkParam = targetChapter.apiLink
      ? encodeURIComponent(targetChapter.apiLink)
      : targetChapter.chapterNumber;

    navigate(`/read/${comicId}/${linkParam}`);
  };

  if (loading || loadingDetail) {
    return (
      <div className="reader-loading">
        <div className="spinner"></div>
        <p>Memuat Chapter...</p>
      </div>
    );
  }

  if (!currentChapter || images.length === 0) {
    return (
      <div className="reader-error">
        <h2>Chapter tidak ditemukan</h2>
        <Link to="/" className="reader-btn-back">Kembali ke Home</Link>
      </div>
    );
  }

  return (
    <div className="reader-page">

      {/* === JUDUL DI ATAS, TENGAH === */}
      <div className="reader-title-center">
        <h1>{detail?.title || comicId}</h1>
        <p>{currentChapter.title}</p>
      </div>

      {/* === AREA KOMIK === */}
      <main className="reader-content">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.src}
            alt={img.alt || `Page ${index + 1}`}
            className="reader-image"
            loading="lazy"
            onError={(e) => {
              if (img.fallbackSrc && e.currentTarget.src !== img.fallbackSrc) {
                e.currentTarget.src = img.fallbackSrc;
              }
            }}
          />
        ))}
      </main>

      {/* === NAVIGASI BAWAH === */}
      <footer className="reader-footer">
        <div className="reader-nav-buttons">
          <button
            onClick={() => prevChapter && handleNavigate(prevChapter)}
            disabled={!prevChapter}
            className="reader-nav-btn"
          >
            ← Prev Chapter
          </button>

          <button
            onClick={() => nextChapter && handleNavigate(nextChapter)}
            disabled={!nextChapter}
            className="reader-nav-btn"
          >
            Next Chapter →
          </button>
        </div>
      </footer>
    </div>
  );
}
