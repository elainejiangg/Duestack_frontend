<template>
  <div class="all-deadlines-list">
    <!-- Filters and Sort -->
    <div v-if="deadlines.length > 0" class="filters-bar">
      <div class="filter-group">
        <label>Course:</label>
        <select v-model="selectedCourse" class="filter-select">
          <option value="all">All Courses</option>
          <option
            v-for="course in courses"
            :key="course._id"
            :value="course._id"
          >
            {{ course.courseCode }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>Status:</label>
        <select v-model="selectedStatus" class="filter-select">
          <option value="all">All Status</option>
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Time:</label>
        <select v-model="selectedTimeFilter" class="filter-select">
          <option value="all">All</option>
          <option value="overdue">Overdue</option>
          <option value="upcoming">Upcoming</option>
          <option value="this-week">This Week</option>
          <option value="this-month">This Month</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Sort:</label>
        <select v-model="sortOrder" class="filter-select">
          <option value="asc">Date: Earliest First</option>
          <option value="desc">Date: Latest First</option>
        </select>
      </div>

      <button @click="clearFilters" class="btn-clear-filters">
        Clear Filters
      </button>
    </div>

    <div v-if="deadlines.length === 0" class="empty-state">
      <p>No deadlines yet. Add courses and create deadlines to get started!</p>
    </div>
    <div
      v-else-if="filteredAndSortedDeadlines.length === 0"
      class="empty-state"
    >
      <p>No deadlines match your filters. Try adjusting your selections.</p>
    </div>
    <div v-else class="deadlines-container">
      <div
        v-for="deadline in filteredAndSortedDeadlines"
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
            <div class="course-badge">
              {{ getCourseDisplay(deadline.course) }}
            </div>
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
          <button @click="$emit('edit-deadline', deadline)" class="btn-edit">
            Edit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  deadlines: {
    type: Array,
    required: true,
  },
  courses: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["delete-deadline", "update-status", "edit-deadline"]);

// Filter state
const selectedCourse = ref("all");
const selectedStatus = ref("all");
const selectedTimeFilter = ref("all");
const sortOrder = ref("asc");

// Computed: Filtered and Sorted Deadlines
const filteredAndSortedDeadlines = computed(() => {
  let filtered = [...props.deadlines];

  // Filter by course
  if (selectedCourse.value !== "all") {
    filtered = filtered.filter((d) => d.course === selectedCourse.value);
  }

  // Filter by status
  if (selectedStatus.value !== "all") {
    filtered = filtered.filter(
      (d) => (d.status || "NOT_STARTED") === selectedStatus.value
    );
  }

  // Filter by time
  if (selectedTimeFilter.value !== "all") {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    filtered = filtered.filter((d) => {
      const dueDate = new Date(d.due);
      const isDone = (d.status || "NOT_STARTED") === "DONE";

      switch (selectedTimeFilter.value) {
        case "overdue":
          return dueDate < now && !isDone;
        case "upcoming":
          return dueDate >= now;
        case "this-week": {
          const weekFromNow = new Date(today);
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          return dueDate >= today && dueDate < weekFromNow;
        }
        case "this-month": {
          const monthFromNow = new Date(today);
          monthFromNow.setMonth(monthFromNow.getMonth() + 1);
          return dueDate >= today && dueDate < monthFromNow;
        }
        default:
          return true;
      }
    });
  }

  // Sort by completion status first (DONE goes to end)
  filtered.sort((a, b) => {
    const aIsDone = (a.status || "NOT_STARTED") === "DONE";
    const bIsDone = (b.status || "NOT_STARTED") === "DONE";

    if (aIsDone && !bIsDone) return 1;
    if (!aIsDone && bIsDone) return -1;

    // Then sort by due date based on sort order
    const dateA = new Date(a.due);
    const dateB = new Date(b.due);
    return sortOrder.value === "asc" ? dateA - dateB : dateB - dateA;
  });

  return filtered;
});

function clearFilters() {
  selectedCourse.value = "all";
  selectedStatus.value = "all";
  selectedTimeFilter.value = "all";
  sortOrder.value = "asc";
}

function getCourseDisplay(courseId) {
  const course = props.courses.find((c) => c._id === courseId);
  return course ? course.courseCode : "Unknown Course";
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
.all-deadlines-list {
  background: var(--white);
  padding: 2rem;
  border-radius: 4px;
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 var(--black);
  width: 100%;
  height: 1000px;
  overflow-y: auto;
}

h2 {
  color: var(--black);
  margin-bottom: 1.5rem;
  font-weight: 700;
  font-size: 1.8rem;
}

.filters-bar {
  background: var(--light-gray);
  padding: 1.5rem;
  border-radius: 4px;
  border: 2px solid var(--black);
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 150px;
}

.filter-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--black);
}

.filter-select {
  padding: 0.5rem;
  border: 2px solid var(--black);
  border-radius: 4px;
  background: var(--white);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: var(--burgundy);
  box-shadow: 0 0 0 2px rgba(118, 8, 6, 0.1);
}

.filter-select:hover {
  border-color: var(--burgundy);
}

.btn-clear-filters {
  padding: 0.5rem 1rem;
  background-color: var(--white);
  color: var(--black);
  border: 2px solid var(--black);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-clear-filters:hover {
  background-color: var(--burgundy);
  color: var(--white);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    width: 100%;
  }

  .btn-clear-filters {
    width: 100%;
  }
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
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .all-deadlines-list {
    padding: 1rem;
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

.course-badge {
  display: inline-block;
  background-color: var(--royal-blue);
  color: var(--white);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  border: 1px solid var(--black);
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
