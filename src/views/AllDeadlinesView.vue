<template>
  <div class="all-deadlines-view">
    <div class="header">
      <h1 class="cinzel-title">All Deadlines</h1>
      <div class="header-actions">
        <button
          @click="showCreateDeadline = !showCreateDeadline"
          class="btn-new-deadline"
        >
          {{ showCreateDeadline ? "Cancel" : "+ New Deadline" }}
        </button>
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
    </div>

    <!-- Source Selection -->
    <div v-if="showCreateDeadline && !selectedSource" class="source-selector">
      <h3>Select Deadline Source</h3>
      <div class="source-options">
        <button @click="selectedSource = 'MANUAL'" class="source-option">
          ✏️ Manual Entry
        </button>
        <button
          @click="selectedSource = 'AI_PARSED'"
          class="source-option ai-option"
        >
          🤖 AI Document Extraction
        </button>
        <button
          @click="selectedSource = 'WEBSITE'"
          class="source-option ai-option"
        >
          🌐 AI Website Extraction
        </button>
        <button class="source-option disabled" disabled>
          📚 Canvas (Coming Soon)
        </button>
      </div>
    </div>

    <!-- AI Extraction Interface -->
    <AIDeadlineExtractor
      v-if="
        showCreateDeadline &&
        selectedSource &&
        ['AI_PARSED', 'WEBSITE'].includes(selectedSource)
      "
      :course-id="selectedCourseForCreation"
      :courses="courses"
      :show-course-selector="true"
      :source="selectedSource"
      @deadlines-created="handleAIDeadlinesCreated"
      @cancel="resetCreateForm"
      @course-selected="selectedCourseForCreation = $event"
    />

    <!-- Manual Deadline Creation Form -->
    <div
      v-if="showCreateDeadline && selectedSource === 'MANUAL'"
      class="create-deadline-section"
    >
      <CreateDeadlineForm
        :course-id="selectedCourseForCreation"
        :user-id="authStore.userId"
        :courses="courses"
        :show-course-selector="true"
        :source="selectedSource"
        @deadline-created="handleDeadlineCreated"
        @cancel="resetCreateForm"
        @course-selected="selectedCourseForCreation = $event"
      />
    </div>

    <div
      v-if="showCreateDeadline && selectedSource === 'CANVAS'"
      class="create-deadline-section coming-soon"
    >
      <p class="coming-soon-text">
        Canvas extraction is coming soon! Please choose another source for now.
      </p>
      <button @click="resetCreateForm" class="btn-secondary">Back</button>
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
        @bulk-delete="handleBulkDelete"
        @bulk-status-change="handleBulkStatusChange"
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
import { useRoute } from "vue-router";
import { deadlineService } from "@/services/deadlineService";
import { courseService } from "@/services/courseService";
import AllDeadlinesList from "@/components/AllDeadlinesList.vue";
import DeadlinesCalendar from "@/components/DeadlinesCalendar.vue";
import EditDeadlineModal from "@/components/EditDeadlineModal.vue";
import CreateDeadlineForm from "@/components/CreateDeadlineForm.vue";
import AIDeadlineExtractor from "@/components/AIDeadlineExtractor.vue";

const authStore = useAuthStore();
const route = useRoute();

const deadlines = ref([]);
const courses = ref([]);
const loading = ref(false);
const error = ref(null);
const showEditModal = ref(false);
const selectedDeadline = ref(null);
const showCreateDeadline = ref(false);
const selectedSource = ref(null); // 'MANUAL', 'AI_PARSED', 'WEBSITE', 'CANVAS'
const selectedCourseForCreation = ref(null);

// Check if there's a 'view' query parameter, default to 'list'
const currentView = ref(route.query.view === "calendar" ? "calendar" : "list");

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

