<template>
  <div class="create-deadline-form">
    <h2>Create New Deadline</h2>
    <form @submit.prevent="handleSubmit">
      <!-- Course Selector (only shown when creating from All Deadlines) -->
      <div v-if="showCourseSelector" class="form-group">
        <label for="course">Course *</label>
        <select
          id="course"
          v-model="selectedCourse"
          required
          @change="emit('course-selected', selectedCourse)"
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
        <span v-if="validationErrors.course" class="field-error">{{
          validationErrors.course
        }}</span>
      </div>

      <div class="form-group">
        <label for="title">Title</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          required
          placeholder="e.g., Assignment 4: Backend MVP"
          @blur="validateTitle"
        />
        <span v-if="validationErrors.title" class="field-error">{{
          validationErrors.title
        }}</span>
      </div>
      <div class="form-group">
        <label for="due">Due Date & Time</label>
        <input
          id="due"
          v-model="formData.due"
          type="datetime-local"
          required
          @blur="validateDueDate"
        />
        <span v-if="validationErrors.due" class="field-error">{{
          validationErrors.due
        }}</span>
      </div>
      <!-- Source is now pre-selected, no dropdown needed -->
      <div v-if="!source" class="form-group">
        <label for="source">Source</label>
        <select id="source" v-model="formData.source" required>
          <option value="MANUAL">Manual Entry</option>
          <option value="WEBSITE">Website</option>
          <option value="CANVAS">Canvas</option>
        </select>
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div class="form-actions">
        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? "Creating..." : "Create Deadline" }}
        </button>
        <button type="button" @click="cancel" class="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  courseId: {
    type: String,
    default: null, // Not required when showCourseSelector is true
  },
  userId: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    default: null, // If not provided, user can select from dropdown
  },
  courses: {
    type: Array,
    default: () => [], // List of all courses for the dropdown
  },
  showCourseSelector: {
    type: Boolean,
    default: false, // Show course selector when creating from All Deadlines
  },
});

const emit = defineEmits(["deadline-created", "cancel", "course-selected"]);

const selectedCourse = ref(props.courseId || "");
const formData = ref({
  title: "",
  due: "",
  source: props.source || "MANUAL", // Use provided source or default to MANUAL
});

const loading = ref(false);
const error = ref(null);
const validationErrors = ref({
  course: null,
  title: null,
  due: null,
});

function validateTitle() {
  if (!formData.value.title) {
    validationErrors.value.title = "Title is required";
  } else if (formData.value.title.length < 3) {
    validationErrors.value.title = "Title must be at least 3 characters";
  } else {
    validationErrors.value.title = null;
  }
}

function validateDueDate() {
  if (!formData.value.due) {
    validationErrors.value.due = "Due date is required";
  } else {
    const selectedDate = new Date(formData.value.due);
    const now = new Date();

    // Allow dates from the past only if they're within 24 hours (for flexibility)
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (selectedDate < twentyFourHoursAgo) {
      validationErrors.value.due =
        "Due date cannot be more than 24 hours in the past";
    } else {
      validationErrors.value.due = null;
    }
  }
}

function validateCourse() {
  if (props.showCourseSelector && !selectedCourse.value) {
    validationErrors.value.course = "Please select a course";
    return false;
  }
  validationErrors.value.course = null;
  return true;
}

function validateForm() {
  let isValid = true;

  if (props.showCourseSelector) {
    isValid = validateCourse() && isValid;
  }

  validateTitle();
  validateDueDate();

  return (
    isValid && !validationErrors.value.title && !validationErrors.value.due
  );
}

async function handleSubmit() {
  if (!validateForm()) {
    error.value = "Please fix the errors above before submitting";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // Emit event with deadline data
    emit("deadline-created", {
      title: formData.value.title,
      due: formData.value.due,
      source: formData.value.source,
    });

    // Reset form
    formData.value = {
      title: "",
      due: "",
      source: "MANUAL",
    };
  } catch (err) {
    error.value = err.message || "Failed to create deadline.";
  } finally {
    loading.value = false;
  }
}

function cancel() {
  emit("cancel");
  formData.value = {
    title: "",
    due: "",
    source: "MANUAL",
  };
  error.value = null;
}
</script>

<style scoped>
.create-deadline-form {
  background: var(--white);
  padding: 2rem;
  border-radius: 4px;
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 var(--black);
  margin-bottom: 2rem;
  width: 100%;
}

h2 {
  color: var(--black);
  margin-bottom: 1.5rem;
  font-weight: 700;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--burgundy);
  border-width: 2px;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.field-error {
  display: block;
  color: #c33;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
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
  flex: 1;
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
</style>
