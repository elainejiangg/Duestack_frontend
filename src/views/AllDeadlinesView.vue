<template>
  <div class="all-deadlines-view">
    <div class="header">
      <h1 class="cinzel-title">All Deadlines</h1>
      <div class="view-toggle">
        <button
          @click="currentView = 'list'"
          class="toggle-btn"
          :class="{ active: currentView === 'list' }"
        >
          📋 List
        </button>
        <button
          @click="currentView = 'calendar'"
          class="toggle-btn"
          :class="{ active: currentView === 'calendar' }"
        >
          📅 Calendar
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading deadlines...</div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="view-container">
      <AllDeadlinesList
        v-if="currentView === 'list'"
        :deadlines="deadlines"
        :courses="courses"
        @delete-deadline="handleDeleteDeadline"
        @update-status="handleUpdateStatus"
        @edit-deadline="handleEditDeadline"
      />

      <DeadlinesCalendar
        v-else
        :deadlines="deadlines"
        :courses="courses"
        @delete-deadline="handleDeleteDeadline"
        @update-status="handleUpdateStatus"
        @edit-deadline="handleEditDeadline"
      />
    </div>

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
import { useAuthStore } from "@/stores/auth";
import { deadlineService } from "@/services/deadlineService";
import { courseService } from "@/services/courseService";
import AllDeadlinesList from "@/components/AllDeadlinesList.vue";
import DeadlinesCalendar from "@/components/DeadlinesCalendar.vue";
import EditDeadlineModal from "@/components/EditDeadlineModal.vue";

const authStore = useAuthStore();

const deadlines = ref([]);
const courses = ref([]);
const loading = ref(false);
const error = ref(null);
const showEditModal = ref(false);
const selectedDeadline = ref(null);
const currentView = ref("list"); // 'list' or 'calendar'

async function loadData() {
  loading.value = true;
  error.value = null;

  try {
    // Load courses first
    const coursesResult = await courseService.getCoursesByCreator(
      authStore.userId
    );
    courses.value = Array.isArray(coursesResult) ? coursesResult : [];

    // Load all deadlines for the user
    const deadlinesResult = await deadlineService.getAllDeadlinesByUser(
      authStore.userId
    );
    deadlines.value = Array.isArray(deadlinesResult) ? deadlinesResult : [];
  } catch (err) {
    error.value = err.message || "Failed to load deadlines.";
  } finally {
    loading.value = false;
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
    await loadData();
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
    await loadData();
    // Close modal
    closeEditModal();
  } catch (err) {
    alert(err.message || "Failed to update deadline.");
  }
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.all-deadlines-view {
  max-width: 65vw;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  width: 100%;
}

h1 {
  color: var(--black);
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
  letter-spacing: -1px;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  background: var(--white);
  padding: 0.25rem;
  border-radius: 4px;
  border: 2px solid var(--black);
}

.toggle-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s;
  color: var(--black);
}

.toggle-btn:hover {
  background: var(--light-gray);
}

.toggle-btn.active {
  background: var(--burgundy);
  color: var(--white);
}

.view-container {
  width: 100%;
  min-height: 600px;
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
  border: 2px solid #c33;
  width: 100%;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .all-deadlines-view {
    max-width: 95vw;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .all-deadlines-view {
    max-width: 75vw;
  }
}

@media (min-width: 1025px) {
  .all-deadlines-view {
    max-width: 65vw;
    min-width: 700px;
  }
}
</style>
