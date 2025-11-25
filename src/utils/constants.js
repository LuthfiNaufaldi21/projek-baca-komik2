/**
 * Application-wide constants
 */

// Pagination
export const ITEMS_PER_PAGE = 10;
export const MAX_VISIBLE_PAGES = 5;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: "komikita-user",
  THEME: "komikita-theme",
  READING_HISTORY: "komikita-reading-history",
};

// App Info
export const APP_NAME = "KomiKita";
export const APP_DESCRIPTION = "Platform baca komik terlengkap dan terbaru";

// API URLs (for future backend integration)
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Date Format
export const DATE_FORMAT = {
  SHORT: "DD/MM/YYYY",
  LONG: "DD MMMM YYYY",
  TIME: "HH:mm",
  FULL: "DD MMMM YYYY HH:mm",
};
