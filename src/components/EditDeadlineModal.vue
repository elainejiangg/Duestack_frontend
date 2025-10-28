<template>
  <div v-if="show" class="modal-overlay" @click.self="cancel">
    <div class="modal-card">
      <div class="modal-header">
        <h2 class="cinzel-title">Edit Deadline</h2>
        <button @click="cancel" class="btn-close" title="Close">×</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Title</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            placeholder="e.g., Assignment 4: Backend MVP"
            :disabled="loading"
          />
        </div>
        <div class="form-group">
          <label for="due">Due Date & Time</label>
          <input
            id="due"
            v-model="formData.due"
            type="datetime-local"
            required
            :disabled="loading"
          />
        </div>
        <div class="form-group">
          <label for="source">Source</label>
          <select
            id="source"
            v-model="formData.source"
            required
            :disabled="loading"
          >
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
            {{ loading ? "Saving..." : "Save Changes" }}
          </button>
          <button
            type="button"
            @click="cancel"
            class="btn-secondary"
            :disabled="loading"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  deadline: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "save"]);

const formData = ref({
  title: "",
  due: "",
  source: "MANUAL",
});

const loading = ref(false);
const error = ref(null);

// Watch for deadline prop changes to populate form
watch(
  () => props.deadline,
  (newDeadline) => {
    if (newDeadline) {
      // Convert ISO date to datetime-local format
      const dueDate = new Date(newDeadline.due);
      const year = dueDate.getFullYear();
      const month = String(dueDate.getMonth() + 1).padStart(2, "0");
      const day = String(dueDate.getDate()).padStart(2, "0");
      const hours = String(dueDate.getHours()).padStart(2, "0");
      const minutes = String(dueDate.getMinutes()).padStart(2, "0");
      const datetimeLocal = `${year}-${month}-${day}T${hours}:${minutes}`;

      formData.value = {
        title: newDeadline.title,
        due: datetimeLocal,
        source: newDeadline.source,
      };
      error.value = null;
    }
  },
  { immediate: true }
);

async function handleSubmit() {
  loading.value = true;
  error.value = null;

  try {
    // Emit save event with deadline ID and updated data
    emit("save", {
      deadlineId: props.deadline._id,
      newTitle: formData.value.title,
      newDue: formData.value.due,
      newSource: formData.value.source,
    });
  } catch (err) {
    error.value = err.message || "Failed to update deadline.";
    loading.value = false;
  }
}

function cancel() {
  emit("close");
  error.value = null;
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-card {
  background: var(--white);
  padding: 2rem;
  border-radius: 4px;
  border: 2px solid var(--black);
  box-shadow: 8px 8px 0 var(--black);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h2 {
  color: var(--black);
  font-size: 1.8rem;
  margin: 0;
}

.btn-close {
  background: transparent;
  border: none;
  color: var(--black);
  font-size: 2.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
  font-weight: 700;
}

.btn-close:hover {
  background-color: var(--light-gray);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 600;
}

input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
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

input:disabled,
select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  border: 2px solid #c33;
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

.btn-secondary:hover:not(:disabled) {
  background-color: var(--light-gray);
}

.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
