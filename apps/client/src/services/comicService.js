/**
 * Comic Service
 *
 * Service for comic-related API calls.
 * All comic metadata fetched from database.
 * Only chapter list and chapter images are scraped.
 */

import { get } from "./api";

/**
 * Get recommended comics from database
 * @returns {Promise} - Array of recommended comics
 */
export const getRecommendedComics = async () => {
  try {
    const response = await get("/api/comics?limit=10");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching recommended comics:", error);
    return [];
  }
};

/**
 * Get latest comics from database
 * @returns {Promise} - Array of latest comics
 */
export const getLatestComics = async () => {
  try {
    const response = await get("/api/comics?limit=10&sort=created_at");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching latest comics:", error);
    return [];
  }
};

/**
 * Get popular comics from database (sorted by rating)
 * @returns {Promise} - Array of popular comics
 */
export const getPopularComics = async () => {
  try {
    const response = await get("/api/comics?limit=10&sort=rating");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching popular comics:", error);
    return [];
  }
};

/**
 * Get colored comics from database
 * @returns {Promise} - Array of colored comics
 */
export const getColoredComics = async () => {
  try {
    const response = await get("/api/comics?genre=warna&limit=50");
    return response.data || [];
  } catch (error) {
    console.error("Error fetching colored comics:", error);
    return [];
  }
};

/**
 * Get all comics from database
 * @param {Object} params - Query parameters (page, limit, type, search, etc)
 * @returns {Promise} - Array of comics
 */
export const getAllComics = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString
      ? `/api/comics?${queryString}`
      : "/api/comics?limit=100";
    const response = await get(endpoint);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching all comics:", error);
    return [];
  }
};

/**
 * Get comic by slug or ID
 * @param {string} slug - Comic slug
 * @returns {Promise} - Comic object with details
 */
export const getComicBySlug = async (slug) => {
  try {
    // Try to get all comics and find exact slug match
    // Since backend search only searches title, not slug
    const response = await get(`/api/comics?limit=100`);
    if (response?.data?.length > 0) {
      // Find exact match by slug or id
      const exactMatch = response.data.find(
        (c) => c.slug === slug || String(c.id) === String(slug)
      );
      if (exactMatch) return exactMatch;

      // Fallback: search by title if slug not found
      const titleMatch = response.data.find((c) =>
        c.title.toLowerCase().includes(slug.toLowerCase())
      );
      return titleMatch || null;
    }
    return null;
  } catch (error) {
    console.error(`Error getting comic by slug ${slug}:`, error);
    return null;
  }
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
 * Search comics by title from database
 * @param {string} query - Search query
 * @returns {Promise} - Array of matching comics
 */
export const searchComics = async (query) => {
  try {
    const response = await get(
      `/api/comics?search=${encodeURIComponent(query)}&limit=50`
    );
    return response.data || [];
  } catch (error) {
    console.error("Error searching comics:", error);
    return [];
  }
};

/**
 * Get comics by genre from database
 * @param {string} genreSlug - Genre slug
 * @returns {Promise} - Array of comics
 */
export const getComicsByGenre = async (genreSlug) => {
  try {
    const response = await get(
      `/api/comics?genre=${encodeURIComponent(genreSlug)}&limit=50`
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching comics by genre:", error);
    return [];
  }
};

/**
 * Get all genres from database
 * @returns {Promise} - Array of genres
 */
export const getAllGenres = async () => {
  try {
    const response = await get("/genre-all");
    return response || [];
  } catch (error) {
    console.error("Error fetching all genres:", error);
    return [];
  }
};

/**
 * Get genre recommendations from database
 * @returns {Promise} - Array of genre recommendations
 */
export const getGenreRecommendations = async () => {
  try {
    const response = await get("/genre-rekomendasi");
    return response || [];
  } catch (error) {
    console.error("Error fetching genre recommendations:", error);
    return [];
  }
};

/**
 * Get comics by type (Manga, Manhwa, Manhua) from database
 * @param {string} type - Comic type
 * @returns {Promise} - Array of comics
 */
export const getComicsByType = async (type) => {
  try {
    const response = await get(
      `/api/comics?type=${encodeURIComponent(type)}&limit=50`
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching comics by type:", error);
    return [];
  }
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
