import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { authService } from "@/services/authService";

export const useAuthStore = defineStore("auth", () => {
  // State - using localStorage as recommended in assignment
  const sessionID = ref(localStorage.getItem("sessionID") || null);
  const userId = ref(localStorage.getItem("userId") || null);
  const username = ref(localStorage.getItem("username") || null);

  // Getters
  const isAuthenticated = computed(() => !!sessionID.value);

  // Actions
  async function login(usernameInput, password) {
    const response = await authService.login(usernameInput, password);
    sessionID.value = response.sessionID;
    userId.value = response.user;
    username.value = usernameInput;

    // Persist to localStorage
    localStorage.setItem("sessionID", response.sessionID);
    localStorage.setItem("userId", response.user);
    localStorage.setItem("username", usernameInput);

    return response;
  }

  async function logout() {
    try {
      if (sessionID.value) {
        await authService.logout(sessionID.value);
      }
    } finally {
      // Clear state
      sessionID.value = null;
      userId.value = null;
      username.value = null;

      localStorage.removeItem("sessionID");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
    }
  }

  async function register(userId, usernameInput, password) {
    await authService.register(userId, usernameInput, password);
    // After registration, log in automatically
    return await login(usernameInput, password);
  }

  return {
    sessionID,
    userId,
    username,
    isAuthenticated,
    login,
    logout,
    register,
  };
});
