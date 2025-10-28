<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Create Your DueStack Account</h1>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            placeholder="Enter your full name"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            placeholder="Enter your email"
            @blur="validateEmail"
          />
          <span v-if="validationErrors.email" class="field-error">{{
            validationErrors.email
          }}</span>
        </div>
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="formData.username"
            type="text"
            required
            placeholder="Choose a username (min 3 characters, no spaces)"
            @blur="validateUsername"
          />
          <span v-if="validationErrors.username" class="field-error">{{
            validationErrors.username
          }}</span>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            required
            placeholder="Choose a password (min 8 characters)"
            @blur="validatePassword"
          />
          <span v-if="validationErrors.password" class="field-error">{{
            validationErrors.password
          }}</span>
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? "Creating Account..." : "Register" }}
        </button>
      </form>
      <p class="login-link">
        Already have an account?
        <RouterLink to="/login">Login here</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import api from "@/utils/api";
import { API_ENDPOINTS } from "@/config/api";

const router = useRouter();
const authStore = useAuthStore();

const formData = ref({
  name: "",
  email: "",
  username: "",
  password: "",
});

const loading = ref(false);
const error = ref(null);
const validationErrors = ref({
  email: null,
  username: null,
  password: null,
});

function validateEmail() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.value.email) {
    validationErrors.value.email = "Email is required";
  } else if (!emailRegex.test(formData.value.email)) {
    validationErrors.value.email = "Please enter a valid email address";
  } else {
    validationErrors.value.email = null;
  }
}

function validateUsername() {
  if (!formData.value.username) {
    validationErrors.value.username = "Username is required";
  } else if (formData.value.username.length < 3) {
    validationErrors.value.username = "Username must be at least 3 characters";
  } else if (/\s/.test(formData.value.username)) {
    validationErrors.value.username = "Username cannot contain spaces";
  } else {
    validationErrors.value.username = null;
  }
}

function validatePassword() {
  if (!formData.value.password) {
    validationErrors.value.password = "Password is required";
  } else if (formData.value.password.length < 8) {
    validationErrors.value.password = "Password must be at least 8 characters";
  } else {
    validationErrors.value.password = null;
  }
}

function validateForm() {
  validateEmail();
  validateUsername();
  validatePassword();
  return (
    !validationErrors.value.email &&
    !validationErrors.value.username &&
    !validationErrors.value.password
  );
}

async function handleRegister() {
  if (!validateForm()) {
    error.value = "Please fix the errors above before submitting";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // Step 1: Create user identity
    const userResponse = await api.post(API_ENDPOINTS.userIdentity.createUser, {
      email: formData.value.email,
      name: formData.value.name,
    });

    const userId = userResponse.user;

    // Step 2: Register authentication credentials and login
    await authStore.register(
      userId,
      formData.value.username,
      formData.value.password
    );

    // Redirect to home
    router.push("/");
  } catch (err) {
    error.value = err.message || "Registration failed. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 2rem;
}

.register-card {
  background: var(--white);
  padding: 2.5rem;
  border-radius: 4px;
  border: 2px solid var(--black);
  box-shadow: 6px 6px 0 var(--black);
  width: 100%;
  max-width: 400px;
}

h1 {
  color: var(--burgundy);
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  font-weight: 700;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: var(--burgundy);
  border-width: 2px;
}

.btn-primary {
  width: 100%;
  padding: 0.875rem;
  background-color: var(--burgundy);
  color: var(--white);
  border: 2px solid var(--black);
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: 3px 3px 0 var(--black);
}

.btn-primary:hover:not(:disabled) {
  background-color: #5a0504;
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 var(--black);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.field-error {
  display: block;
  color: #c33;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.login-link a {
  color: var(--burgundy);
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
