<template>
  <div class="create-deadline-form">
    <h2>Create New Deadline</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          required
          placeholder="e.g., Assignment 4: Backend MVP"
        />
      </div>
      <div class="form-group">
        <label for="due">Due Date & Time</label>
        <input id="due" v-model="formData.due" type="datetime-local" required />
      </div>
      <div class="form-group">
        <label for="source">Source</label>
        <select id="source" v-model="formData.source" required>
          <option value="MANUAL">Manual Entry</option>
          <option value="SYLLABUS">Syllabus</option>
          <option value="WEBSITE">Website</option>
          <option value="CANVAS">Canvas</option>
          <option value="IMAGE">Image</option>
          <option value="LLM_PARSED">AI Parsed</option>
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
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["deadline-created", "cancel"]);

const formData = ref({
  title: "",
  due: "",
  source: "MANUAL",
});

const loading = ref(false);
const error = ref(null);

async function handleSubmit() {
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
