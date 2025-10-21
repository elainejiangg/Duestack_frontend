<template>
  <div class="home">
    <h1>Welcome to DueStack</h1>
    <p class="subtitle">Your AI-powered deadline management solution</p>

    <div class="quick-actions">
      <RouterLink to="/courses" class="action-card">
        <h2>📚 Courses</h2>
        <p>Manage your courses and organize deadlines by class</p>
      </RouterLink>

      <div class="action-card coming-soon">
        <h2>📄 Documents</h2>
        <p>Upload syllabi and extract deadlines with AI</p>
        <span class="badge">Coming Soon</span>
      </div>

      <div class="action-card coming-soon">
        <h2>📅 Calendar</h2>
        <p>View all your deadlines in one place</p>
        <span class="badge">Coming Soon</span>
      </div>
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

h1 {
  color: #42b983;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 3rem;
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
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
  position: relative;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.action-card.coming-soon {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-card.coming-soon:hover {
  transform: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

.badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #42b983;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
