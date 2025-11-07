import { apiRequest } from "@/utils/api";
import { API_ENDPOINTS } from "@/config/api";

export const deadlineService = {
  /**
   * Create a new deadline
   * addedBy is automatically derived from session on backend
   */
  async createDeadline(course, title, due, source, websiteUrl) {
    return await apiRequest(API_ENDPOINTS.deadlines.create, {
      course,
      title,
      due,
      source,
      websiteUrl,
    });
  },

  /**
   * Update a deadline
   */
  async updateDeadline(deadline, newTitle, newDue, newSource) {
    return await apiRequest(API_ENDPOINTS.deadlines.update, {
      deadline,
      newTitle,
      newDue,
      newSource,
    });
  },

  /**
   * Set deadline status
   */
  async setStatus(deadline, status) {
    return await apiRequest(API_ENDPOINTS.deadlines.setStatus, {
      deadline,
      status,
    });
  },

  /**
   * Delete a deadline
   */
  async deleteDeadline(deadline) {
    return await apiRequest(API_ENDPOINTS.deadlines.delete, {
      deadline,
    });
  },

  /**
   * Get deadlines by course (using query endpoint)
   */
  async getDeadlinesByCourse(course) {
    const response = await apiRequest(
      "/DeadlineManagement/_getDeadlinesByCourse",
      {
        courseId: course,
      }
    );
    // Backend returns { results: [...] }
    return response.results || response || [];
  },

  /**
   * Get all deadlines for a user (across all courses)
   * User is automatically derived from session on backend
   */
  async getAllDeadlinesByUser() {
    const response = await apiRequest(
      "/DeadlineManagement/_getDeadlinesByAddedBy",
      {}
    );
    // Backend returns { results: [...] }
    return response.results || response || [];
  },
};

export default deadlineService;
