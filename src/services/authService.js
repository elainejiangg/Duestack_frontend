import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config/api";

export const authService = {
  /**
   * Register a new user
   */
  async register(user, username, password) {
    return await api.post(API_ENDPOINTS.auth.register, {
      user,
      username,
      password,
    });
  },

  /**
   * Login a user
   */
  async login(username, password) {
    return await api.post(API_ENDPOINTS.auth.login, {
      username,
      password,
    });
  },

  /**
   * Logout a user
   */
  async logout(sessionID) {
    return await api.post(API_ENDPOINTS.auth.logout, {
      sessionID,
    });
  },

  /**
   * Change user password
   */
  async changePassword(user, oldPassword, newPassword) {
    return await api.post(API_ENDPOINTS.auth.changePassword, {
      user,
      oldPassword,
      newPassword,
    });
  },
};

export default authService;
