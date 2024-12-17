<template>
  <div class="form">
    <h1>{{ isLoggedIn ? `Logged in as ${userRole}` : 'Log In' }}</h1>

    <!-- If user is logged in, show logout button -->
    <div v-if="isLoggedIn">
      <h2>Welcome back {{ username }}! 😃</h2>
      <button @click="logOut">Log Out <i class="fa-solid fa-door-closed"></i></button>
    </div>

    <!-- If not logged in, show the login form -->
    <div v-else>
      <form @submit.prevent="login">
        <input class="id-field" type="text" v-model="id" placeholder="ID Number" :class="{ error: idError }"/>
        <div class="password-field">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Password" :class="{ error: passwordError }"/>
          <button class="eye" type="button" @click="showPassword = !showPassword">
            <span v-html="showPassword ? '<i class=\'fa-solid fa-eye\'></i>' : '<i class=\'fa-regular fa-eye\'></i>'"></span>
          </button>
        </div>
        <button type="submit" :disabled="isLoggingIn">Log In <i class="fa-solid fa-door-open"></i></button>
        <p v-if="loginStatus" :class="{ success: loginStatus.success, error: !loginStatus.success }" v-html="loginStatus.message"></p>
        <!-- Error messages for wrong login info -->
        <p v-if="idError && passwordError" class="error">Both ID and password fields must be filled in.☝️</p>
        <p v-else-if="idError" class="error">ID Number is required.☝️</p>
        <p v-else-if="passwordError" class="error">Password is required.☝️</p>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from '../composable/useAuth';
import { useRouter } from 'vue-router';

const router = useRouter(); 

const auth = useAuth(); 

// Reactive state variables
const id = ref('');
const password = ref('');
const idError = ref(false);
const passwordError = ref(false);
const loginStatus = ref(null);
const isLoggingIn = ref(false);
const showPassword = ref(false);

// Computed properties for auth status
const isLoggedIn = computed(() => auth.isLoggedIn.value);
const username = computed(() => Cookies.get('username')); 
const userRole = computed(() => Cookies.get('role')); 


// Login function to handle login logic
const login = async () => {
  // Reset errors
  idError.value = !id.value.trim(); 
  passwordError.value = !password.value.trim();

  if (idError.value || passwordError.value) {
    return; 
  }

  isLoggingIn.value = true; 
  loginStatus.value = null;

  try {
    const response = await axios.post('http://localhost:1234/api/auth/login', {
      id: id.value,
      password: password.value,
    });

    const userData = response.data;

    // Clear input fields after successful login
    id.value = '';
    password.value = '';
    idError.value = false;
    passwordError.value = false;

    // Log in using the auth composable
    auth.logIn({
      username: userData.user.name,
      role: userData.user.status,
      token: userData.token, 
    });

    // Set cookies to maintain session
    Cookies.set('role', userData.user.status, { path: '/' }); // Set role cookie
    Cookies.set('username', userData.user.name, { path: '/' }); // Set username cookie
    Cookies.set('authToken', userData.token, { path: '/' }); // Set token cookie if applicable
    Cookies.set('userId', userData.user.id, { path: '/' }); // Set user ID cookie

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
    isLoggingIn.value = false;
  }
};

// Logout function
const logOut = () => {
  // Clear session cookies
  Cookies.remove('role', { path: '/' });
  Cookies.remove('username', { path: '/' });
  Cookies.remove('authToken', { path: '/' });
  Cookies.remove('userId', { path: '/' });

  auth.logOut();
  
  // Redirect the user to the login page
  router.push({ name: 'login' }); 
  window.location.reload();
};
</script>

<style scoped>
  form{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 200px;
    width: 200px;
  }
  .id-field{
    width: 200px;
  }
  .password-field {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    width: 223.2px;
  }
  .eye{
    margin-right: 0px;
  }
</style>
