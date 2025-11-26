/**
 * Get initials from a name
 * @param {string} name - Full name
 * @param {number} maxInitials - Maximum number of initials (default: 2)
 * @returns {string} Initials in uppercase
 */
export function getInitials(name, maxInitials = 2) {
  if (!name) return "U";

  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    // Single word: return first 2 characters
    return words[0].substring(0, 2).toUpperCase();
  }

  // Multiple words: get first letter of each word
  const initials = words
    .slice(0, maxInitials)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return initials;
}

/**
 * Generate random color for avatar background
 * @param {string} name - Name to generate color from
 * @returns {string} Hex color code
 */
export function getAvatarColor(name) {
  if (!name) return "#4a56e2";

  const colors = [
    "#4a56e2", // primary
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#06b6d4", // cyan
    "#ec4899", // pink
  ];

  // Simple hash function to consistently get same color for same name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}
