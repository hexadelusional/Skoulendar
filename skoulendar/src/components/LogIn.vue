<template>
  <div class="form">
    <h1>{{ isLoggedIn ? 'Login successful!' : 'Log In' }}</h1>

    <!-- If user is logged in, show logout button -->
    <div v-if="isLoggedIn">
      <p v-if="loginStatus" :class="{ success: loginStatus.success, error: !loginStatus.success }" v-html="loginStatus.message"></p>
      <button @click="logOut">Log Out</button>
    </div>

    <!-- If not logged in, show the login form -->
    <div v-else>
      <form @submit.prevent="login">
        <input
          type="text"
          v-model="id"
          placeholder="ID Number"
          :class="{ error: idError }"
        />
        <div class="password-field">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            :class="{ error: passwordError }"
          />
          <button type="button" @click="showPassword = !showPassword">
            <span v-html="showPassword ? '<i class=\'fa-solid fa-eye\'></i>' : '<i class=\'fa-regular fa-eye\'></i>'"></span>
          </button>
        </div>

        <!-- Combined error messages below login button -->
        <p v-if="idError && passwordError" class="error">Both ID and password fields must be filled in.☝️</p>
        <p v-else-if="idError" class="error">ID Number is required.☝️</p>
        <p v-else-if="passwordError" class="error">Password is required.☝️</p>

        <button type="submit" :disabled="isLoggingIn">Log In</button>
        <p v-if="loginStatus" :class="{ success: loginStatus.success, error: !loginStatus.success }" v-html="loginStatus.message"></p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from '../composable/useAuth';
import { useRouter } from 'vue-router'; // Import useRouter

const router = useRouter(); // Get the router instance

const auth = useAuth(); // Use the auth composable

// Reactive state variables
const id = ref('');
const password = ref('');
const idError = ref(false);
const passwordError = ref(false);
const loginStatus = ref(null);
const isLoggingIn = ref(false);
const showPassword = ref(false);

// Computed properties for auth status
const isLoggedIn = computed(() => auth.isLoggedIn.value); // Accessing isLoggedIn from the useAuth
const username = computed(() => Cookies.get('username')); // Get username directly from cookies

// Login function to handle login logic
const login = async () => {
  // Reset errors
  idError.value = !id.value.trim(); // Ensure there’s an ID provided
  passwordError.value = !password.value.trim(); // Ensure there’s a password provided

  if (idError.value || passwordError.value) {
    return; // Exit if there's an error
  }

  isLoggingIn.value = true; // Set loading state
  loginStatus.value = null; // Reset login status

  try {
    const response = await axios.post('http://localhost:1234/api/auth/login', {
      id: id.value,
      password: password.value,
    });

    const userData = response.data; // Get user data

    // Handle successful login
    loginStatus.value = {
      success: true,
      message: "Welcome back <strong>" + userData.user.name + "</strong> 😃!",
    };

    // Clear input fields after successful login
    id.value = '';
    password.value = '';
    idError.value = false;
    passwordError.value = false;

    // Log in using the auth composable
    auth.logIn({
      username: userData.user.name,
      role: userData.user.status,
      token: userData.token, // Assuming your API sends back a token
    });

    // Set cookies to maintain session
    Cookies.set('role', userData.user.status, { path: '/' }); // Set role cookie
    Cookies.set('username', userData.user.name, { path: '/' }); // Set username cookie
    Cookies.set('authToken', userData.token, { path: '/' }); // Set token cookie if applicable
    Cookies.set('studentId', userData.user.id, { path: '/' }); // Assuming the ID is in userData.user.id

    // Automatically redirect to the home page after successful login
    window.location.reload(); // Trigger page reload to update navigation
  } catch (error) {
    // Handle error response
    if (error.response && error.response.status === 401) {
      loginStatus.value = {
        success: false,
        message: error.response.data.message || "Login has failed, please check your credentials... 😬",
      };
    } else {
      loginStatus.value = {
        success: false,
        message: "An error occurred while logging in... 😬",
      };
    }
  } finally {
    isLoggingIn.value = false; // Reset loading state
  }
};

// Logout function
const logOut = () => {
  // Clear session cookies
  Cookies.remove('role', { path: '/' });
  Cookies.remove('username', { path: '/' });
  Cookies.remove('authToken', { path: '/' });
  Cookies.remove('studentId', { path: '/' });

  // Call logOut from useAuth to clear session state
  auth.logOut();

  // Update login status
  loginStatus.value = {
    success: true,
    message: "You have been logged out successfully. 😃",
  };

  // Redirect the user to the login page
  router.push({ name: 'login' }); // Use the router instance
};
</script>

<style scoped>
.error {
  color: rgb(255, 94, 0);
}
.success {
  color: rgb(55, 128, 0);
}
.password-field {
  display: flex;
  align-items: center;
}
.password-field button {
  margin-left: 10px;
}
</style>
