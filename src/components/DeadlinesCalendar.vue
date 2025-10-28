<template>
  <div class="deadlines-calendar-container">
    <!-- Left side: Calendar and Legend -->
    <div class="calendar-section">
      <VCalendar
        :attributes="calendarAttributes"
        expanded
        borderless
        @dayclick="handleDayClick"
      />

      <!-- Legend -->
      <div class="calendar-legend">
        <div class="legend-item">
          <span class="legend-dot not-started-dot"></span>
          <span>Not Started</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot in-progress-dot"></span>
          <span>In Progress</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot completed-dot"></span>
          <span>Completed</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot overdue-dot"></span>
          <span>Overdue</span>
        </div>
      </div>
    </div>

    <!-- Right side: Selected day deadlines -->
    <div class="details-section">
      <div
        v-if="selectedDayDeadlines.length > 0"
        class="selected-day-deadlines"
      >
        <h3>{{ formatSelectedDate }}</h3>
        <div class="deadline-items">
          <div
            v-for="deadline in selectedDayDeadlines"
            :key="deadline._id"
            class="deadline-item"
            :class="{
              completed: (deadline.status || 'NOT_STARTED') === 'DONE',
              'in-progress':
                (deadline.status || 'NOT_STARTED') === 'IN_PROGRESS',
              'not-started':
                (deadline.status || 'NOT_STARTED') === 'NOT_STARTED' &&
                !isOverdue(deadline.due),
              overdue:
                isOverdue(deadline.due) &&
                (deadline.status || 'NOT_STARTED') !== 'DONE',
            }"
          >
            <div class="deadline-item-header">
              <span class="course-badge">{{
                getCourseDisplay(deadline.course)
              }}</span>
              <h4>{{ deadline.title }}</h4>
            </div>
            <p class="deadline-time">
              {{ formatTime(deadline.due) }}
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
            <div class="deadline-item-actions">
              <select
                :value="deadline.status || 'NOT_STARTED'"
                @change="
                  $emit('update-status', deadline._id, $event.target.value)
                "
                class="status-select"
                :class="{
                  'status-in-progress':
                    (deadline.status || 'NOT_STARTED') === 'IN_PROGRESS',
                  'status-done': (deadline.status || 'NOT_STARTED') === 'DONE',
                }"
              >
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
              <button
                @click="$emit('edit-deadline', deadline)"
                class="btn-edit"
              >
                Edit
              </button>
              <button
                @click="$emit('delete-deadline', deadline._id)"
                class="btn-delete"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="no-selection">
        <p>Click on a date to view deadlines</p>
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

const selectedDay = ref(null);

// Convert deadlines to calendar attributes (dots on dates)
const calendarAttributes = computed(() => {
  return props.deadlines.map((deadline) => {
    const status = deadline.status || "NOT_STARTED";
    const dueDate = new Date(deadline.due);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dueDateOnly = new Date(dueDate);
    dueDateOnly.setHours(0, 0, 0, 0);
    const isOverdue = dueDateOnly < now && status !== "DONE";

    let color = "#760806"; // burgundy - not started (default)
    if (status === "DONE") {
      color = "#666"; // gray - completed
    } else if (isOverdue) {
      color = "#282880"; // royal blue - overdue (check this first before IN_PROGRESS)
    } else if (status === "IN_PROGRESS") {
      color = "#ffd757"; // yellow - in progress
    }

    return {
      key: deadline._id,
      dates: dueDate,
      dot: {
        style: {
          backgroundColor: color,
        },
        class: "deadline-dot",
      },
      popover: {
        label: deadline.title,
      },
      customData: deadline,
    };
  });
});

// Get deadlines for the selected day
const selectedDayDeadlines = computed(() => {
  if (!selectedDay.value) return [];

  const selectedDate = new Date(selectedDay.value);
  selectedDate.setHours(0, 0, 0, 0);

  return props.deadlines
    .filter((deadline) => {
      const deadlineDate = new Date(deadline.due);
      deadlineDate.setHours(0, 0, 0, 0);
      return deadlineDate.getTime() === selectedDate.getTime();
    })
    .sort((a, b) => new Date(a.due) - new Date(b.due));
});

const formatSelectedDate = computed(() => {
  if (!selectedDay.value) return "";
  return new Date(selectedDay.value).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
});

