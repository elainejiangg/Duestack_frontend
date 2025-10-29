<template>
  <div class="ai-extractor">
    <h3>
      {{
        isWebsiteMode ? "🌐 AI Website Extraction" : "🤖 AI Document Extraction"
      }}
    </h3>
    <p class="subtitle">
      {{
        isWebsiteMode
          ? "Enter a course website URL to automatically extract deadlines"
          : "Share Google Drive links to automatically extract deadlines from documents"
      }}
    </p>

    <!-- Step 1: Google Drive Link Input -->
    <div v-if="step === 'input'" class="input-step">
      <!-- Course Selector (only shown when creating from All Deadlines) -->
      <div v-if="showCourseSelector" class="form-group">
        <label for="course">Course *</label>
        <select
          id="course"
          v-model="selectedCourse"
          required
          @change="$emit('course-selected', selectedCourse)"
          class="course-select"
        >
          <option value="">Select a course...</option>
          <option
            v-for="course in courses"
            :key="course._id"
            :value="course._id"
          >
            {{ course.courseCode }} - {{ course.title }}
          </option>
        </select>
      </div>
      <div v-if="!isWebsiteMode" class="url-inputs">
        <div
          v-for="(url, index) in pdfUrls"
          :key="index"
          class="url-input-group"
        >
          <input
            v-model="pdfUrls[index]"
            type="url"
            placeholder="https://drive.google.com/file/d/FILE_ID/view"
            class="url-input"
            @blur="validateUrl(index)"
          />
          <button
            v-if="pdfUrls.length > 1"
            @click="removePdfUrl(index)"
            class="btn-remove"
          >
            ✕
          </button>
        </div>
      </div>
      <div v-else class="website-input-group">
        <input
          v-model="websiteUrl"
          type="url"
          placeholder="https://example.edu/course/schedule"
          class="url-input"
          @blur="validateWebsiteUrl"
        />
        <p class="helper-text">
          Provide a public course webpage that lists assignment or exam dates.
        </p>
      </div>

      <button v-if="!isWebsiteMode" @click="addPdfUrl" class="btn-add-url">
        + Add Another Document
      </button>

      <!-- Custom Prompt Section -->
      <div class="form-group">
        <label for="custom-prompt">Custom Instructions (Optional)</label>
        <textarea
          id="custom-prompt"
          v-model="customPrompt"
          placeholder="Add specific instructions for the AI extraction. For example: 'Focus on homework assignments only, ignore reading assignments' or 'Extract deadlines for the Spring 2025 semester only'"
          class="custom-prompt-textarea"
          rows="3"
        ></textarea>
        <p class="prompt-help">
          💭 <strong>Tip:</strong> Be specific about what deadlines to extract,
          any formatting preferences, or semester/year details.
        </p>
      </div>

      <div class="info-box">
        <template v-if="!isWebsiteMode">
          <p>
            💡 <strong>Supported:</strong> PDFs, images (JPG, PNG, GIF), and
            documents from <strong>Google Drive</strong>
          </p>
          <p style="margin-top: 0.5rem">
            📂 <strong>Tip:</strong> Upload multiple documents for better
            results! The AI can cross-reference information across files.
          </p>
          <p style="margin-top: 0.5rem; font-size: 0.85rem; color: #666">
            ℹ️ Make sure files are set to "Anyone with the link can view"
          </p>
        </template>
        <template v-else>
          <p>
            🌐 <strong>Supported:</strong> Public course pages, schedules, or
            syllabus sections accessible without authentication.
          </p>
          <p style="margin-top: 0.5rem">
            📌 <strong>Tip:</strong> Pick the page that clearly lists deadlines
            or calendar entries for the class.
          </p>
          <p style="margin-top: 0.5rem; font-size: 0.85rem; color: #666">
            ℹ️ Pages behind logins or interactive dashboards may not be
            accessible.
          </p>
        </template>
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>

      <div class="actions">
        <button @click="$emit('cancel')" class="btn-secondary">Cancel</button>
        <button
          @click="extractDeadlines"
          :disabled="loading || !hasValidUrls"
          class="btn-primary"
        >
          {{ loading ? "Extracting..." : "Extract Deadlines" }}
        </button>
      </div>
    </div>

    <!-- Step 2: Review & Confirm Suggestions -->
    <div v-if="step === 'review'" class="review-step">
      <div v-if="suggestions.length === 0" class="no-suggestions">
        <p>
          😕 No deadlines found in the provided
          {{ isWebsiteMode ? "website" : "documents" }}.
        </p>
        <button @click="reset" class="btn-primary">Try Again</button>
      </div>

      <div v-else>
        <div class="review-header">
          <p class="suggestions-count">
            Found <strong>{{ suggestions.length }}</strong> deadline{{
              suggestions.length !== 1 ? "s" : ""
            }}
          </p>

          <!-- AI Refinement Section -->
          <div class="ai-refinement-section">
            <h4>🤖 AI Refinement</h4>
            <p class="refinement-description">
              Re-extract deadlines from the same
              {{ isWebsiteMode ? "website" : "documents" }} with additional
              refinement instructions
            </p>
            <div class="refinement-input-group">
              <textarea
                v-model="refinementPrompt"
                placeholder="e.g., 'Only extract psets. Reformat names to PSET # DUE' or 'Change all dates to EST timezone'"
                class="refinement-textarea"
                rows="2"
              ></textarea>
              <button
                @click="refineSuggestions"
                :disabled="refining || !refinementPrompt.trim()"
                class="btn-refine"
              >
                {{ refining ? "Refining..." : "Refine" }}
              </button>
            </div>
          </div>
        </div>

        <div class="suggestions-list">
          <div
            v-for="suggestion in suggestions"
            :key="suggestion._id"
            class="suggestion-card"
            :class="{
              'low-confidence': suggestion.confidence < 0.5,
              selected: selectedSuggestions.includes(suggestion._id),
            }"
          >
            <div class="suggestion-header">
              <input
                type="checkbox"
                :checked="selectedSuggestions.includes(suggestion._id)"
                @change="toggleSuggestion(suggestion._id)"
                class="suggestion-checkbox"
              />
              <h4>{{ suggestion.title }}</h4>
              <span
                class="confidence-badge"
                :class="getConfidenceClass(suggestion.confidence)"
              >
                {{ Math.round(suggestion.confidence * 100) }}% confident
              </span>
            </div>

            <div class="suggestion-details">
              <p class="due-date">📅 {{ formatDate(suggestion.due) }}</p>
              <p class="provenance">📍 {{ suggestion.provenance }}</p>
              <div
                v-if="suggestion.warnings && suggestion.warnings.length > 0"
                class="warnings"
              >
                <span
                  v-for="(warning, index) in suggestion.warnings"
                  :key="index"
                  class="warning-badge"
                >
                  ⚠️ {{ warning }}
                </span>
              </div>
            </div>

            <div class="suggestion-actions">
              <button
                @click="editSuggestion(suggestion)"
                class="btn-edit-suggestion"
              >
                Edit
              </button>
            </div>
          </div>
        </div>

        <div class="bulk-actions">
          <button @click="selectAll" class="btn-secondary">Select All</button>
          <button @click="deselectAll" class="btn-secondary">
            Deselect All
          </button>
        </div>

        <div v-if="confirmError" class="error-message">
          {{ confirmError }}
        </div>

        <div class="actions">
          <button @click="reset" class="btn-secondary">Start Over</button>
          <button
            @click="confirmSelected"
            :disabled="selectedSuggestions.length === 0 || confirming"
            class="btn-primary"
          >
            {{
              confirming
                ? "Confirming..."
                : `Confirm ${selectedSuggestions.length} Deadline${
                    selectedSuggestions.length !== 1 ? "s" : ""
                  }`
            }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Suggestion Modal -->
    <div v-if="editingsuggestion" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <h3>Edit Suggestion</h3>
        <div class="form-group">
          <label>Title</label>
          <input v-model="editForm.title" type="text" class="form-input" />
        </div>
        <div class="form-group">
          <label>Due Date & Time</label>
          <input
            v-model="editForm.due"
            type="datetime-local"
            class="form-input"
          />
        </div>
        <div class="modal-actions">
          <button @click="closeEditModal" class="btn-secondary">Cancel</button>
          <button @click="saveEdit" class="btn-primary">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { aiExtractionService } from "@/services/aiExtractionService";
import { deadlineService } from "@/services/deadlineService";

const props = defineProps({
  courseId: {
    type: String,
    default: null, // Not required when showCourseSelector is true
  },
  courses: {
    type: Array,
    default: () => [], // List of all courses for the dropdown
  },
  showCourseSelector: {
    type: Boolean,
    default: false, // Show course selector when creating from All Deadlines
  },
  source: {
    type: String,
    default: "AI_PARSED",
  },
});

const emit = defineEmits(["deadlines-created", "cancel", "course-selected"]);

const authStore = useAuthStore();

const step = ref("input"); // 'input' or 'review'
const selectedCourse = ref(props.courseId || "");
const pdfUrls = ref([""]);
const websiteUrl = ref("");
const customPrompt = ref("");
const refinementPrompt = ref("");
const loading = ref(false);
const refining = ref(false);
const error = ref(null);
const suggestions = ref([]);
const selectedSuggestions = ref([]);
const confirming = ref(false);
const confirmError = ref(null);
const editingsuggestion = ref(null);
const editForm = ref({ title: "", due: "" });

const isWebsiteMode = computed(() => {
  console.log("🔍 AIDeadlineExtractor - source prop:", props.source);
  return props.source === "WEBSITE";
});

const hasValidUrls = computed(() => {
  if (isWebsiteMode.value) {
    return websiteUrl.value.trim().startsWith("http");
  }
  return pdfUrls.value.some((url) => url.trim().startsWith("http"));
});

// Helper function to format date without timezone conversion
// Preserves the local time from the backend (e.g., 23:59 stays 23:59)
function formatDateForInput(dateString) {
  const date = new Date(dateString);

  // Get local components (this respects the timezone offset in the ISO string)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Return in datetime-local format: YYYY-MM-DDTHH:mm
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function addPdfUrl() {
  pdfUrls.value.push("");
}

function removePdfUrl(index) {
  pdfUrls.value.splice(index, 1);
}

function validateUrl(index) {
  if (isWebsiteMode.value) {
    return;
  }
  const url = pdfUrls.value[index];
  if (url && !url.startsWith("http")) {
    error.value =
      "Please enter a valid Google Drive link starting with https://";
  } else if (url && !url.includes("drive.google.com")) {
    error.value =
      "Please use Google Drive links only. Make sure the file is set to 'Anyone with the link can view'.";
  } else {
    error.value = null;
  }
}

function validateWebsiteUrl() {
  const url = websiteUrl.value.trim();
  if (url && !url.startsWith("http")) {
    error.value = "Please enter a valid website link starting with https://";
  } else {
    error.value = null;
  }
}

async function extractDeadlines() {
  loading.value = true;
  error.value = null;

  try {
    // Validate course selection if required
    if (props.showCourseSelector && !selectedCourse.value) {
      error.value = "Please select a course first";
      loading.value = false;
      return;
    }

    // Use selected course or provided courseId
    const courseIdToUse = props.showCourseSelector
      ? selectedCourse.value
      : props.courseId;

    console.log("🔧 Component custom prompt value:", customPrompt.value);
    console.log(
      "🔧 Component custom prompt trimmed:",
      customPrompt.value.trim()
    );

    let result;
    if (isWebsiteMode.value) {
      const urlToUse = websiteUrl.value.trim();
      if (!urlToUse) {
        error.value = "Please enter a website URL";
        return;
      }
      if (!urlToUse.startsWith("http")) {
        error.value = "Website URL must start with http or https";
        return;
      }

      result = await aiExtractionService.extractFromWebsite(
        authStore.userId,
        courseIdToUse,
        urlToUse,
        customPrompt.value.trim() || undefined
      );
    } else {
      const validUrls = pdfUrls.value.filter((url) => url.trim());

      if (validUrls.length === 0) {
        error.value = "Please enter at least one Google Drive link";
        return;
      }

      const invalidUrls = validUrls.filter(
        (url) => !url.includes("drive.google.com")
      );
      if (invalidUrls.length > 0) {
        error.value =
          "Please use only Google Drive links. Make sure files are shared with 'Anyone with the link can view'.";
        return;
      }

      result = await aiExtractionService.extractFromPDFs(
        authStore.userId,
        courseIdToUse,
        validUrls,
        customPrompt.value.trim() || undefined // Pass custom prompt if provided
      );
    }

    if (result.error) {
      error.value = result.error;
      return;
    }

    // Fetch full suggestion details
    const allSuggestions = await aiExtractionService.getAllSuggestions(
      authStore.userId
    );

    console.log("🔧 All suggestions response:", allSuggestions);
    console.log("🔧 Result suggestions IDs:", result.suggestions);

    // Filter to only the suggestions we just created
    if (!allSuggestions || !allSuggestions.suggestions) {
      throw new Error("Failed to fetch suggestion details from server");
    }

    suggestions.value = allSuggestions.suggestions
      .filter((s) => result.suggestions.includes(s._id))
      .map((s) => ({
        ...s,
        due: formatDateForInput(s.due), // Format for datetime-local input
      }));

    // Pre-select high-confidence suggestions
    selectedSuggestions.value = suggestions.value
      .filter((s) => s.confidence >= 0.7)
      .map((s) => s._id);

    // Pre-fill refinement prompt with the original custom prompt if provided
    if (customPrompt.value && customPrompt.value.trim()) {
      refinementPrompt.value = customPrompt.value.trim();
    }

    step.value = "review";
  } catch (err) {
    console.error("Extraction error:", err);
    error.value =
      err.message || "Failed to extract deadlines. Please try again.";
  } finally {
    loading.value = false;
  }
}

function toggleSuggestion(id) {
  const index = selectedSuggestions.value.indexOf(id);
  if (index > -1) {
    selectedSuggestions.value.splice(index, 1);
  } else {
    selectedSuggestions.value.push(id);
  }
}

function selectAll() {
  selectedSuggestions.value = suggestions.value.map((s) => s._id);
}

function deselectAll() {
  selectedSuggestions.value = [];
}

async function confirmSelected() {
  confirming.value = true;
  confirmError.value = null;

  try {
    const createdDeadlines = [];

    // Use selectedCourse if available, otherwise use props.courseId
    const courseToUse = selectedCourse.value || props.courseId;

    if (!courseToUse) {
      confirmError.value =
        "Please select a course before confirming deadlines.";
      confirming.value = false;
      return;
    }

    for (const suggestionId of selectedSuggestions.value) {
      console.log(
        `🔍 Confirming suggestion ${suggestionId} for course ${courseToUse}`
      );

      // Confirm the suggestion
      const confirmResult = await aiExtractionService.confirmSuggestion(
        suggestionId,
        courseToUse,
        authStore.userId
      );

      console.log(`✅ Confirm result:`, confirmResult);

      if (confirmResult.error) {
        console.error(
          `Failed to confirm suggestion ${suggestionId}:`,
          confirmResult.error
        );
        continue;
      }

      // Create the actual deadline
      console.log(`📝 Creating deadline with:`, {
        course: confirmResult.course,
        title: confirmResult.title,
        due: confirmResult.due,
        source: confirmResult.source,
        addedBy: confirmResult.addedBy,
      });

      const deadlineResult = await deadlineService.createDeadline(
        confirmResult.course,
        confirmResult.title,
        confirmResult.due,
        confirmResult.source,
        confirmResult.addedBy,
        confirmResult.websiteUrl // Pass document URLs
      );

      console.log(`✅ Deadline created:`, deadlineResult);

      if (deadlineResult._id) {
        createdDeadlines.push(deadlineResult);
      } else {
        console.error(`❌ No deadline ID in result:`, deadlineResult);
      }
    }

    emit("deadlines-created", createdDeadlines);
    reset();
  } catch (err) {
    console.error("Confirmation error:", err);
    confirmError.value =
      err.message || "Failed to confirm deadlines. Please try again.";
  } finally {
    confirming.value = false;
  }
}

function editSuggestion(suggestion) {
  editingsuggestion.value = suggestion;
  editForm.value = {
    title: suggestion.title,
    due: formatDateForInput(suggestion.due),
  };
}

function closeEditModal() {
  editingsuggestion.value = null;
}

async function saveEdit() {
  try {
    await aiExtractionService.editSuggestion(
      editingsuggestion.value._id,
      editForm.value.title,
      new Date(editForm.value.due)
    );

    // Update local state
    const index = suggestions.value.findIndex(
      (s) => s._id === editingsuggestion.value._id
    );
    if (index > -1) {
      suggestions.value[index].title = editForm.value.title;
      suggestions.value[index].due = new Date(editForm.value.due);
    }

    closeEditModal();
  } catch (err) {
    console.error("Edit error:", err);
    alert("Failed to edit suggestion");
  }
}

function reset() {
  step.value = "input";
  pdfUrls.value = [""];
  websiteUrl.value = "";
  suggestions.value = [];
  selectedSuggestions.value = [];
  customPrompt.value = "";
  refinementPrompt.value = "";
  error.value = null;
  confirmError.value = null;
}

async function refineSuggestions() {
  if (!refinementPrompt.value.trim()) return;

  refining.value = true;
  error.value = null;

  try {
    console.log("🔧 Refining suggestions with prompt:", refinementPrompt.value);
    console.log("🔧 Current suggestions:", suggestions.value);

    // Call the refinement API
    const response = await aiExtractionService.refineSuggestions(
      authStore.userId,
      suggestions.value,
      refinementPrompt.value.trim()
    );

    console.log("🔧 Refinement API response:", response);

    if (response.error) {
      console.error("❌ Refinement error from backend:", response.error);
      error.value = response.error;
      return;
    }

    // Reload ALL suggestions to get updated data
    const allSuggestions = await aiExtractionService.getAllSuggestions(
      authStore.userId
    );

    console.log("🔧 All suggestions after reload:", allSuggestions);
    console.log("🔧 Refined suggestion IDs:", response.suggestions);

    // ONLY show the newly refined suggestions (not all unconfirmed suggestions)
    suggestions.value = allSuggestions.suggestions
      .filter((s) => response.suggestions.includes(s._id))
      .map((s) => ({
        ...s,
        due: formatDateForInput(s.due),
      }));

    // Pre-select high-confidence refined suggestions
    selectedSuggestions.value = suggestions.value
      .filter((s) => s.confidence >= 0.7)
      .map((s) => s._id);

    console.log("✅ Suggestions updated:", suggestions.value);
  } catch (err) {
    console.error("❌ Refinement exception:", err);
    error.value = err.message || "Failed to refine suggestions.";
  } finally {
    refining.value = false;
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function getConfidenceClass(confidence) {
  if (confidence >= 0.8) return "high";
  if (confidence >= 0.5) return "medium";
  return "low";
}
</script>

<style scoped>
.ai-extractor {
  background: var(--white);
  padding: 2rem;
  border-radius: 4px;
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 var(--black);
  margin-bottom: 2rem;
}

h3 {
  font-family: "Cinzel", serif;
  color: var(--black);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--black);
}

.course-select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s;
  background-color: var(--white);
}

.course-select:focus {
  outline: none;
  border-color: var(--burgundy);
}

.url-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.url-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.url-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.url-input:focus {
  outline: none;
  border-color: var(--burgundy);
}

.btn-remove {
  padding: 0.5rem 0.75rem;
  background: #fee;
  color: #c33;
  border: 2px solid #c33;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #fdd;
}

.btn-add-url {
  align-self: flex-start;
  padding: 0.5rem 1rem;
  background: var(--light-gray);
  border: 2px solid var(--black);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  margin-bottom: 1rem;
}

.btn-add-url:hover {
  background: #e0e0e0;
}

.website-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.helper-text {
  font-size: 0.85rem;
  color: #666;
}

.info-box {
  background: #f0f8ff;
  border: 2px solid var(--royal-blue);
  border-radius: 4px;
  padding: 1rem;
  margin: 1rem 0;
}

.info-box p {
  margin: 0;
  font-size: 0.9rem;
  color: #333;
}

.suggestions-count {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--black);
}

.suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  max-height: 400px;
  overflow-y: auto;
}

