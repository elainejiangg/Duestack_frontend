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
          'in-progress': (deadline.status || 'NOT_STARTED') === 'IN_PROGRESS',
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
              <span class="source-badge" :title="getSourceTooltip(deadline)">
                {{ formatSource(deadline.source) }}
              </span>
              <a
                v-if="deadline.source === 'LLM_PARSED' && deadline.websiteUrl"
                @click.prevent="showDocuments(deadline)"
                href="#"
                class="doc-link"
                title="View source documents"
              >
                📄
              </a>
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
          <button @click="$emit('edit-deadline', deadline)" class="btn-edit">
            Edit
          </button>
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

defineEmits(["delete-deadline", "update-status", "edit-deadline"]);

const sortedDeadlines = computed(() => {
  return [...props.deadlines].sort((a, b) => {
    // First, sort by completion status (DONE goes to end)
    const aIsDone = (a.status || "NOT_STARTED") === "DONE";
    const bIsDone = (b.status || "NOT_STARTED") === "DONE";

    if (aIsDone && !bIsDone) return 1; // a is done, b is not -> a goes after b
    if (!aIsDone && bIsDone) return -1; // b is done, a is not -> a goes before b

    // If both have same completion status, sort by due date
    return new Date(a.due) - new Date(b.due);
  });
});

// Helper functions for source display
function formatSource(source) {
  if (source === "LLM_PARSED") {
    return "AI-PARSED";
  }
  return source;
}

function getSourceTooltip(deadline) {
  if (deadline.source === "LLM_PARSED" && deadline.websiteUrl) {
    return `Extracted from: ${deadline.websiteUrl}`;
  }
  return "";
}

function showDocuments(deadline) {
  if (!deadline.websiteUrl) return;

  const urls = deadline.websiteUrl.split(", ").filter((url) => url.trim());

  if (urls.length === 1) {
    // Single document - open directly
    window.open(urls[0], "_blank");
  } else {
    // Multiple documents - show alert with clickable links
    const urlList = urls.map((url, i) => `${i + 1}. ${url}`).join("\n");
    const message = `Source Documents (${urls.length}):\n\n${urlList}\n\nClick OK to open all documents in new tabs.`;

    if (confirm(message)) {
      urls.forEach((url) => window.open(url, "_blank"));
    }
  }
}

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
  background: var(--white);
  padding: 2rem;
  border-radius: 4px;
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 var(--black);
  width: 100%;
}

h2 {
  color: var(--black);
  margin-bottom: 1.5rem;
  font-weight: 700;
  font-size: 1.8rem;
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
  align-items: center;
}

.deadline-card {
  background: var(--white);
  border-left: 5px solid var(--burgundy);
  border: 2px solid var(--black);
  border-left-width: 5px;
  border-left-color: var(--burgundy);
  border-radius: 4px;
  padding: 1.5rem;
  transition: transform 0.1s, box-shadow 0.1s;
  box-shadow: 3px 3px 0 var(--black);
  width: 100%;
  max-width: 700px;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .deadline-list {
    max-width: 100%;
    padding: 1rem;
  }

  .deadline-card {
    max-width: 100%;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .deadline-list {
    max-width: 750px;
  }

  .deadline-card {
    max-width: 600px;
  }
}

@media (min-width: 1025px) {
  .deadline-list {
    max-width: 900px;
  }

  .deadline-card {
    max-width: 700px;
  }
}

.deadline-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--black);
}

.deadline-card.overdue {
  border-left-color: var(--royal-blue);
  background: #f5f5ff;
}

.deadline-card.completed {
  border-left-color: #666;
  opacity: 0.6;
}

.deadline-card.in-progress {
  border-left-color: var(--yellow);
}

.deadline-card.completed h3 {
  text-decoration: line-through;
  color: #666;
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
  color: var(--black);
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.deadline-date {
  color: #666;
  margin: 0.25rem 0;
  font-size: 0.95rem;
}

.overdue-badge {
  background-color: var(--royal-blue);
  color: var(--white);
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
  border: 1px solid var(--black);
  font-size: 0.75rem;
  margin-left: 0.5rem;
  font-weight: 700;
}

.deadline-meta {
  margin: 0.5rem 0 0 0;
}

.source-badge {
  background-color: var(--light-gray);
  color: var(--black);
  padding: 0.2rem 0.6rem;
  border-radius: 2px;
  border: 1px solid var(--black);
  font-size: 0.75rem;
  font-weight: 700;
}

.doc-link {
  display: inline-block;
  margin-left: 0.4rem;
  font-size: 1rem;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.doc-link:hover {
  transform: scale(1.2);
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
  align-items: center;
}

.status-select {
  padding: 0.5rem 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 150px;
  max-width: 200px;
}

.btn-edit {
  padding: 0.5rem 1rem;
  background-color: var(--white);
  color: var(--black);
  border: 2px solid var(--black);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
  margin-left: auto;
}

.btn-edit:hover {
  background-color: var(--light-gray);
  transform: translateY(-1px);
}

.status-select:focus {
  outline: none;
  border-color: var(--burgundy);
  border-width: 2px;
}

.status-not_started {
  background-color: #f0f0f0;
  color: #666;
  border-color: var(--burgundy);
}

.status-in_progress {
  background-color: #fff3cd;
  color: #856404;
  border-color: var(--yellow);
}

.status-done {
  background-color: #d4edda;
  color: #155724;
  border-color: #666;
}

.status-select:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-not_started:hover {
  border-color: var(--burgundy);
}

.status-in_progress:hover {
  border-color: var(--yellow);
}

.status-done:hover {
  border-color: #666;
}
</style>
