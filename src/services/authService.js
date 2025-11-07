import { publicRequest, apiRequest } from "@/utils/api";
import { API_ENDPOINTS } from "@/config/api";

export const authService = {
  /**
   * Register a new user
   * This is a public route - no authentication needed
   */
  async register(user, username, password) {
    return await publicRequest(API_ENDPOINTS.auth.register, {
      user,
      username,
      password,
    });
  },

  /**
   * Login a user
   * This is a public route - no authentication needed
   */
  async login(username, password) {
    return await publicRequest(API_ENDPOINTS.auth.login, {
      username,
      password,
    });
  },

  /**
   * Logout a user
   * This requires authentication - session derived from sessionID
   */
  async logout() {
    return await apiRequest(API_ENDPOINTS.auth.logout, {});
  },

  /**
   * Change user password
   * This requires authentication - user derived from session
   */
  async changePassword(oldPassword, newPassword) {
    return await apiRequest(API_ENDPOINTS.auth.changePassword, {
      oldPassword,
      newPassword,
    });
  },
};

export default authService;
