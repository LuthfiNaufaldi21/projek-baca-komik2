export const auth = {
  isLoggedIn: () => !!localStorage.getItem('komikita-user'),

  getUser: () => JSON.parse(localStorage.getItem('komikita-user')),

  login: (username) => {
    const user = { username: username, bookmarks: [], readingHistory: {} };
    localStorage.setItem('komikita-user', JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem('komikita-user');
  },

  isBookmarked: (comicId) => {
    if (!auth.isLoggedIn()) return false;
    const user = auth.getUser();
    return user?.bookmarks?.includes(comicId);
  },

  addBookmark: (comicId) => {
    if (!auth.isLoggedIn()) return;
    const user = auth.getUser();
    if (user) {
      if (!user.bookmarks) user.bookmarks = [];
      if (!user.bookmarks.includes(comicId)) {
        user.bookmarks.push(comicId);
        localStorage.setItem('komikita-user', JSON.stringify(user));
      }
    }
  },

  removeBookmark: (comicId) => {
    if (!auth.isLoggedIn()) return;
    const user = auth.getUser();
    if (user?.bookmarks) {
      user.bookmarks = user.bookmarks.filter((id) => id !== comicId);
      localStorage.setItem('komikita-user', JSON.stringify(user));
    }
  },

  updateReadingHistory: (comicId, chapterId) => {
    if (!auth.isLoggedIn()) return;
    const user = auth.getUser();
    if (!user) return;
    if (!user.readingHistory) user.readingHistory = {};
    user.readingHistory[comicId] = chapterId;
    localStorage.setItem('komikita-user', JSON.stringify(user));
  },

  getReadingHistory: () => {
    if (!auth.isLoggedIn()) return {};
    const user = auth.getUser();
    return user?.readingHistory || {};
  },

  // === Tambahan untuk edit profil ===
  updateUser: (data) => {
    if (!auth.isLoggedIn()) return;
    const user = auth.getUser();
    if (!user) return;
    const updatedUser = { ...user, ...data };
    localStorage.setItem('komikita-user', JSON.stringify(updatedUser));
  }
};
