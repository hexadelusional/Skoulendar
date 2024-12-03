<template>
    <div class="form">
      <h1>Log In</h1>
      <form @submit.prevent="login">
        <input 
          type="text" 
          v-model="IDnumber" 
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
  
      <!-- Display login status message -->
      <p v-if="loginStatus" :class="{'success': loginStatus.success, 'error': !loginStatus.success}">
        {{ loginStatus.message }}
      </p>
    </div>
  </template>
  
  <script setup>
    import { ref } from 'vue';
    import Authentification from '../services/authentication.js';
  
    const IDnumber = ref('');
    const password = ref('');
    const idError = ref(false); 
    const loginStatus = ref(null); 
  
    // To check if IDnumber is valid
    function validateID() {
      if (!IDnumber.value || isNaN(IDnumber.value)) {
        idError.value = true; // Set error
        return false;
      } else {
        idError.value = false; // Clear error
        return true;
      }
    }
  
    async function login() {
      if (!validateID()) {
        return; // Stopping execution
      }
      // Calling the authentication service
      try {
        const response = await Authentification.login({
          IDnumber: IDnumber.value,
          password: password.value
        });
        loginStatus.value = response;
      } catch (error) {
        // Handling login failure
        loginStatus.value = error;
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
  