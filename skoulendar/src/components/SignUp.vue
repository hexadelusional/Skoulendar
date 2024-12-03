<template>
    <div class="form">
      <h1>Sign Up</h1>
      <form @submit.prevent="signup">
        <!-- ID Number Input -->
        <input v-model="IDnumber" type="text" placeholder="ID Number" :class="{'error': idError}" />
        <span v-if="idError" class="error">ID Number is required and must be a number</span>
  
        <!-- Password Input -->
        <input v-model="password" type="password" placeholder="Password" />
  
        <!-- Confirm Password Input -->
        <input v-model="confirmPassword" type="password" placeholder="Confirm password" />
        <span v-if="passwordError" class="error">Passwords do not match</span>
  
        <!-- Submit Button -->
        <button type="submit">Sign Up</button>
      </form>
  
      <!-- Signup Status -->
      <p v-if="signupStatus" :class="{'success': signupStatus.success, 'error': !signupStatus.success}">
        {{ signupStatus.message }}
      </p>
    </div>
  </template>
  
  <script setup>
    import { ref } from 'vue';
    import Authentification from '../services/authentication.js';
  
    const IDnumber = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const idError = ref(false); 
    const passwordError = ref(false); // To track password match error
    const signupStatus = ref(null);
  
    // Function to validate ID number
    function validateID() {
      if (!IDnumber.value || isNaN(IDnumber.value)) {
        idError.value = true;
        return false;
      } else {
        idError.value = false;
        return true;
      }
    }
  
    // Function to check if passwords match
    function validatePasswordMatch() {
      if (password.value !== confirmPassword.value) {
        passwordError.value = true;
        return false;
      } else {
        passwordError.value = false;
        return true;
      }
    }
  
    // Signup function
    async function signup() {
      if (!validateID() || !validatePasswordMatch()) {
        return; // Stop if validation fails
      }
  
      try {
        const response = await Authentification.signup({
          IDnumber: IDnumber.value,
          password: password.value
        });
        signupStatus.value = response; // Show success message
      } catch (error) {
        signupStatus.value = error; // Show error message
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
  