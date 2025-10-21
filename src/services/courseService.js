import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config/api";

export const courseService = {
  /**
   * Create a new course
   */
  async createCourse(creator, courseCode, title) {
    return await api.post(API_ENDPOINTS.courses.create, {
      creator,
      courseCode,
      title,
    });
  },

  /**
   * Update a course
   */
  async updateCourse(course, newCourseCode, newTitle) {
    return await api.post(API_ENDPOINTS.courses.update, {
      course,
      newCourseCode,
      newTitle,
    });
  },

  /**
   * Set Canvas ID for a course
   */
  async setCanvasId(course, canvasId) {
    return await api.post(API_ENDPOINTS.courses.setCanvasId, {
      course,
      canvasId,
    });
  },

  /**
   * Delete a course
   */
  async deleteCourse(course) {
    return await api.post(API_ENDPOINTS.courses.delete, {
      course,
    });
  },

  /**
   * Get courses by creator (using query endpoint)
   */
  async getCoursesByCreator(creator) {
    return await api.post("/CourseManagement/_getCoursesByCreator", {
      creator,
    });
  },
};

export default courseService;
