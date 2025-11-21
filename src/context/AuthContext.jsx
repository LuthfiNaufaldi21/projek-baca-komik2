import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("komikita-user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("komikita-user");
      }
    }
  }, []);

  const login = (username) => {
    const newUser = {
      username: username,
      bookmarks: [],
      readingHistory: {},
    };
    localStorage.setItem("komikita-user", JSON.stringify(newUser));
    setUser(newUser);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("komikita-user");
    setUser(null);
    setIsLoggedIn(false);
  };

  const isBookmarked = (comicId) => {
    if (!isLoggedIn || !user) return false;
    return user.bookmarks?.includes(comicId) || false;
  };

  const addBookmark = (comicId) => {
    if (!isLoggedIn || !user) return;

    const updatedUser = { ...user };
    if (!updatedUser.bookmarks) updatedUser.bookmarks = [];

    if (!updatedUser.bookmarks.includes(comicId)) {
      updatedUser.bookmarks.push(comicId);
      localStorage.setItem("komikita-user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const removeBookmark = (comicId) => {
    if (!isLoggedIn || !user) return;

    const updatedUser = { ...user };
    if (updatedUser.bookmarks) {
      updatedUser.bookmarks = updatedUser.bookmarks.filter(
        (id) => id !== comicId
      );
      localStorage.setItem("komikita-user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const updateReadingHistory = (comicId, chapterId) => {
    if (!isLoggedIn || !user) return;

    const updatedUser = { ...user };
    if (!updatedUser.readingHistory) {
      updatedUser.readingHistory = {};
    }
    updatedUser.readingHistory[comicId] = chapterId;
    localStorage.setItem("komikita-user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const getReadingHistory = () => {
    if (!isLoggedIn || !user) return {};
    return user.readingHistory || {};
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
