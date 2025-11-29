/**
 * Authentication Service
 *
 * Service for authentication-related API calls.
 * Connected to backend API.
 */

import { post, put, get, deleteRequest as del } from "./api";

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - Password
 * @returns {Promise} - User object and token
 */
export const login = async (email, password) => {
  console.log("🔐 [AuthService] Login attempt for:", email);
  try {
    const response = await post("/api/auth/login", { email, password });
    console.log(
      "✅ [AuthService] Login successful, user:",
      response.user?.username
    );

    // Store token and user data
    if (response.token) {
      localStorage.setItem("komikita-token", response.token);
      console.log("💾 [AuthService] Token saved to localStorage");
    }
    if (response.user) {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      // Convert backend format to frontend format
      const bookmarkIds = Array.isArray(response.user.bookmarks)
        ? response.user.bookmarks.map((b) =>
            typeof b === "object" ? b.comicId : b
          )
        : [];

      const historyObj = {};
      if (Array.isArray(response.user.readingHistory)) {
        response.user.readingHistory.forEach((item) => {
          historyObj[item.comicId] = item.lastReadChapter;
        });
      }

      const userData = {
        ...response.user,
        avatar: response.user.avatar
          ? `${API_BASE_URL}${response.user.avatar}`
          : null,
        bio: response.user.bio || "",
        bookmarks: bookmarkIds,
        readingHistory: historyObj,
        favoriteGenres: response.user.favoriteGenres || [],
        joinedAt: response.user.createdAt || new Date().toISOString(),
      };
      localStorage.setItem("komikita-user", JSON.stringify(userData));
      console.log("💾 [AuthService] User data converted and saved:", {
        bookmarks: bookmarkIds.length,
        history: Object.keys(historyObj).length,
        avatar: userData.avatar ? "Yes" : "No",
      });
      return userData;
    }

    return response.user;
  } catch (error) {
    console.error("❌ [AuthService] Login error:", error);
    throw error;
  }
};

/**
 * Register new user
 * @param {object} userData - User registration data (username, email, password)
 * @returns {Promise} - User object and token
 */
