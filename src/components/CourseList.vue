<template>
  <div class="course-list">
    <h2 class="cinzel-title">My Courses</h2>
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
  background: var(--white);
  padding: 2rem;
  border-radius: 4px;
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 var(--black);
}

h2 {
  color: var(--black);
  margin-bottom: 1.5rem;
  font-weight: 700;
  font-size: 1.8rem;
}

h2.cinzel-title {
  font-family: "Cinzel", serif;
  font-optical-sizing: auto;
  font-weight: 900;
  font-style: normal;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.course-card {
  background: var(--royal-blue);
  border: 2px solid var(--black);
  border-radius: 4px;
  padding: 1.5rem;
  transition: transform 0.1s, box-shadow 0.1s;
  box-shadow: 3px 3px 0 var(--black);
}

.course-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--black);
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.5rem;
}

h3 {
  font-family: "Cinzel", serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
  color: var(--white);
  font-size: 1.4rem;
  margin: 0;
}

.course-title {
  font-family: "Cinzel", serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
  color: var(--white);
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.btn-delete {
  background: transparent;
  border: none;
  color: var(--white);
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  transition: background-color 0.2s;
  font-weight: 700;
}

.btn-delete:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.course-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-view {
  flex: 1;
  padding: 0.5rem 1rem;
  background-color: var(--yellow);
  color: var(--black);
  border: 2px solid var(--black);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-view:hover {
  background-color: #ffc727;
}
</style>
