<template>
  <div id="app">
    <header>
      <nav>
        <div class="nav-brand"></div>
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
  background-color: transparent;
  padding: 1rem;
  color: var(--black);
  border-bottom: 1px solid var(--light-gray);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mascot-logo {
  width: 40px;
  height: 33px;
  filter: brightness(0) invert(1);
  transition: transform 0.3s ease, filter 0.3s ease;
}

.mascot-logo:hover {
  transform: scale(1.1) rotate(5deg);
  filter: brightness(0) invert(1) sepia(1) saturate(3) hue-rotate(45deg);
}

.nav-brand a {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--black);
  text-decoration: none;
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-left: auto;
}

nav a {
  font-family: "Cinzel", serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
  color: var(--black);
  text-decoration: none;
  transition: color 0.2s;
}

nav a:hover {
  color: var(--yellow);
}

nav a.router-link-active {
  border-bottom: 2px solid var(--yellow);
  padding-bottom: 0.25rem;
}

.user-info {
  color: var(--burgundy);
  font-weight: 600;
}

.btn-logout {
  background-color: var(--burgundy);
  color: var(--white);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-logout:hover {
  background-color: #5a0504;
}

main {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 200px);
}
</style>
