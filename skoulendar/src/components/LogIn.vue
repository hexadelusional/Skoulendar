<template>
  <div class="form">
    <h1>Log In</h1>

    <form @submit.prevent="login">
      <input
        type="text"
        v-model="id"
        placeholder="ID Number"
        :class="{'error': idError}"
      />
      <span v-if="idError" class="error">ID Number is required and must be a number</span>

      <input
        type="password"
        v-model="password"
        placeholder="Password"
      />

      <button type="submit">Log In</button>
    </form>

    <p v-if="loginStatus" :class="{'success': loginStatus.success, 'error': !loginStatus.success}">
      {{ loginStatus.message }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios'; 

const id = ref('');
const password = ref('');
const idError = ref(false);
const loginStatus = ref(null);

// Check if id is valid
function validateID() {
  if (!id.value || isNaN(id.value)) {
    idError.value = true; 
    return false;
  } else {
    idError.value = false;
    return true;
  }
}

async function login() {
  if (!validateID()) {
    return; 
  }

  try {
    const response = await axios.post('http://localhost:1234/api/auth/login', {
      id: id.value,
      password: password.value
    });

    loginStatus.value = {
      success: true,
      message: 'Login successful!😁'
    };

    if (response.data.success) {
      id.value = '';
      password.value = '';
      localStorage.setItem('token', response.data.token);
    }
  } catch (error) {
    loginStatus.value = {
      success: false,
      message: error.response?.data?.message || 'Login has failed.😬'
    };
  }
}
</script>

<style scoped>
.error {
  color: rgb(255, 94, 0);
}
.success {
  color: rgb(55, 128, 0);
}
</style>
