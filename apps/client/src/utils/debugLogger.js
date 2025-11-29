/**
 * Debug Logger Utility
 *
 * Helper functions untuk debugging dan monitoring aplikasi
 */

/**
 * Enable/disable debug logging
 */
export const DEBUG_MODE = import.meta.env.DEV; // true di development, false di production

/**
 * Log API Summary
 */
export const logAPISummary = () => {
  console.group("📊 API Summary");
  console.log(
    "🌐 Base URL:",
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  );
  console.log(
    "🔑 Token:",
    localStorage.getItem("komikita-token") ? "Present ✅" : "Missing ❌"
  );
  console.log(
    "👤 User:",
    localStorage.getItem("komikita-user") ? "Logged in ✅" : "Not logged in ❌"
  );

  try {
    const user = JSON.parse(localStorage.getItem("komikita-user") || "{}");
    if (user.username) {
      console.log("📝 Username:", user.username);
      console.log("📧 Email:", user.email);
      console.log(
        "🔖 Bookmarks:",
        Array.isArray(user.bookmarks) ? user.bookmarks.length : 0
      );
      console.log(
        "📖 History:",
        user.readingHistory ? Object.keys(user.readingHistory).length : 0
      );
      console.log("🖼️  Avatar:", user.avatar ? "Yes" : "No");
    }
  } catch (e) {
    console.error("Error parsing user data:", e);
  }
  console.groupEnd();
};

/**
 * Log User State
 */
export const logUserState = (user) => {
  console.group("👤 User State");
  console.log("Raw User Object:", user);
  if (user) {
    console.log("Username:", user.username);
    console.log("Email:", user.email);
    console.log("Avatar:", user.avatar);
    console.log("Bookmarks:", user.bookmarks);
    console.log("Reading History:", user.readingHistory);
    console.log("Joined At:", user.joinedAt);
  } else {
    console.log("No user logged in");
  }
  console.groupEnd();
};

/**
 * Log Network Request
 */
export const logNetworkRequest = (method, url, data = null) => {
  if (!DEBUG_MODE) return;

  console.group(`🌐 ${method} ${url}`);
  console.log("Timestamp:", new Date().toLocaleTimeString());
  if (data) {
    console.log("Data:", data);
  }
  console.groupEnd();
};

/**
 * Log Network Response
 */
export const logNetworkResponse = (method, url, response, duration) => {
  if (!DEBUG_MODE) return;

  console.group(`✅ ${method} ${url} (${duration}ms)`);
  console.log("Response:", response);
  console.groupEnd();
};

/**
 * Log Error
 */
export const logError = (context, error) => {
  console.group(`❌ Error in ${context}`);
  console.error("Message:", error.message);
  console.error("Stack:", error.stack);
  console.error("Full Error:", error);
  console.groupEnd();
};

/**
 * Clear all logs
 */
export const clearLogs = () => {
  console.clear();
  console.log("🧹 Logs cleared");
};

/**
 * Export debug commands to window for easy access in console
 */
if (DEBUG_MODE && typeof window !== "undefined") {
  window.debugKomikita = {
    summary: logAPISummary,
    user: () =>
      logUserState(JSON.parse(localStorage.getItem("komikita-user") || "null")),
    clearLogs,
    clearStorage: () => {
      localStorage.removeItem("komikita-token");
      localStorage.removeItem("komikita-user");
      console.log("🧹 Storage cleared");
    },
    showToken: () => {
      console.log("🔑 Token:", localStorage.getItem("komikita-token"));
    },
    testConnection: async () => {
      console.log("🔌 Testing connection to backend...");
      try {
        const response = await fetch("http://localhost:5000/");
        const data = await response.json();
        console.log("✅ Backend is running:", data);
      } catch (error) {
        console.error("❌ Backend connection failed:", error);
      }
    },
  };

  console.log(`
  🐛 Debug Commands Available:
  
  debugKomikita.summary()       - Show API summary
  debugKomikita.user()          - Show current user
  debugKomikita.clearLogs()     - Clear console
  debugKomikita.clearStorage()  - Clear localStorage
  debugKomikita.showToken()     - Show auth token
  debugKomikita.testConnection() - Test backend connection
  `);
}

export default {
  logAPISummary,
  logUserState,
  logNetworkRequest,
  logNetworkResponse,
  logError,
  clearLogs,
};
