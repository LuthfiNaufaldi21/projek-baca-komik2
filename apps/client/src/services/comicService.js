/**
 * Comic Service
 *
 * Service for comic-related API calls.
 * Connected to backend API with fallback to local data.
 */

import { get } from "./api";
// Use local dummy data for all lists and details; only chapters use backend.
const loadLocalComics = async () => {
  const { comics } = await import("../data/comics");
  return comics;
};

/**
 * Get recommended comics
 * @returns {Promise} - Array of recommended comics
 */
export const getRecommendedComics = async () => {
  const comics = await loadLocalComics();
  return comics.slice(0, 10);
};

/**
 * Get latest comics
 * @returns {Promise} - Array of latest comics
 */
export const getLatestComics = async () => {
  const comics = await loadLocalComics();
  return comics.slice(0, 10);
};

/**
 * Get popular comics
 * @returns {Promise} - Array of popular comics
 */
export const getPopularComics = async () => {
  const comics = await loadLocalComics();
  return comics.slice(0, 10);
};

/**
 * Get colored comics (berwarna)
 * @returns {Promise} - Array of colored comics
 */
export const getColoredComics = async () => {
  const comics = await loadLocalComics();
  return comics.filter((c) => c.tags?.includes("Warna"));
};

/**
 * Get all comics from library
 * @returns {Promise} - Array of comics
 */
export const getAllComics = async () => {
  return loadLocalComics();
};

/**
 * Get comic by slug or ID
 * @param {string} slug - Comic slug
 * @returns {Promise} - Comic object with details
 */
export const getComicBySlug = async (slug) => {
  const comics = await loadLocalComics();
  return comics.find((c) => c.id === slug || c.slug === slug);
};

/**
 * Get comic by ID (alias for backward compatibility)
 * @param {number|string} id - Comic ID
 * @returns {Promise} - Comic object
 */
export const getComicById = async (idOrSlug) => {
  return getComicBySlug(idOrSlug);
};

/**
 * Search comics by title
 * @param {string} query - Search query
 * @returns {Promise} - Array of matching comics
 */
export const searchComics = async (query) => {
  const comics = await loadLocalComics();
  const q = String(query || "").toLowerCase();
  return comics.filter((c) => {
    const tags = Array.isArray(c.tags) ? c.tags : [];
    return (
      c.title?.toLowerCase().includes(q) ||
      c.author?.toLowerCase().includes(q) ||
      c.synopsis?.toLowerCase().includes(q) ||
      tags.some((t) => String(t).toLowerCase().includes(q))
    );
  });
};

/**
 * Get comics by genre
 * @param {string} genre - Genre slug
 * @returns {Promise} - Array of comics
 */
export const getComicsByGenre = async (genreSlug) => {
  const comics = await loadLocalComics();
  const g = String(genreSlug || "").toLowerCase();
  return comics.filter(
    (c) =>
      (c.genre || "").toLowerCase() === g ||
      (Array.isArray(c.tags) &&
        c.tags.some((t) => String(t).toLowerCase() === g))
  );
};

/**
 * Get all genres
 * @returns {Promise} - Array of genres
 */
export const getAllGenres = async () => {
  const comics = await loadLocalComics();
  const set = new Set();
  comics.forEach((c) =>
    Array.isArray(c.tags) ? c.tags.forEach((t) => set.add(t)) : null
  );
  return Array.from(set).map((t) => ({
    name: t,
    slug: String(t).toLowerCase(),
  }));
};

/**
 * Get genre recommendations
 * @returns {Promise} - Array of genre recommendations
 */
export const getGenreRecommendations = async () => {
  const comics = await loadLocalComics();
  return comics.slice(0, 6);
};

/**
 * Get comics by type (Manga, Manhwa, Manhua)
 * @param {string} type - Comic type
 * @returns {Promise} - Array of comics
 */
export const getComicsByType = async (type) => {
  const comics = await loadLocalComics();
  const t = String(type || "").toLowerCase();
  return comics.filter(
    (c) =>
      (c.type || "").toLowerCase() === t ||
      (Array.isArray(c.tags) &&
        c.tags.some((tag) => String(tag).toLowerCase() === t))
  );
};

/**
 * Get chapter images for reading
 * @param {string} slug - Comic slug
 * @param {string} chapter - Chapter identifier (number, path, or URL)
 * @returns {Promise} - Chapter data with images
 */
export const getChapterImages = async (slug, chapter) => {
  try {
    // If chapter is a path (like /baca-chapter/...) extract the actual endpoint
    let endpoint;
    if (chapter.startsWith("/baca-chapter/")) {
      // Already a complete API path - use directly
      endpoint = chapter;
    } else if (
      chapter.startsWith("http://") ||
      chapter.startsWith("https://")
    ) {
      // Full URL from Komiku - encode and pass to backend
      endpoint = `/baca-chapter/${slug}/${encodeURIComponent(chapter)}`;
    } else {
      // Just a chapter number - construct traditional path
      endpoint = `/baca-chapter/${slug}/${chapter}`;
    }

    const response = await get(endpoint);
    return response;
  } catch (error) {
    console.error("Error fetching chapter images:", error);
    // Fallback to local chapter data
    const { chapterImages } = await import("../data/chapterImages");
    const fallbackKey =
      chapter.startsWith("/") || chapter.startsWith("http")
        ? `${slug}-${chapter.split("/").pop()}`
        : `${slug}-${chapter}`;
    return chapterImages[fallbackKey] || null;
  }
};

/**
 * Add comic to user's bookmarks (localStorage for now)
 * @param {number|string} comicId - Comic ID
 * @returns {Promise} - Updated bookmark list
 */
export const addBookmark = async (comicId) => {
  try {
    // TODO: Implement backend bookmark API
    console.log("Bookmark added (local storage):", comicId);
    return { success: true, comicId };
  } catch (error) {
    console.error("Error adding bookmark:", error);
    throw error;
  }
};

/**
 * Remove comic from user's bookmarks (localStorage for now)
 * @param {number|string} comicId - Comic ID
 * @returns {Promise} - Updated bookmark list
 */
export const removeBookmark = async (comicId) => {
  try {
    // TODO: Implement backend bookmark API
    console.log("Bookmark removed (local storage):", comicId);
    return { success: true, comicId };
  } catch (error) {
    console.error("Error removing bookmark:", error);
    throw error;
  }
};

export default {
  getRecommendedComics,
  getLatestComics,
  getPopularComics,
  getColoredComics,
  getAllComics,
  getComicById,
  getComicBySlug,
  searchComics,
  getComicsByGenre,
  getAllGenres,
  getGenreRecommendations,
  getComicsByType,
  getChapterImages,
  addBookmark,
  removeBookmark,
};
