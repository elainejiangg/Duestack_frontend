<template>
  <div class="deadline-list">
    <h2>Deadlines</h2>
    <div v-if="deadlines.length === 0" class="empty-state">
      <p>No deadlines yet. Create your first deadline!</p>
    </div>
    <div v-else class="deadlines-container">
      <div
        v-for="deadline in sortedDeadlines"
        :key="deadline._id"
        class="deadline-card"
        :class="{
          overdue: isOverdue(deadline.due),
          completed: (deadline.status || 'NOT_STARTED') === 'DONE',
        }"
      >
        <div class="deadline-header">
          <div class="deadline-info">
            <h3>{{ deadline.title }}</h3>
            <p class="deadline-date">
              📅 {{ formatDate(deadline.due) }}
              <span
                v-if="
                  isOverdue(deadline.due) &&
                  (deadline.status || 'NOT_STARTED') !== 'DONE'
                "
                class="overdue-badge"
              >
                Overdue
              </span>
            </p>
            <p class="deadline-meta">
              <span class="source-badge">{{ deadline.source }}</span>
            </p>
          </div>
          <button
            @click="$emit('delete-deadline', deadline._id)"
            class="btn-delete"
            title="Delete deadline"
          >
            ×
          </button>
        </div>
        <div class="deadline-actions">
          <select
            :value="deadline.status || 'NOT_STARTED'"
            @change="$emit('update-status', deadline._id, $event.target.value)"
            class="status-select"
            :class="`status-${(
              deadline.status || 'NOT_STARTED'
            ).toLowerCase()}`"
          >
            <option value="NOT_STARTED">Not Started</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  deadlines: {
    type: Array,
    required: true,
  },
});

defineEmits(["delete-deadline", "update-status"]);

const sortedDeadlines = computed(() => {
  return [...props.deadlines].sort((a, b) => {
    return new Date(a.due) - new Date(b.due);
  });
});

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function isOverdue(dueDate) {
  return new Date(dueDate) < new Date();
}
</script>

<style scoped>
.deadline-list {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #999;
}

.deadlines-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.deadline-card {
  background: #f9f9f9;
  border-left: 4px solid #42b983;
  border-radius: 6px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.deadline-card:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.deadline-card.overdue {
  border-left-color: #e74c3c;
  background: #fff5f5;
}

.deadline-card.completed {
  border-left-color: #95a5a6;
  opacity: 0.7;
}

.deadline-card.completed h3 {
  text-decoration: line-through;
  color: #95a5a6;
}

.deadline-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.deadline-info {
  flex: 1;
}

h3 {
  color: #2c3e50;
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
}

.deadline-date {
  color: #666;
  margin: 0.25rem 0;
  font-size: 0.95rem;
}

.overdue-badge {
  background-color: #e74c3c;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  margin-left: 0.5rem;
  font-weight: 600;
}

.deadline-meta {
  margin: 0.5rem 0 0 0;
}

.source-badge {
  background-color: #e0e0e0;
  color: #555;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.btn-delete {
  background: transparent;
  border: none;
  color: #e74c3c;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.btn-delete:hover {
  background-color: #fee;
}

.deadline-actions {
  display: flex;
  gap: 0.5rem;
}

.status-select {
  padding: 0.5rem 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.status-select:focus {
  outline: none;
  border-color: #42b983;
}

.status-not_started {
  background-color: #f0f0f0;
  color: #666;
}

.status-in_progress {
  background-color: #fff3cd;
  color: #856404;
  border-color: #ffc107;
}

.status-done {
  background-color: #d4edda;
  color: #155724;
  border-color: #28a745;
}
</style>