async function handleBulkDelete(deadlineIds) {
  // The confirmation already happened in the child component
  let successCount = 0;
  let failCount = 0;

  for (const id of deadlineIds) {
    try {
      await deadlineService.deleteDeadline(id);
      successCount++;
    } catch (err) {
      console.error(`Failed to delete deadline ${id}:`, err);
      failCount++;
    }
  }

  // Update local state - remove all successfully deleted deadlines
  deadlines.value = deadlines.value.filter((d) => !deadlineIds.includes(d._id));

  // Show result message
  if (failCount === 0) {
    alert(
      `Successfully deleted ${successCount} deadline${
        successCount > 1 ? "s" : ""
      }!`
    );
  } else {
    alert(
      `Deleted ${successCount} deadline${
        successCount > 1 ? "s" : ""
      }. ${failCount} failed.`
    );
  }
}

async function handleBulkStatusChange(deadlineIds, newStatus) {
  // The confirmation already happened in the child component
  let successCount = 0;
  let failCount = 0;

  for (const id of deadlineIds) {
    try {
      await deadlineService.setStatus(id, newStatus);
      successCount++;

      // Update local state
      const deadline = deadlines.value.find((d) => d._id === id);
      if (deadline) {
        deadline.status = newStatus;
      }
    } catch (err) {
      console.error(`Failed to update status for deadline ${id}:`, err);
      failCount++;
    }
  }

  // Show result message
  const statusLabel = newStatus
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");

  if (failCount === 0) {
    alert(
      `Successfully changed ${successCount} deadline${
        successCount > 1 ? "s" : ""
      } to "${statusLabel}"!`
    );
  } else {
    alert(
      `Changed ${successCount} deadline${
        successCount > 1 ? "s" : ""
      } to "${statusLabel}". ${failCount} failed.`
    );
    // Reload to reset any failed updates
    await loadData();
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

async function handleDeadlineCreated(deadlineData) {
  try {
    if (!selectedCourseForCreation.value) {
      alert("Please select a course for this deadline.");
      return;
    }

    await deadlineService.createDeadline(
      selectedCourseForCreation.value,
      deadlineData.title,
      deadlineData.due,
      deadlineData.source,
      authStore.userId
    );

    // Reload data to get proper course information populated
    await loadData();

    // Close form and reset
    resetCreateForm();
  } catch (err) {
    alert(err.message || "Failed to create deadline.");
  }
}

async function handleAIDeadlinesCreated(createdDeadlines) {
  // AI extractor already created the deadlines, just refresh the list
  resetCreateForm();
  await loadData();

  // Success! Deadlines are now visible in the list after reload
}

function resetCreateForm() {
  showCreateDeadline.value = false;
  selectedSource.value = null;
  selectedCourseForCreation.value = null;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-new-deadline {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--burgundy) 0%, #8b1538 100%);
  color: var(--white);
  border: 2px solid var(--black);
  border-radius: 4px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 3px 3px 0 var(--black);
  white-space: nowrap;
}

.btn-new-deadline:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--black);
}

.create-deadline-section {
  width: 100%;
  margin-bottom: 2rem;
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

.source-selector {
  background: var(--white);
  padding: 2rem;
  border-radius: 4px;
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 var(--black);
  margin-bottom: 2rem;
  width: 100%;
}

.source-selector h3 {
  font-family: "Cinzel", serif;
  color: var(--black);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.source-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.source-option {
  flex: 1;
  min-width: 150px;
  padding: 1.5rem;
  background: var(--white);
  border: 2px solid var(--black);
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 2px 2px 0 var(--black);
  text-align: center;
}

.source-option:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 var(--black);
  background-color: var(--light-gray);
}

.source-option.ai-option {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: var(--white);
}

.source-option.ai-option:hover {
  background: linear-gradient(135deg, #5568d3 0%, #663d8f 100%);
}

.source-option.disabled,
.source-option.disabled:hover {
  background: #f3f3f3;
  color: #999;
  cursor: not-allowed;
  box-shadow: 2px 2px 0 var(--black);
  transform: none;
}

.coming-soon {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border: 2px dashed var(--black);
  border-radius: 4px;
  background: #fdf7e3;
  text-align: center;
}

.coming-soon-text {
  font-size: 0.95rem;
  margin-bottom: 1rem;
  color: #555;
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
