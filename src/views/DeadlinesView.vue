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
      <div class="header-actions">
        <button @click="toggleCreateForm" class="btn-toggle">
          {{ showCreateForm ? "Cancel" : "+ New Deadline" }}
        </button>
      </div>
    </div>

    <!-- Source Selection -->
    <div v-if="showCreateForm && !selectedSource" class="source-selector">
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
          @click="
            selectedSource = 'WEBSITE';
            console.log(
              '🔍 DeadlinesView - selectedSource set to:',
              selectedSource
            );
          "
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
        showCreateForm &&
        selectedSource &&
        ['AI_PARSED', 'WEBSITE'].includes(selectedSource)
      "
      :course-id="courseId"
      :source="selectedSource"
      @deadlines-created="handleAIDeadlinesCreated"
      @cancel="resetCreateForm"
    />

    <!-- Manual Deadline Creation -->
    <CreateDeadlineForm
      v-if="showCreateForm && selectedSource === 'MANUAL'"
      :course-id="courseId"
      :user-id="authStore.userId"
      :source="selectedSource"
      @deadline-created="handleDeadlineCreated"
      @cancel="resetCreateForm"
    />

    <div
      v-if="showCreateForm && selectedSource === 'CANVAS'"
      class="coming-soon"
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
import AIDeadlineExtractor from "@/components/AIDeadlineExtractor.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const courseId = route.params.courseId;
const course = ref(null);
const deadlines = ref([]);
const loading = ref(false);
const error = ref(null);
const showCreateForm = ref(false);
const selectedSource = ref(null); // 'MANUAL', 'AI_PARSED', 'WEBSITE', 'CANVAS'
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

async function handleAIDeadlinesCreated(createdDeadlines) {
  // AI extractor already created the deadlines, just refresh the list
  resetCreateForm();
  await loadDeadlines();

  // Success! Deadlines are now visible in the list after reload
}

function toggleCreateForm() {
  showCreateForm.value = !showCreateForm.value;
  if (!showCreateForm.value) {
    selectedSource.value = null;
  }
}

function resetCreateForm() {
  showCreateForm.value = false;
  selectedSource.value = null;
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
  align-items: start;
  margin-bottom: 2rem;
  width: 100%;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
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

.source-selector {
  background: var(--white);
  padding: 2rem;
  border-radius: 4px;
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 var(--black);
  margin-bottom: 2rem;
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
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .deadlines-view {
    max-width: 95vw;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .deadlines-view {
    max-width: 75vw;
  }
}

@media (min-width: 1025px) {
  .deadlines-view {
    max-width: 65vw;
    min-width: 700px;
  }
}
</style>
