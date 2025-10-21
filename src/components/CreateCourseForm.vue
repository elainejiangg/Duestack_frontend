<template>
  <div class="create-course-form">
    <h2>Create New Course</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="courseCode">Course Code</label>
        <input
          id="courseCode"
          v-model="formData.courseCode"
          type="text"
          required
          placeholder="e.g., 6.1040"
        />
      </div>
      <div class="form-group">
        <label for="title">Course Title</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          required
          placeholder="e.g., Software Design"
        />
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      <div class="form-actions">
        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? "Creating..." : "Create Course" }}
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
import { useAuthStore } from "@/stores/auth";
import { courseService } from "@/services/courseService";

const emit = defineEmits(["course-created", "cancel"]);

const authStore = useAuthStore();

const formData = ref({
  courseCode: "",
  title: "",
});

const loading = ref(false);
const error = ref(null);

async function handleSubmit() {
  loading.value = true;
  error.value = null;

  try {
    const result = await courseService.createCourse(
      authStore.userId,
      formData.value.courseCode,
      formData.value.title
    );

    // Emit event with the created course
    emit("course-created", result);

    // Reset form
    formData.value = {
      courseCode: "",
      title: "",
    };
  } catch (err) {
    error.value = err.message || "Failed to create course. Please try again.";
  } finally {
    loading.value = false;
  }
}

function cancel() {
  emit("cancel");
  formData.value = {
    courseCode: "",
    title: "",
  };
  error.value = null;
}
</script>

<style scoped>
.create-course-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
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

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #42b983;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #42b983;
  color: white;
  flex: 1;
}

.btn-primary:hover:not(:disabled) {
  background-color: #359268;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #555;
}

.btn-secondary:hover {
  background-color: #d0d0d0;
}
</style>
