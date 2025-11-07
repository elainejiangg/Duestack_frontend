import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import router from "@/router";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    // Check if the response contains an error field (backend returns errors as { error: "message" })
    console.log("[API] Response received:", response.data);
    if (response.data && response.data.error) {
      console.log("[API] Error detected in response:", response.data.error);
      throw new Error(response.data.error);
    }
    return response.data;
  },
  (error) => {
    console.log("[API] Error interceptor triggered:", error);
    const message =
      error.response?.data?.error || error.message || "An error occurred";

    // Handle session expiry
    if (message === "Invalid or expired session") {
      localStorage.removeItem("sessionID");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      router.push("/login");
      throw new Error("Session expired. Please log in again.");
    }

    throw new Error(message);
  }
);

/**
 * Make an authenticated API request that automatically includes sessionID
 * For routes that require authentication (most routes after login)
 */
export async function apiRequest(endpoint, body = {}) {
  const sessionID = localStorage.getItem("sessionID");

  if (!sessionID) {
    // No session - redirect to login
    router.push("/login");
    throw new Error("Not authenticated");
  }

  try {
    const response = await apiClient.post(endpoint, {
      sessionID,
      ...body,
    });

    return response;
  } catch (error) {
    // Error handling is done in the interceptor
    throw error;
  }
}

/**
 * Make a public API request (for login, register, etc.)
 * Does NOT include sessionID
 */
export async function publicRequest(endpoint, body = {}) {
  return await apiClient.post(endpoint, body);
}

// Export both the client (for backward compatibility) and the new helpers
export default apiClient;
