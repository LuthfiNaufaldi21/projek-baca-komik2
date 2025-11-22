/**
 * Comic Service
 *
 * Service for comic-related API calls.
 * Currently uses local data from comics.js.
 * Ready for backend integration when API is available.
 */

// import { get, post, put, deleteRequest } from "./api"; // TODO: Uncomment when backend ready

/**
 * Get all comics with optional filters
 * @param {object} filters - Filter options (genre, type, search, etc.)
 * @returns {Promise} - Array of comics
 */
export const getAllComics = async (/* filters = {} */) => {
  try {
    // TODO: Replace with actual API call when backend is ready
    // return await get('/comics', filters);

    // Currently using local data
    const { comics } = await import("../data/comics");
    return comics;
  } catch (error) {
    console.error("Error fetching comics:", error);
    throw error;
  }
};

/**
 * Get comic by ID
 * @param {number|string} id - Comic ID
 * @returns {Promise} - Comic object
 */
export const getComicById = async (id) => {
  try {
    // TODO: Replace with actual API call
    // return await get(`/comics/${id}`);

    const { comics } = await import("../data/comics");
    return comics.find((comic) => comic.id === Number(id));
  } catch (error) {
    console.error("Error fetching comic:", error);
    throw error;
  }
};

/**
 * Search comics by title
 * @param {string} query - Search query
 * @returns {Promise} - Array of matching comics
 */
export const searchComics = async (query) => {
  try {
    // TODO: Replace with actual API call
    // return await get('/comics/search', { q: query });

    const { comics } = await import("../data/comics");
    return comics.filter((comic) =>
      comic.title.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching comics:", error);
    throw error;
  }
};

/**
 * Get comics by genre
 * @param {string} genre - Genre name
 * @returns {Promise} - Array of comics
 */
export const getComicsByGenre = async (genre) => {
  try {
    // TODO: Replace with actual API call
    // return await get(`/comics/genre/${genre}`);

    const { comics } = await import("../data/comics");
    return comics.filter((comic) => comic.genre === genre);
  } catch (error) {
    console.error("Error fetching comics by genre:", error);
    throw error;
  }
};

/**
 * Get comics by type (Manga, Manhwa, Manhua)
 * @param {string} type - Comic type
 * @returns {Promise} - Array of comics
 */
export const getComicsByType = async (type) => {
  try {
    // TODO: Replace with actual API call
    // return await get(`/comics/type/${type}`);

    const { comics } = await import("../data/comics");
    return comics.filter((comic) => comic.type === type);
  } catch (error) {
    console.error("Error fetching comics by type:", error);
    throw error;
  }
};

/**
 * Add comic to user's bookmarks
 * @param {number|string} comicId - Comic ID
 * @returns {Promise} - Updated bookmark list
 */
export const addBookmark = async (comicId) => {
  try {
    // TODO: Replace with actual API call
    // return await post('/bookmarks', { comicId });

    console.log("Bookmark added (local storage):", comicId);
    return { success: true, comicId };
  } catch (error) {
    console.error("Error adding bookmark:", error);
    throw error;
  }
};

/**
 * Remove comic from user's bookmarks
 * @param {number|string} comicId - Comic ID
 * @returns {Promise} - Updated bookmark list
 */
export const removeBookmark = async (comicId) => {
  try {
    // TODO: Replace with actual API call
    // return await deleteRequest(`/bookmarks/${comicId}`);

    console.log("Bookmark removed (local storage):", comicId);
    return { success: true, comicId };
  } catch (error) {
    console.error("Error removing bookmark:", error);
    throw error;
  }
};

export default {
  getAllComics,
  getComicById,
  searchComics,
  getComicsByGenre,
  getComicsByType,
  addBookmark,
  removeBookmark,
};