function handleDayClick(day) {
  selectedDay.value = day.date;
}

function getCourseDisplay(courseId) {
  const course = props.courses.find((c) => c._id === courseId);
  return course ? course.courseCode : "Unknown Course";
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
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
.deadlines-calendar-container {
  width: 100%;
  background: var(--white);
  padding: 2rem;
  border-radius: 4px;
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 var(--black);
  height: 1000px;
  overflow-y: auto;
  display: flex;
  gap: 2rem;
}

/* Desktop: side by side */
.calendar-section {
  flex: 0 0 650px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.details-section {
  flex: 1;
  min-width: 300px;
}

/* Override v-calendar default styles */
:deep(.vc-container) {
  border: 2px solid var(--black);
  border-radius: 4px;
  background: var(--white);
  font-family: "Open Sans", sans-serif;
  box-shadow: 4px 4px 0 var(--black);
  padding-bottom: 0rem;
}

:deep(.vc-header) {
  padding: 1.5rem 1rem 1.5rem 1rem;
  margin-bottom: 3.5rem;
  background: transparent;
  position: relative;
  z-index: 50;
  overflow: visible !important;
}

:deep(.vc-arrow) {
  cursor: pointer !important;
  z-index: 100 !important;
  position: relative !important;
  pointer-events: all !important;
  color: var(--burgundy) !important;
  font-weight: 700;
  border: 2px solid var(--burgundy) !important;
  border-radius: 4px;
  padding: 0.5rem 0.75rem !important;
  transition: all 0.2s;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  min-width: 40px !important;
  min-height: 40px !important;
}

:deep(.vc-arrow:hover) {
  color: var(--white) !important;
  background-color: var(--burgundy) !important;
  border-color: var(--burgundy) !important;
}

:deep(.vc-nav-item) {
  cursor: pointer;
  z-index: 10;
  position: relative;
  pointer-events: auto;
}

:deep(.vc-title) {
  font-family: "Cinzel", serif;
  font-weight: 700;
  font-size: 1.5rem;
  color: var(--burgundy);
  cursor: pointer;
  z-index: 10;
  position: relative;
  pointer-events: auto;
  transition: all 0.2s;
  border: 2px solid var(--burgundy);
  border-radius: 4px;
  padding: 0.5rem 1rem;
}

:deep(.vc-title:hover) {
  color: var(--white);
  background-color: var(--burgundy);
  border-color: var(--burgundy);
}

:deep(.vc-weeks) {
  padding-bottom: 0;
  margin-bottom: 0;
}

:deep(.vc-day) {
  min-height: 85px;
  min-width: 85px;
}

:deep(.vc-day-content) {
  font-weight: 600;
  font-size: 1rem;
}

:deep(.vc-day.is-today .vc-day-content) {
  background: var(--yellow);
  color: var(--black);
  border-radius: 4px;
  font-weight: 700;
}

:deep(.vc-day.is-active .vc-day-content) {
  background: #e0e0e0;
  border-radius: 4px;
  font-weight: 700;
}

:deep(.vc-dot) {
  width: 12px !important;
  height: 12px !important;
  border: 1px solid rgba(0, 0, 0, 0.3) !important;
}

/* Force dot colors to override any defaults */
:deep(.vc-dots) {
  margin-bottom: 0 !important;
}

/* Style the popover to match */
:deep(.vc-popover-content-wrapper) {
  border-radius: 4px !important;
  border: 2px solid var(--black) !important;
  box-shadow: 2px 2px 0 var(--black) !important;
  background-color: var(--white) !important;
}

:deep(.vc-popover-content) {
  background-color: var(--white) !important;
}

:deep(.vc-popover-content *) {
  background-color: transparent !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

:deep(.vc-popover-content > div) {
  background-color: var(--white) !important;
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

:deep(.vc-highlight) {
  background-color: transparent !important;
  border: none !important;
}

:deep(.vc-popover-content .vc-highlight) {
  display: none !important;
}

:deep(.vc-popover-content .vc-day-layer) {
  display: none !important;
}

:deep(.vc-popover-content .vc-highlights) {
  display: none !important;
}

:deep(.vc-popover-content .vc-dot) {
  width: 8px !important;
  height: 2px !important;
  border-radius: 1px !important;
  background-color: var(--black) !important;
}

/* Hide the popover arrow */
:deep(.vc-popover-caret) {
  display: none !important;
}

.calendar-legend {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: var(--light-gray);
  border-radius: 4px;
  border: 2px solid var(--black);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid var(--black);
}

.overdue-dot {
  background-color: #282880; /* Royal blue - matches overdue border */
}

.in-progress-dot {
  background-color: #ffd757; /* Yellow - matches in-progress border */
}

.not-started-dot {
  background-color: #760806; /* Burgundy - matches not-started border */
}

.completed-dot {
  background-color: #666; /* Gray - matches completed border */
}

.selected-day-deadlines {
  background: var(--white);
  padding: 1.5rem;
  border-radius: 4px;
  border: 2px solid var(--black);
  box-shadow: 3px 3px 0 var(--black);
  height: 100%;
}

.selected-day-deadlines h3 {
  font-family: "Cinzel", serif;
  color: var(--black);
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.deadline-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.deadline-item {
  background: var(--white);
  padding: 1.5rem;
  border-radius: 4px;
  border: 2px solid var(--black);
  border-left: 5px solid var(--burgundy);
  border-left-width: 5px;
  border-left-color: var(--burgundy);
  box-shadow: 2px 2px 0 var(--black);
  transition: all 0.2s;
}

.deadline-item.not-started {
  border-left-color: var(--burgundy);
}

.deadline-item.overdue {
  border-left-color: var(--royal-blue);
  background: #f5f5ff;
}

.deadline-item.in-progress {
  border-left-color: var(--yellow);
}

.deadline-item.completed {
  border-left-color: #666;
  opacity: 0.6;
}

.deadline-item.completed h4 {
  text-decoration: line-through;
  color: #666;
}

.deadline-item:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 var(--black);
}

.deadline-item-header {
  margin-bottom: 0.5rem;
}

.course-badge {
  display: inline-block;
  background-color: var(--royal-blue);
  color: var(--white);
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.deadline-item h4 {
  color: var(--black);
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0.25rem 0;
}

.deadline-time {
  color: #666;
  font-size: 0.9rem;
  margin: 0.25rem 0 0.75rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.overdue-badge {
  background-color: var(--royal-blue);
  color: var(--white);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  border: 1px solid var(--black);
}

.deadline-item-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.status-select {
  padding: 0.4rem 0.75rem;
  border: 2px solid var(--burgundy);
  border-radius: 4px;
  background-color: #f0f0f0;
  color: #666;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
  min-width: 150px;
  max-width: 200px;
}

.status-select.status-in-progress {
  background-color: #fff3cd;
  color: #856404;
  border-color: var(--yellow);
}

.status-select.status-done {
  background-color: #d4edda;
  color: #155724;
  border-color: #666;
}

.btn-edit {
  padding: 0.4rem 0.75rem;
  background-color: var(--white);
  color: var(--black);
  border: 2px solid var(--black);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  white-space: nowrap;
}

.btn-edit:hover {
  background-color: var(--light-gray);
}

.btn-delete {
  background: transparent;
  border: none;
  color: #e74c3c;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.5rem;
}

.btn-delete:hover {
  color: #c0392b;
}

.no-selection {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 1.1rem;
}

/* Large tablets and smaller - stack vertically */
@media (max-width: 1200px) {
  .deadlines-calendar-container {
    flex-direction: column;
    height: auto;
  }

  .calendar-section {
    flex: none;
    width: 100%;
  }

  .details-section {
    flex: none;
    width: 100%;
    min-width: 0;
  }

  :deep(.vc-day) {
    min-height: 80px;
    min-width: 80px;
  }

  :deep(.vc-day-content) {
    font-size: 1rem;
  }
}

/* Mobile - smaller calendar */
@media (max-width: 768px) {
  .deadlines-calendar-container {
    padding: 1rem;
  }

  :deep(.vc-header) {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  :deep(.vc-title) {
    font-size: 1.2rem;
  }

  :deep(.vc-day) {
    min-height: 60px;
    min-width: 60px;
  }

  :deep(.vc-day-content) {
    font-size: 0.9rem;
  }

  .deadline-item-actions {
    flex-wrap: wrap;
  }

  .status-select {
    flex: 1;
    min-width: 150px;
  }

  .calendar-legend {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
