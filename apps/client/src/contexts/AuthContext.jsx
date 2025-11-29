import { createContext, useState } from "react";
import * as authService from "../services/authService";

// Export context so hooks can use it
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Load user from localStorage using lazy initialization to avoid setState in effect
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("komikita-user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("komikita-user");
        return null;
      }
    }
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!(
      localStorage.getItem("komikita-user") &&
      localStorage.getItem("komikita-token")
    );
  });

  // Updated login function to work with backend
  const login = async (email, password) => {
    console.log("🔐 [AuthContext] Login initiated");
    try {
      const userData = await authService.login(email, password);
      console.log("💾 [AuthContext] User data received, setting state...");
      setUser(userData);
      setIsLoggedIn(true);

      // Refresh user data from backend to get latest bookmarks and history
      console.log("🔄 [AuthContext] Refreshing user data from backend...");
      const freshUserData = await authService.getCurrentUser();
      if (freshUserData) {
        console.log(
          "✅ [AuthContext] Fresh user data received, updating state"
        );
        setUser(freshUserData);
      }

      return userData;
    } catch (error) {
      console.error("❌ [AuthContext] Login failed:", error);
      throw error;
    }
  };

  // Updated logout function
  const logout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem("komikita-token");
      localStorage.removeItem("komikita-user");
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout error:", error);
      // Clear local data even if API call fails
      localStorage.removeItem("komikita-token");
      localStorage.removeItem("komikita-user");
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const isBookmarked = (comicId) => {
    if (!isLoggedIn || !user) return false;
    // Handle both formats: simple array [id1, id2] or array of objects [{comicId}]
    if (Array.isArray(user.bookmarks)) {
      return user.bookmarks.some((b) =>
        typeof b === "object" ? b.comicId === comicId : b === comicId
      );
    }
    return false;
  };

  const addBookmark = async (comicId) => {
    if (!isLoggedIn || !user) return;

    console.log("🔖 [AuthContext] Adding bookmark for:", comicId);
    try {
      await authService.toggleBookmark(comicId);
      console.log("🔄 [AuthContext] Refreshing user data after bookmark...");

      // Refresh user data from backend
      const updatedUser = await authService.getCurrentUser();
      console.log("✅ [AuthContext] User state updated with new bookmarks");
      setUser(updatedUser);
    } catch (error) {
      console.error("❌ [AuthContext] Error adding bookmark:", error);
      // Fallback to localStorage on error
      const updatedUser = { ...user };
      if (!updatedUser.bookmarks) updatedUser.bookmarks = [];

      if (!updatedUser.bookmarks.includes(comicId)) {
        updatedUser.bookmarks.push(comicId);
        localStorage.setItem("komikita-user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    }
  };

  const removeBookmark = async (comicId) => {
    if (!isLoggedIn || !user) return;

    console.log("❌ [AuthContext] Removing bookmark for:", comicId);
    try {
      await authService.toggleBookmark(comicId);
      console.log(
        "🔄 [AuthContext] Refreshing user data after removing bookmark..."
      );

      // Refresh user data from backend
      const updatedUser = await authService.getCurrentUser();
      console.log("✅ [AuthContext] User state updated, bookmark removed");
      setUser(updatedUser);
    } catch (error) {
      console.error("❌ [AuthContext] Error removing bookmark:", error);
      // Fallback to localStorage on error
      const updatedUser = { ...user };
      if (updatedUser.bookmarks) {
        updatedUser.bookmarks = updatedUser.bookmarks.filter(
          (id) => id !== comicId
        );
        localStorage.setItem("komikita-user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    }
  };

  // --- LOGIKA DIPERBAIKI DI SINI ---
  const updateReadingHistory = async (comicId, chapterId) => {
    if (!isLoggedIn || !user) return;

    console.log("📖 [AuthContext] Updating reading history:", {
      comicId,
      chapterId,
    });
    try {
      await authService.updateReadingHistory(comicId, chapterId);
      console.log(
        "🔄 [AuthContext] Refreshing user data after reading history update..."
      );

      // Refresh user data from backend
      const updatedUser = await authService.getCurrentUser();
      console.log(
        "✅ [AuthContext] User state updated with new reading history"
      );
      setUser(updatedUser);
    } catch (error) {
      console.error("❌ [AuthContext] Error updating reading history:", error);
      // Fallback to localStorage on error
      const updatedUser = { ...user };
      if (!updatedUser.readingHistory) {
        updatedUser.readingHistory = {};
      }

      // Hapus entri lama jika ada (agar urutannya pindah ke paling baru)
      if (updatedUser.readingHistory[comicId]) {
        delete updatedUser.readingHistory[comicId];
      }

      // Masukkan kembali (sekarang dia jadi property paling 'bawah/baru')
      updatedUser.readingHistory[comicId] = chapterId;

      // Update current user
      localStorage.setItem("komikita-user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };
  // --------------------------------

  const getReadingHistory = () => {
    if (!isLoggedIn || !user) return {};
    return user.readingHistory || {};
  };

  const updateProfile = async (profileData) => {
    if (!isLoggedIn || !user) return;

    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Error updating profile:", error);
      // Fallback to localStorage update
      const localUpdatedUser = {
        ...user,
        ...profileData,
      };
      localStorage.setItem("komikita-user", JSON.stringify(localUpdatedUser));
      setUser(localUpdatedUser);
      return localUpdatedUser;
    }
  };

  const refreshUserData = async () => {
    if (!isLoggedIn) return;

    console.log("🔄 [AuthContext] Manually refreshing user data...");
    try {
      const freshUser = await authService.getCurrentUser();
      setUser(freshUser);
      console.log("✅ [AuthContext] User data refreshed successfully");
      return freshUser;
    } catch (error) {
      console.error("❌ [AuthContext] Error refreshing user data:", error);
      throw error;
    }
  };

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    isBookmarked,
    addBookmark,
    removeBookmark,
    updateReadingHistory,
    getReadingHistory,
    updateProfile,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
