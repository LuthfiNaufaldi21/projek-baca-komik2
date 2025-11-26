/**
 * Comic Service
 *
 * Service for comic-related API calls.
 * Connected to backend API with fallback to local data.
 */

import { get } from "./api";

/**
 * Get recommended comics
 * @returns {Promise} - Array of recommended comics
 */
export const getRecommendedComics = async () => {
  try {
    const response = await get("/rekomendasi");
    return response;
  } catch (error) {
    console.error("Error fetching recommended comics:", error);
    // Fallback to local data
    const { comics } = await import("../data/comics");
    return comics.slice(0, 10);
  }
};

/**
 * Get latest comics
 * @returns {Promise} - Array of latest comics
 */
export const getLatestComics = async () => {
  try {
    const response = await get("/terbaru");
    return response;
  } catch (error) {
    console.error("Error fetching latest comics:", error);
    // Fallback to local data
    const { comics } = await import("../data/comics");
    return comics.slice(0, 10);
  }
};

/**
 * Get popular comics
 * @returns {Promise} - Array of popular comics
 */
export const getPopularComics = async () => {
  try {
    const response = await get("/komik-populer");
    return response;
  } catch (error) {
    console.error("Error fetching popular comics:", error);
    // Fallback to local data
    const { comics } = await import("../data/comics");
    return comics.slice(0, 10);
  }
};

/**
 * Get colored comics (berwarna)
 * @returns {Promise} - Array of colored comics
 */
export const getColoredComics = async () => {
  try {
    const response = await get("/berwarna");
    return response;
  } catch (error) {
    console.error("Error fetching colored comics:", error);
    // Fallback to local data
    const { comics } = await import("../data/comics");
    return comics.filter((c) => c.isColored === true);
  }
};

/**
 * Get all comics from library
 * @returns {Promise} - Array of comics
 */
export const getAllComics = async () => {
  try {
    const response = await get("/pustaka");
    return response;
  } catch (error) {
    console.error("Error fetching all comics:", error);
    // Fallback to local data
    const { comics } = await import("../data/comics");
    return comics;
  }
};

/**
 * Get comic by slug or ID
 * @param {string} slug - Comic slug
 * @returns {Promise} - Comic object with details
 */
export const getComicBySlug = async (slug) => {
  try {
    const response = await get(`/detail-komik/${slug}`);
    return response;
  } catch (error) {
    console.error("Error fetching comic details:", error);
    // Fallback to local data by ID
    const { comics } = await import("../data/comics");
    return comics.find(
      (comic) => comic.id === Number(slug) || comic.slug === slug
    );
  }
};

/**
 * Get comic by ID (alias for backward compatibility)
 * @param {number|string} id - Comic ID
 * @returns {Promise} - Comic object
 */
export const getComicById = async (id) => {
  try {
    // Try to fetch by ID from local data first for compatibility
    const { comics } = await import("../data/comics");
    const comic = comics.find((c) => c.id === Number(id));

    if (comic && comic.slug) {
      // If comic has slug, fetch full details from API
      return await getComicBySlug(comic.slug);
    }

    return comic;
  } catch (error) {
    console.error("Error fetching comic:", error);
    const { comics } = await import("../data/comics");
    return comics.find((comic) => comic.id === Number(id));
  }
};

/**
 * Search comics by title
 * @param {string} query - Search query
 * @returns {Promise} - Array of matching comics
 */
export const searchComics = async (query) => {
  try {
    const response = await get(`/search?q=${encodeURIComponent(query)}`);
    return response;
  } catch (error) {
    console.error("Error searching comics:", error);
    // Fallback to local data
    const { comics } = await import("../data/comics");
    return comics.filter((comic) =>
      comic.title.toLowerCase().includes(query.toLowerCase())
    );
  }
};

/**
 * Get comics by genre
 * @param {string} genre - Genre slug
 * @returns {Promise} - Array of comics
 */
export const getComicsByGenre = async (genreSlug) => {
  try {
    const response = await get(`/genre/${genreSlug}`);
    return response;
  } catch (error) {
    console.error("Error fetching comics by genre:", error);
    // Fallback to local data
    const { comics } = await import("../data/comics");
    return comics.filter(
      (comic) => comic.genre?.toLowerCase() === genreSlug.toLowerCase()
    );
  }
};

/**
 * Get all genres
 * @returns {Promise} - Array of genres
 */
export const getAllGenres = async () => {
  try {
    const response = await get("/genre-all");
    return response;
  } catch (error) {
    console.error("Error fetching genres:", error);
    // Fallback to default genres
    return [
      { name: "Action", slug: "action" },
      { name: "Adventure", slug: "adventure" },
      { name: "Comedy", slug: "comedy" },
      { name: "Drama", slug: "drama" },
      { name: "Fantasy", slug: "fantasy" },
      { name: "Romance", slug: "romance" },
      { name: "Sci-Fi", slug: "sci-fi" },
    ];
  }
};

/**
 * Get genre recommendations
 * @returns {Promise} - Array of genre recommendations
 */
export const getGenreRecommendations = async () => {
  try {
    const response = await get("/genre-rekomendasi");
    return response;
  } catch (error) {
    console.error("Error fetching genre recommendations:", error);
    return [];
  }
};

/**
 * Get comics by type (Manga, Manhwa, Manhua)
 * @param {string} type - Comic type
 * @returns {Promise} - Array of comics
 */
export const getComicsByType = async (type) => {
  try {
    // Use pustaka endpoint with type filter or fallback
    const { comics } = await import("../data/comics");
    return comics.filter((comic) => comic.type === type);
  } catch (error) {
    console.error("Error fetching comics by type:", error);
    const { comics } = await import("../data/comics");
    return comics.filter((comic) => comic.type === type);
  }
};

/**
 * Get chapter images for reading
 * @param {string} slug - Comic slug
 * @param {string} chapter - Chapter number
 * @returns {Promise} - Chapter data with images
 */
export const getChapterImages = async (slug, chapter) => {
  try {
    const response = await get(`/baca-chapter/${slug}/${chapter}`);
    return response;
  } catch (error) {
    console.error("Error fetching chapter images:", error);
    // Fallback to local chapter data
    const { chapterImages } = await import("../data/chapterImages");
    return chapterImages[`${slug}-${chapter}`] || null;
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
