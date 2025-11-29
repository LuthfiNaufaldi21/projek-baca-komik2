/**
 * Format date to readable string
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format type: 'short', 'long', 'relative'
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = "short") {
  if (!date) return "";

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "";

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const day = dateObj.getDate();
  const month = months[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  switch (format) {
    case "long":
      return `${day} ${month} ${year}`;

    case "short":
      return `${day}/${dateObj.getMonth() + 1}/${year}`;

    case "relative":
      return getRelativeTime(dateObj);

    default:
      return `${day} ${month} ${year}`;
  }
}

/**
 * Get relative time string (e.g., "2 jam lalu", "3 hari lalu")
 */
function getRelativeTime(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
  return `${Math.floor(diffDays / 365)} tahun lalu`;
}

// Named exports for convenience
export const short = (date) => formatDate(date, "short");
export const long = (date) => formatDate(date, "long");
export const relative = (date) => formatDate(date, "relative");
