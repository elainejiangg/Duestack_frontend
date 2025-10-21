<template>
  <div id="app">
    <header>
      <nav>
        <div class="nav-brand">
          <RouterLink to="/">DueStack</RouterLink>
        </div>
        <div class="nav-links">
          <template v-if="authStore.isAuthenticated">
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/courses">Courses</RouterLink>
            <RouterLink to="/about">About</RouterLink>
            <span class="user-info">{{ authStore.username }}</span>
            <button @click="handleLogout" class="btn-logout">Logout</button>
          </template>
          <template v-else>
            <RouterLink to="/login">Login</RouterLink>
            <RouterLink to="/register">Register</RouterLink>
          </template>
        </div>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

async function handleLogout() {
  await authStore.logout();
  router.push("/login");
}
</script>

<style scoped>
header {
  background-color: #2c3e50;
  padding: 1rem;
  color: white;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-brand a {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

nav a:hover {
  opacity: 0.8;
}

nav a.router-link-active {
  border-bottom: 2px solid #42b983;
  padding-bottom: 0.25rem;
}

.user-info {
  color: #42b983;
  font-weight: 600;
}

.btn-logout {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-logout:hover {
  background-color: #c0392b;
}

main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>
