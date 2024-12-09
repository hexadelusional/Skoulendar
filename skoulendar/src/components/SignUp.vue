<template>
  <div class="form">
    <h1>Sign Up</h1>
    <form @submit.prevent="signup">
      <input
        v-model="id"
        type="text"
        placeholder="ID Number"
        :class="{'error': idError}"
      />
      <span v-if="idError" class="error">ID Number is required and must be a number</span>

      <input
        v-model="name"
        type="text"
        placeholder="Name"
        :class="{'error': nameError}"
      />
      <span v-if="nameError" class="error">Name is required</span>

      <input
        v-model="surname"
        type="text"
        placeholder="Surname"
        :class="{'error': surnameError}"
      />
      <span v-if="surnameError" class="error">Surname is required</span>

      <input
        v-model="password"
        type="password"
        placeholder="Password"
      />

      <input
        v-model="confirmPassword"
        type="password"
        placeholder="Confirm Password"
      />
      <span v-if="passwordError" class="error">Passwords do not match</span>

      <button type="submit">Sign Up</button>
    </form>

    <p v-if="signupStatus" :class="{'success': signupStatus.success, 'error': !signupStatus.success}">
      {{ signupStatus.message }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios'; 

const id = ref('');
const name = ref('');
const surname = ref('');
const password = ref('');
const confirmPassword = ref('');
const idError = ref(false);
const nameError = ref(false);
const surnameError = ref(false);
const passwordError = ref(false); 
const signupStatus = ref(null);

// Validate ID number
function validateID() {
  if (!id.value || isNaN(id.value)) {
    idError.value = true;
    return false;
  } else {
    idError.value = false;
    return true;
  }
}

// Validate Name
function validateName() {
  if (!name.value) {
    nameError.value = true;
    return false;
  } else {
    nameError.value = false;
    return true;
  }
}

// Validate urname
function validateSurname() {
  if (!surname.value) {
    surnameError.value = true;
    return false;
  } else {
    surnameError.value = false;
    return true;
  }
}

// Check if passwords match
function validatePasswordMatch() {
  if (password.value !== confirmPassword.value) {
    passwordError.value = true;
    return false;
  } else {
    passwordError.value = false;
    return true;
  }
}

// signup function
async function signup() {
  if (!validateID() || !validateName() || !validateSurname() || !validatePasswordMatch()) {
    return; // stop if validation fails
  }

  try {
    const response = await axios.post('http://localhost:1234/api/auth/signup', {
      id: id.value,
      name: name.value,
      surname: surname.value,
      password: password.value
    });

    signupStatus.value = {
      success: true,
      message: response.data.message || 'You\'re all signed up!😁'
    };

    // empty input fields
    id.value = '';
    name.value = '';
    surname.value = '';
    password.value = '';
    confirmPassword.value = '';
  } catch (error) {
    signupStatus.value = {
      success: false,
      message: error.response?.data?.message || 'Sign up failed.😬'
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
