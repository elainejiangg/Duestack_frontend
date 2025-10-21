<template>
  <div class="course-list">
    <h2>My Courses</h2>
    <div v-if="courses.length === 0" class="empty-state">
      <p>No courses yet. Create your first course to get started!</p>
    </div>
    <div v-else class="courses-grid">
      <div v-for="course in courses" :key="course._id" class="course-card">
        <div class="course-header">
          <h3>{{ course.courseCode }}</h3>
          <button
            @click="$emit('delete-course', course._id)"
            class="btn-delete"
            title="Delete course"
          >
            ×
          </button>
        </div>
        <p class="course-title">{{ course.title }}</p>
        <div class="course-actions">
          <button @click="$emit('view-deadlines', course._id)" class="btn-view">
            View Deadlines
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  courses: {
    type: Array,
    required: true,
  },
});

defineEmits(["delete-course", "view-deadlines"]);
</script>

<style scoped>
.course-list {
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

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.course-card {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
}

h3 {
  color: #42b983;
  font-size: 1.3rem;
  margin: 0;
}

.course-title {
  color: #555;
  margin-bottom: 1rem;
  font-size: 0.95rem;
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

.course-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view {
  flex: 1;
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-view:hover {
  background-color: #359268;
}
</style>