.suggestion-card {
  background: var(--white);
  padding: 1.5rem;
  border-radius: 4px;
  border: 2px solid #ddd;
  transition: all 0.2s;
}

.suggestion-card.selected {
  border-color: var(--burgundy);
  background: #fff8f8;
}

.suggestion-card.low-confidence {
  opacity: 0.7;
}

.suggestion-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.suggestion-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.suggestion-header h4 {
  flex: 1;
  margin: 0;
  font-size: 1.1rem;
  color: var(--black);
}

.confidence-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

.confidence-badge.high {
  background: #d4edda;
  color: #155724;
}

.confidence-badge.medium {
  background: #fff3cd;
  color: #856404;
}

.confidence-badge.low {
  background: #f8d7da;
  color: #721c24;
}

.suggestion-details {
  margin-left: 2.5rem;
}

.due-date {
  font-weight: 600;
  color: var(--black);
  margin-bottom: 0.5rem;
}

.provenance {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.warnings {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.warning-badge {
  background: #fff3cd;
  color: #856404;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.suggestion-actions {
  margin-top: 1rem;
  margin-left: 2.5rem;
}

.btn-edit-suggestion {
  padding: 0.4rem 0.8rem;
  background: var(--white);
  border: 2px solid var(--black);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-edit-suggestion:hover {
  background: var(--light-gray);
}

.bulk-actions {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--black);
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.1s;
}

.btn-primary {
  background-color: var(--burgundy);
  color: var(--white);
  box-shadow: 2px 2px 0 var(--black);
}

.btn-primary:hover:not(:disabled) {
  background-color: #5a0504;
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 var(--black);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background-color: var(--white);
  color: var(--black);
}

.btn-secondary:hover {
  background-color: var(--light-gray);
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 4px;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.no-suggestions {
  text-align: center;
  padding: 2rem;
}

.no-suggestions p {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  color: #666;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--white);
  padding: 2rem;
  border-radius: 4px;
  border: 2px solid var(--black);
  box-shadow: 6px 6px 0 var(--black);
  width: 90%;
  max-width: 500px;
}

.modal-content h3 {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

.form-input:focus {
  outline: none;
  border-color: var(--burgundy);
}

.custom-prompt-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;
}

.custom-prompt-textarea:focus {
  outline: none;
  border-color: var(--burgundy);
}

.prompt-help {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #666;
  font-style: italic;
}

.review-header {
  margin-bottom: 2rem;
}

.ai-refinement-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 1.5rem;
  border-radius: 4px;
  border: 2px solid var(--black);
  margin-top: 1rem;
}

.ai-refinement-section h4 {
  margin: 0 0 0.5rem 0;
  color: var(--black);
  font-size: 1.1rem;
  font-weight: 700;
}

.refinement-description {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.9rem;
}

.refinement-input-group {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.refinement-textarea {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  min-height: 60px;
  transition: border-color 0.2s;
}

.refinement-textarea:focus {
  outline: none;
  border-color: var(--burgundy);
}

.btn-refine {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: var(--white);
  border: 2px solid var(--black);
  border-radius: 4px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 2px 2px 0 var(--black);
  white-space: nowrap;
}

.btn-refine:hover:not(:disabled) {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0 var(--black);
}

.btn-refine:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}
</style>