export const register = async (userData) => {
  try {
    const response = await post("/api/auth/register", userData);

    // After successful registration, automatically log in
    if (response.user && userData.password) {
      // Login to get token
      return await login(userData.email, userData.password);
    }

    return response.user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise} - Success message
 */
export const logout = async () => {
  try {
    // TODO: Replace with actual API call
    // await post('/auth/logout');

    localStorage.removeItem("komikita-token");
    localStorage.removeItem("komikita-user");

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

/**
 * Get current user profile
 * @returns {Promise} - User object
 */
export const getCurrentUser = async () => {
  console.log("👤 [AuthService] Getting current user profile...");
  try {
    const token = localStorage.getItem("komikita-token");

    if (!token) {
      console.log(
        "⚠️  [AuthService] No token found, returning from localStorage"
      );
      // No token, return from localStorage if exists
      const userStr = localStorage.getItem("komikita-user");
      return userStr ? JSON.parse(userStr) : null;
    }

    console.log("🔑 [AuthService] Token found, fetching from backend...");
    // Fetch from backend
    const response = await get("/api/user/profile");

    if (response) {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      // Convert backend format to frontend format
      const bookmarkIds = Array.isArray(response.bookmarks)
        ? response.bookmarks.map((b) => (typeof b === "object" ? b.comicId : b))
        : [];

      const historyObj = {};
      if (Array.isArray(response.readingHistory)) {
        response.readingHistory.forEach((item) => {
          historyObj[item.comicId] = item.lastReadChapter;
        });
      }

      const userData = {
        ...response,
        avatar: response.avatar ? `${API_BASE_URL}${response.avatar}` : null,
        bio: response.bio || "",
        bookmarks: bookmarkIds,
        readingHistory: historyObj,
        favoriteGenres: response.favoriteGenres || [],
        joinedAt: response.createdAt || new Date().toISOString(),
      };
      localStorage.setItem("komikita-user", JSON.stringify(userData));
      console.log("✅ [AuthService] User profile fetched and converted:", {
        username: userData.username,
        bookmarks: bookmarkIds.length,
        history: Object.keys(historyObj).length,
        avatar: userData.avatar ? "Yes" : "No",
      });
      return userData;
    }

    return response;
  } catch (error) {
    console.error("❌ [AuthService] Error getting current user:", error);
    // Fallback to localStorage
    const userStr = localStorage.getItem("komikita-user");
    return userStr ? JSON.parse(userStr) : null;
  }
};

/**
 * Update user profile
 * @param {object} profileData - Updated profile data
 * @returns {Promise} - Updated user object
 */
export const updateProfile = async (profileData) => {
  try {
    const token = localStorage.getItem("komikita-token");

    if (!token) {
      // Fallback to localStorage if no token
      const userStr = localStorage.getItem("komikita-user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem("komikita-user", JSON.stringify(updatedUser));
        return updatedUser;
      }
      return null;
    }

    // Update via backend API
    const response = await put("/api/user/profile", profileData);

    if (response && response.user) {
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000";

      // Convert backend format to frontend format
      const bookmarkIds = Array.isArray(response.user.bookmarks)
        ? response.user.bookmarks.map((b) =>
            typeof b === "object" ? b.comicId : b
          )
        : [];

      const historyObj = {};
      if (Array.isArray(response.user.readingHistory)) {
        response.user.readingHistory.forEach((item) => {
          historyObj[item.comicId] = item.lastReadChapter;
        });
      }

      const userData = {
        ...response.user,
        avatar: response.user.avatar
          ? `${API_BASE_URL}${response.user.avatar}`
          : null,
        bio: response.user.bio || "",
        bookmarks: bookmarkIds,
        readingHistory: historyObj,
        favoriteGenres: response.user.favoriteGenres || [],
        joinedAt: response.user.createdAt || new Date().toISOString(),
      };
      localStorage.setItem("komikita-user", JSON.stringify(userData));
      return userData;
    }

    return response;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

/**
 * Change password
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} - Success message
 */
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const token = localStorage.getItem("komikita-token");

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await put("/api/user/password", {
      oldPassword,
      newPassword,
    });

    return response;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

/**
 * Upload user avatar
 * @param {File} file - Image file to upload
 * @returns {Promise} - Updated user object with new avatar URL
 */
export const uploadAvatar = async (file) => {
  try {
    const token = localStorage.getItem("komikita-token");

    if (!token) {
      throw new Error("Not authenticated");
    }

    const formData = new FormData();
    formData.append("avatar", file);

    const API_BASE_URL =
      import.meta.env.VITE_API_URL || "http://localhost:5000";
    const url = `${API_BASE_URL}/api/user/avatar`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || "Failed to upload avatar");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw new Error(error.response?.data?.error || "Gagal mengupload avatar");
  }
};

/**
 * Delete user account
 * @returns {Promise} - Success message
 */
export const deleteAccount = async () => {
  try {
    const token = localStorage.getItem("komikita-token");

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await del("/api/user/account");

    // Clear local storage after successful deletion
    localStorage.removeItem("komikita-token");
    localStorage.removeItem("komikita-user");

    return response;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw new Error(error.response?.data?.error || "Gagal menghapus akun");
  }
};

/**
 * Remove user avatar
 * @returns {Promise} - Success message
 */
export const removeAvatar = async () => {
  try {
    const token = localStorage.getItem("komikita-token");

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await del("/api/user/avatar");
    return response;
  } catch (error) {
    console.error("Error removing avatar:", error);
    throw new Error(error.response?.data?.error || "Gagal menghapus avatar");
  }
};

/**
 * Toggle bookmark for a comic
 * @param {string} comicId - Comic ID to bookmark/unbookmark
 * @returns {Promise} - Updated bookmark list
 */
export const toggleBookmark = async (comicId) => {
  console.log("🔖 [AuthService] Toggling bookmark for comic:", comicId);
  try {
    const token = localStorage.getItem("komikita-token");

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await post("/api/user/bookmark", { comicId });
    console.log(
      "✅ [AuthService] Bookmark toggled successfully:",
      response.msg
    );

    // Don't update localStorage here, let getCurrentUser handle it
    // This will be refreshed by the context
    return response;
  } catch (error) {
    console.error("❌ [AuthService] Error toggling bookmark:", error);
    throw error;
  }
};

/**
 * Update reading history
 * @param {string} comicId - Comic ID
 * @param {string} chapterId - Chapter ID that was read
 * @returns {Promise} - Updated reading history
 */
export const updateReadingHistory = async (comicId, chapterId) => {
  console.log("📖 [AuthService] Updating reading history:", {
    comicId,
    chapterId,
  });
  try {
    const token = localStorage.getItem("komikita-token");

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await post("/api/user/history", { comicId, chapterId });
    console.log("✅ [AuthService] Reading history updated successfully");

    // Don't update localStorage here, let getCurrentUser handle it
    // This will be refreshed by the context
    return response;
  } catch (error) {
    console.error("❌ [AuthService] Error updating reading history:", error);
    throw error;
  }
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  uploadAvatar,
  removeAvatar,
  deleteAccount,
  toggleBookmark,
  updateReadingHistory,
};
