import { createContext, useState } from "react";

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
    return !!localStorage.getItem("komikita-user");
  });

  const login = (username, email = "" /* , password = "" */) => {
    // Check if user already exists in users list
    const usersListStr = localStorage.getItem("komikita-users");
    let usersList = [];

    try {
      usersList = usersListStr ? JSON.parse(usersListStr) : [];
    } catch (error) {
      console.error("Error parsing users list:", error);
      usersList = [];
    }

    // Find existing user by email
    let existingUser = usersList.find((u) => u.email === email);

    if (existingUser) {
      // User exists, log them in
      localStorage.setItem("komikita-user", JSON.stringify(existingUser));
      setUser(existingUser);
      setIsLoggedIn(true);
      return existingUser;
    } else {
      // Create new user
      const newUser = {
        username: username,
        email: email,
        avatar: null,
        bio: "",
        joinedAt: new Date().toISOString(),
        bookmarks: [],
        readingHistory: {},
        favoriteGenres: [],
      };

      // Add to users list
      usersList.push(newUser);
      localStorage.setItem("komikita-users", JSON.stringify(usersList));
      localStorage.setItem("komikita-user", JSON.stringify(newUser));
      setUser(newUser);
      setIsLoggedIn(true);
      return newUser;
    }
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

      // Update current user
      localStorage.setItem("komikita-user", JSON.stringify(updatedUser));

      // Update in users list
      const usersListStr = localStorage.getItem("komikita-users");
      if (usersListStr) {
        try {
          let usersList = JSON.parse(usersListStr);
          const userIndex = usersList.findIndex((u) => u.email === user.email);
          if (userIndex !== -1) {
            usersList[userIndex] = updatedUser;
            localStorage.setItem("komikita-users", JSON.stringify(usersList));
          }
        } catch (error) {
          console.error("Error updating users list:", error);
        }
      }

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

      // Update current user
      localStorage.setItem("komikita-user", JSON.stringify(updatedUser));

      // Update in users list
      const usersListStr = localStorage.getItem("komikita-users");
      if (usersListStr) {
        try {
          let usersList = JSON.parse(usersListStr);
          const userIndex = usersList.findIndex((u) => u.email === user.email);
          if (userIndex !== -1) {
            usersList[userIndex] = updatedUser;
            localStorage.setItem("komikita-users", JSON.stringify(usersList));
          }
        } catch (error) {
          console.error("Error updating users list:", error);
        }
      }

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

    // Update current user
    localStorage.setItem("komikita-user", JSON.stringify(updatedUser));

    // Update in users list
    const usersListStr = localStorage.getItem("komikita-users");
    if (usersListStr) {
      try {
        let usersList = JSON.parse(usersListStr);
        const userIndex = usersList.findIndex((u) => u.email === user.email);
        if (userIndex !== -1) {
          usersList[userIndex] = updatedUser;
          localStorage.setItem("komikita-users", JSON.stringify(usersList));
        }
      } catch (error) {
        console.error("Error updating users list:", error);
      }
    }

    setUser(updatedUser);
  };

  const getReadingHistory = () => {
    if (!isLoggedIn || !user) return {};
    return user.readingHistory || {};
  };

  const updateProfile = (profileData) => {
    if (!isLoggedIn || !user) return;

    const updatedUser = {
      ...user,
      ...profileData,
    };

    // Update current user
    localStorage.setItem("komikita-user", JSON.stringify(updatedUser));

    // Update in users list
    const usersListStr = localStorage.getItem("komikita-users");
    if (usersListStr) {
      try {
        let usersList = JSON.parse(usersListStr);
        const userIndex = usersList.findIndex((u) => u.email === user.email);
        if (userIndex !== -1) {
          usersList[userIndex] = updatedUser;
          localStorage.setItem("komikita-users", JSON.stringify(usersList));
        }
      } catch (error) {
        console.error("Error updating users list:", error);
      }
    }

    setUser(updatedUser);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
