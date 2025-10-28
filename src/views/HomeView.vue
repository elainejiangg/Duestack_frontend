<template>
  <div class="home">
    <div class="mascot-container">
      <img
        src="/src/assets/mascot.png"
        alt="DueStack Mascot"
        class="home-mascot"
      />
    </div>
    <h1 class="cinzel-title">Welcome to DueStack</h1>
    <p class="subtitle">Your AI-powered deadline management solution</p>

    <div class="quick-actions">
      <RouterLink to="/courses" class="action-card">
        <h2 class="cinzel-title">📚 Courses</h2>
        <p>Manage your courses and organize deadlines by class</p>
      </RouterLink>

      <RouterLink to="/deadlines" class="action-card">
        <h2 class="cinzel-title">📋 All Deadlines</h2>
        <p>View and filter all your deadlines across all courses</p>
      </RouterLink>

      <RouterLink to="/deadlines?view=calendar" class="action-card">
        <h2 class="cinzel-title">📅 Calendar</h2>
        <p>See your deadlines on an interactive calendar view</p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
.home {
  text-align: center;
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.mascot-container {
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
}

.home-mascot {
  width: 120px;
  height: 100px;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

.home-mascot:hover {
  transform: scale(1.05) rotate(2deg);
}

h1 {
  color: var(--royal-blue);
  font-size: 2.5rem;
  margin-bottom: 0.25rem;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--royal-blue);
  opacity: 0.7;
  margin-bottom: 3rem;
  font-style: italic;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 4px;
  border: 2px solid var(--black);
  box-shadow: 4px 4px 0 var(--black);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
  position: relative;
}

.action-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 var(--black);
}

.action-card h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.action-card p {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
}
</style>
