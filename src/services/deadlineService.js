import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config/api";

export const deadlineService = {
  /**
   * Create a new deadline
   */
  async createDeadline(course, title, due, source, addedBy) {
    return await api.post(API_ENDPOINTS.deadlines.create, {
      course,
      title,
      due,
      source,
      addedBy,
    });
  },

  /**
   * Update a deadline
   */
  async updateDeadline(deadline, newTitle, newDue, newSource) {
    return await api.post(API_ENDPOINTS.deadlines.update, {
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
    return await api.post(API_ENDPOINTS.deadlines.setStatus, {
      deadline,
      status,
    });
  },

  /**
   * Delete a deadline
   */
  async deleteDeadline(deadline) {
    return await api.post(API_ENDPOINTS.deadlines.delete, {
      deadline,
    });
  },

  /**
   * Get deadlines by course (using query endpoint)
   */
  async getDeadlinesByCourse(course) {
    return await api.post("/DeadlineManagement/_getDeadlinesByCourse", {
      courseId: course,
    });
  },
};

export default deadlineService;
