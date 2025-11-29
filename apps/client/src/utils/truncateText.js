/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Truncate text by word count
 * @param {string} text - Text to truncate
 * @param {number} maxWords - Maximum number of words
 * @returns {string} Truncated text
 */
export function truncateWords(text, maxWords = 20) {
  if (!text) return "";

  const words = text.split(" ");
  if (words.length <= maxWords) return text;

  return words.slice(0, maxWords).join(" ") + "...";
}
