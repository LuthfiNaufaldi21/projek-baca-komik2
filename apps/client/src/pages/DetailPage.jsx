import { useParams, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getComicBySlug } from "../services/comicService";
import { get } from "../services/api";
import { useToast } from "../hooks/useToast"; 
import { comics as localComicsData } from "../data/comics"; 
import ComicCard from "../components/ComicCard"; 
import "../styles/DetailPage.css";

export default function DetailPage() {
  const { id } = useParams();
  const { isBookmarked, addBookmark, removeBookmark, isLoggedIn, getReadingHistory } = useAuth();
  const [isLoadingBookmark, setIsLoadingBookmark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [liveChapters, setLiveChapters] = useState([]);
  
  const { showToast } = useToast();
  const readingHistory = getReadingHistory();
  const lastReadChapterId = readingHistory[id];

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const localData = await getComicBySlug(id);
        if (!mounted) return;
        try {
          const liveData = await get(`/detail-komik/${id}`);
          if (liveData && liveData.chapters) setLiveChapters(liveData.chapters);
        } catch (err) { console.log("Using local chapters"); }
        setDetail(localData);
      } catch (e) { setDetail(null); } 
      finally { if (mounted) setLoading(false); }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  const relatedComics = detail
    ? localComicsData
        .filter((c) => c.id !== detail.id && c.tags?.some((tag) => detail.tags?.includes(tag)))
        .slice(0, 5)
    : [];

  if (!loading && !detail) return <div className="detail-page__not-found"><h2>404</h2><Link to="/">Home</Link></div>;

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
    } catch (error) {
      showToast("Gagal bookmark", "error");
    } finally {
      setIsLoadingBookmark(false);
    }
  };

  if (loading) return <div className="detail-page__not-found"><p>Memuat...</p></div>;

  const cover = detail?.cover || detail?.image;
  const chapters = liveChapters.length > 0 ? liveChapters : (detail?.chapters || []);

  return (
    <div className="detail-page__container">
      {/* Breadcrumbs dihapus agar tidak perlu file baru */}
      
      <div className="detail-page__hero-banner">
        <div className="detail-page__hero-bg" style={{ backgroundImage: `url('${cover}')` }}></div>
        <div className="detail-page__hero-overlay"></div>
      </div>

      <div className="detail-page__content">
        <div className="detail-page__layout">
          <div className="detail-page__cover-container">
            <div className="detail-page__cover-wrapper"><img src={cover} alt={detail.title} className="detail-page__cover-image" /></div>
            <button onClick={handleBookmarkClick} disabled={isLoadingBookmark} className={`detail-page__bookmark-button ${bookmarked ? "detail-page__bookmark-button--saved" : "detail-page__bookmark-button--unsaved"}`}>
              {isLoadingBookmark ? "Loading..." : bookmarked ? "Tersimpan" : "Bookmark"}
            </button>
          </div>

          <div className="detail-page__info">
            <h1 className="detail-page__title">{detail.title}</h1>
            <div className="detail-page__meta">
              <div className="detail-page__rating-badge"><span className="font-bold">{detail.rating}</span>/10</div>
              <div className="detail-page__meta-item"><span>{detail.author}</span></div>
            </div>
            <div className="detail-page__tags">
              {detail.tags?.map((tag, i) => <Link to={`/genre/${tag}`} key={i} className="detail-page__tag">{tag}</Link>)}
            </div>
            <div className="detail-page__synopsis-container"><h3 className="detail-page__synopsis-title">Sinopsis</h3><p className="detail-page__synopsis-text">{detail.synopsis}</p></div>
          </div>
        </div>

        <div className="detail-page__chapters">
          <h2 className="detail-page__chapters-title">Daftar Chapter</h2>
          <div className="detail-page__chapters-list">
              {chapters.map((chapter, idx) => {
                const chapterNum = chapter.chapterNumber || chapter.id || idx + 1;
                const linkParam = chapter.apiLink ? encodeURIComponent(chapter.apiLink) : chapterNum;
                const isRead = String(lastReadChapterId) === String(linkParam);
                return (
                    <Link key={idx} to={`/read/${detail.slug || id}/${linkParam}`} className={`detail-page__chapter-link ${isRead ? 'opacity-60 bg-gray-100 dark:bg-gray-800' : ''}`}>
                        <span className="detail-page__chapter-title">{chapter.title || `Chapter ${chapterNum}`}</span>
                        {isRead && <span className="text-xs text-primary ml-2 bg-primary/10 px-2 py-0.5 rounded">Terakhir Dibaca</span>}
                    </Link>
                );
              })}
          </div>
        </div>

        {/* --- FITUR REKOMENDASI (Tetap Ada) --- */}
        {relatedComics.length > 0 && (
          <div className="mt-12 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-l-4 border-primary pl-4">Komik Sejenis</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {relatedComics.map((related) => <ComicCard key={related.id} comic={related} />)}
            </div>
          </div>
        )}
        

      </div>
    </div>
  );
}