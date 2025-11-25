/**
 * Authentication Service
 *
 * Service for authentication-related API calls.
 * Currently uses localStorage for demo purposes.
 * Ready for backend integration when API is available.
 */

// import { post, put, get } from "./api"; // TODO: Uncomment when backend ready

/**
 * Login user
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise} - User object and token
 */
export const login = async (username /* , password */) => {
  try {
    // TODO: Replace with actual API call when backend is ready
    // const response = await post('/auth/login', { username, password });
    // localStorage.setItem('komikita-token', response.token);
    // return response.user;

    // Demo login - accepts any username/password
    const mockUser = {
      id: Date.now(),
      username,
      email: `${username}@example.com`,
      avatar: null,
      bio: "",
      joinedAt: new Date().toISOString(),
      bookmarks: [],
      favoriteGenres: [],
    };

    return mockUser;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Register new user
 * @param {object} userData - User registration data
 * @returns {Promise} - User object and token
 */
export const register = async (userData) => {
  try {
    // TODO: Replace with actual API call
    // const response = await post('/auth/register', userData);
    // localStorage.setItem('komikita-token', response.token);
    // return response.user;

    // Demo registration
    const mockUser = {
      id: Date.now(),
      username: userData.username,
      email: userData.email,
      avatar: null,
      bio: "",
      joinedAt: new Date().toISOString(),
      bookmarks: [],
      favoriteGenres: [],
    };

    return mockUser;
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
  try {
    // TODO: Replace with actual API call
    // return await get('/auth/me');

    // Get from localStorage
    const userStr = localStorage.getItem("komikita-user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error getting current user:", error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {object} profileData - Updated profile data
 * @returns {Promise} - Updated user object
 */
export const updateProfile = async (profileData) => {
  try {
    // TODO: Replace with actual API call
    // return await put('/auth/profile', profileData);

    // Update in localStorage
    const userStr = localStorage.getItem("komikita-user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem("komikita-user", JSON.stringify(updatedUser));
      return updatedUser;
    }

    return null;
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
export const changePassword = async (/* oldPassword, newPassword */) => {
  try {
    // TODO: Replace with actual API call
    // return await put('/auth/password', { oldPassword, newPassword });

    console.log("Password change (demo mode)");
    return { success: true, message: "Password changed successfully" };
  } catch (error) {
    console.error("Error changing password:", error);
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
};
