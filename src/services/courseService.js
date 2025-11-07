import { apiRequest } from "@/utils/api";
import { API_ENDPOINTS } from "@/config/api";

export const courseService = {
  /**
   * Create a new course
   * Creator is automatically derived from session on backend
   */
  async createCourse(courseCode, title) {
    return await apiRequest(API_ENDPOINTS.courses.create, {
      courseCode,
      title,
    });
  },

  /**
   * Update a course
   */
  async updateCourse(course, newCourseCode, newTitle) {
    return await apiRequest(API_ENDPOINTS.courses.update, {
      course,
      newCourseCode,
      newTitle,
    });
  },

  /**
   * Delete a course
   */
  async deleteCourse(course) {
    return await apiRequest(API_ENDPOINTS.courses.delete, {
      course,
    });
  },

  /**
   * Get courses by creator (using query endpoint)
   * Creator is automatically derived from session on backend
   */
  async getCoursesByCreator() {
    const response = await apiRequest(
      "/CourseManagement/_getCoursesByCreator",
      {}
    );
    // Backend returns { results: [...] }
    return response.results || response || [];
  },
};

export default courseService;
