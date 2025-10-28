<template>
  <div class="deadlines-view">
    <div class="header">
      <div>
        <button @click="goBack" class="btn-back">← Back to Courses</button>
        <h1 v-if="course" class="cinzel-title">
          {{ course.courseCode }} - {{ course.title }}
        </h1>
        <h1 v-else class="cinzel-title">Deadlines</h1>
      </div>
      <button @click="showCreateForm = !showCreateForm" class="btn-toggle">
        {{ showCreateForm ? "Cancel" : "+ New Deadline" }}
      </button>
    </div>

    <CreateDeadlineForm
      v-if="showCreateForm"
      :course-id="courseId"
      :user-id="authStore.userId"
      @deadline-created="handleDeadlineCreated"
      @cancel="showCreateForm = false"
    />

    <div v-if="loading" class="loading">Loading deadlines...</div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <DeadlineList
      v-else
      :deadlines="deadlines"
      @delete-deadline="handleDeleteDeadline"
      @update-status="handleUpdateStatus"
      @edit-deadline="handleEditDeadline"
    />

    <EditDeadlineModal
      :show="showEditModal"
      :deadline="selectedDeadline"
      @close="closeEditModal"
      @save="handleSaveDeadline"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { deadlineService } from "@/services/deadlineService";
import { courseService } from "@/services/courseService";
import CreateDeadlineForm from "@/components/CreateDeadlineForm.vue";
import DeadlineList from "@/components/DeadlineList.vue";
import EditDeadlineModal from "@/components/EditDeadlineModal.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const courseId = route.params.courseId;
const course = ref(null);
const deadlines = ref([]);
const loading = ref(false);
const error = ref(null);
const showCreateForm = ref(false);
const showEditModal = ref(false);
const selectedDeadline = ref(null);

async function loadCourse() {
  try {
    const allCourses = await courseService.getCoursesByCreator(
      authStore.userId
    );
    course.value = allCourses.find((c) => c._id === courseId);
  } catch (err) {
    console.error("Failed to load course:", err);
  }
}

async function loadDeadlines() {
  loading.value = true;
  error.value = null;

  try {
    const result = await deadlineService.getDeadlinesByCourse(courseId);
    deadlines.value = Array.isArray(result) ? result : [];
  } catch (err) {
    error.value = err.message || "Failed to load deadlines.";
  } finally {
    loading.value = false;
  }
}

async function handleDeadlineCreated(deadlineData) {
  try {
    await deadlineService.createDeadline(
      courseId,
      deadlineData.title,
      deadlineData.due,
      deadlineData.source,
      authStore.userId
    );
    showCreateForm.value = false;
    await loadDeadlines();
  } catch (err) {
    alert(err.message || "Failed to create deadline.");
  }
}

async function handleDeleteDeadline(deadlineId) {
  if (!confirm("Are you sure you want to delete this deadline?")) {
    return;
  }

  try {
    await deadlineService.deleteDeadline(deadlineId);
    deadlines.value = deadlines.value.filter((d) => d._id !== deadlineId);
  } catch (err) {
    alert(err.message || "Failed to delete deadline.");
  }
}

async function handleUpdateStatus(deadlineId, newStatus) {
  try {
    await deadlineService.setStatus(deadlineId, newStatus);
    // Update local state
    const deadline = deadlines.value.find((d) => d._id === deadlineId);
    if (deadline) {
      deadline.status = newStatus;
    }
  } catch (err) {
    alert(err.message || "Failed to update status.");
    // Reload to reset the UI
    await loadDeadlines();
  }
}

function handleEditDeadline(deadline) {
  selectedDeadline.value = deadline;
  showEditModal.value = true;
}

function closeEditModal() {
  showEditModal.value = false;
  selectedDeadline.value = null;
}

async function handleSaveDeadline({ deadlineId, newTitle, newDue, newSource }) {
  try {
    await deadlineService.updateDeadline(
      deadlineId,
      newTitle,
      newDue,
      newSource
    );
    // Reload deadlines to get the updated data
    await loadDeadlines();
    // Close modal
    closeEditModal();
  } catch (err) {
    alert(err.message || "Failed to update deadline.");
  }
}

function goBack() {
  router.push("/courses");
}

onMounted(() => {
  loadCourse();
  loadDeadlines();
});
</script>

<style scoped>
.deadlines-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 2rem;
}

.btn-back {
  background: transparent;
  border: none;
  color: var(--burgundy);
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
  font-weight: 600;
  transition: color 0.2s;
}

.btn-back:hover {
  color: #5a0504;
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
  transition: all 0.1s;
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
  background-color: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
}
</style>
