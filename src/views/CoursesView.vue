<template>
  <div class="courses-view">
    <div class="header">
      <h1 class="cinzel-title">Courses</h1>
      <button @click="showCreateForm = !showCreateForm" class="btn-toggle">
        {{ showCreateForm ? "Cancel" : "+ New Course" }}
      </button>
    </div>

    <CreateCourseForm
      v-if="showCreateForm"
      @course-created="handleCourseCreated"
      @cancel="showCreateForm = false"
    />

    <div v-if="loading" class="loading">Loading courses...</div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <CourseList
      v-else
      :courses="courses"
      @delete-course="handleDeleteCourse"
      @view-deadlines="handleViewDeadlines"
      @edit-course="handleEditCourse"
    />

    <EditCourseModal
      :show="showEditModal"
      :course="selectedCourse"
      @close="closeEditModal"
      @save="handleSaveCourse"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { courseService } from "@/services/courseService";
import CreateCourseForm from "@/components/CreateCourseForm.vue";
import CourseList from "@/components/CourseList.vue";
import EditCourseModal from "@/components/EditCourseModal.vue";

const router = useRouter();
const authStore = useAuthStore();

const courses = ref([]);
const loading = ref(false);
const error = ref(null);
const showCreateForm = ref(false);
const showEditModal = ref(false);
const selectedCourse = ref(null);

async function loadCourses() {
  loading.value = true;
  error.value = null;

  try {
    const result = await courseService.getCoursesByCreator(authStore.userId);
    // Backend returns array directly, not wrapped in an object
    courses.value = Array.isArray(result) ? result : [];
  } catch (err) {
    error.value = err.message || "Failed to load courses.";
  } finally {
    loading.value = false;
  }
}

async function handleCourseCreated(newCourse) {
  showCreateForm.value = false;
  // Reload courses to get the complete course data
  await loadCourses();
}

async function handleDeleteCourse(courseId) {
  if (!confirm("Are you sure you want to delete this course?")) {
    return;
  }

  try {
    await courseService.deleteCourse(courseId);
    // Remove from local list
    courses.value = courses.value.filter((c) => c._id !== courseId);
  } catch (err) {
    alert(err.message || "Failed to delete course.");
  }
}

function handleViewDeadlines(courseId) {
  router.push(`/courses/${courseId}/deadlines`);
}

function handleEditCourse(course) {
  selectedCourse.value = course;
  showEditModal.value = true;
}

function closeEditModal() {
  showEditModal.value = false;
  selectedCourse.value = null;
}

async function handleSaveCourse({ courseId, newCourseCode, newTitle }) {
  try {
    await courseService.updateCourse(courseId, newCourseCode, newTitle);
    // Reload courses to get the updated data
    await loadCourses();
    // Close modal
    closeEditModal();
  } catch (err) {
    alert(err.message || "Failed to update course.");
  }
}

onMounted(() => {
  loadCourses();
});
</script>

<style scoped>
.courses-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  color: var(--black);
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
  letter-spacing: -1px;
}

.btn-toggle {
  padding: 0.75rem 1.5rem;
  background-color: var(--royal-blue);
  color: var(--white);
  border: 2px solid var(--black);
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 2px 2px 0 var(--black);
}

.btn-toggle:hover {
  background-color: #1f1f66;
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 var(--black);
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}

.error-message {
  background-color: #eef;
  color: var(--royal-blue);
  padding: 1rem;
  border-radius: 4px;
  border: 2px solid var(--royal-blue);
  margin-bottom: 2rem;
}
</style>
