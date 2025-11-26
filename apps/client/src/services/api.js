/**
 * API Configuration and Base Functions
 *
 * This file provides base configuration and utility functions for API calls.
 * Currently configured for future backend integration.
 */

// Base API URL - Update this when backend is ready
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Generic API request function
 * @param {string} endpoint - API endpoint (e.g., '/comics', '/auth/login')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise} - Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Get token from localStorage if exists
  const token = localStorage.getItem("komikita-token");
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Handle non-OK responses
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }

    // Parse JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * GET request helper
 * @param {string} endpoint - API endpoint
 * @param {object} params - Query parameters
 * @returns {Promise} - Response data
 */
export const get = (endpoint, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;

  return apiRequest(url, { method: "GET" });
};

/**
 * POST request helper
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body
 * @returns {Promise} - Response data
 */
export const post = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * PUT request helper
 * @param {string} endpoint - API endpoint
 * @param {object} data - Request body
 * @returns {Promise} - Response data
 */
export const put = (endpoint, data) => {
  return apiRequest(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * DELETE request helper
 * @param {string} endpoint - API endpoint
 * @returns {Promise} - Response data
 */
export const deleteRequest = (endpoint) => {
  return apiRequest(endpoint, { method: "DELETE" });
};

export default {
  get,
  post,
  put,
  delete: deleteRequest,
};
