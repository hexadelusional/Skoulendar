<template>
  <div class="form">
    <h1>Log In</h1>

    <form @submit.prevent="login">
      <input
        type="text"
        v-model="id"
        placeholder="ID Number"
        :class="{ error: idError }"
      />
      <span v-if="idError" class="error">ID Number is required</span>

      <input
        type="password"
        v-model="password"
        placeholder="Password"
      />

      <button type="submit">Log In</button>
    </form>

    <p v-if="loginStatus" :class="{ success: loginStatus.success, error: !loginStatus.success }">
      {{ loginStatus.message }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Reactive state variables
const id = ref('');
const password = ref('');
const idError = ref(false);
const loginStatus = ref(null);

// Login function to handle login logic
const login = async () => {
  idError.value = !id.value; // Ensure there’s an ID provided

  if (idError.value) {
    return; // Exit if there's an error
  }

  try {
    const response = await axios.post('http://localhost:1234/api/auth/login', {
      id: id.value,
      password: password.value,
    });

    // Handle successful login
    loginStatus.value = {
      success: true,
      message: "Login successful! Welcome " + response.data.user.name + " 😃",
    };

    // Clear input fields after successful login
    id.value = '';
    password.value = '';
    idError.value = false;

    // Handle post-login actions, like redirecting if needed

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
  }
};
</script>

<style scoped>
.error {
  color: rgb(255, 94, 0);
}

.success {
  color: rgb(55, 128, 0);
}
</style>
