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

<script>
import axios from 'axios';

export default {
  data() {
    return {
      id: '',
      password: '',
      idError: false,
      loginStatus: null,
    };
  },
  methods: {
    async login() {
      this.idError = !this.id; // Ensure there’s an ID provided

      if (this.idError) {
        return; // Exit if there's an error
      }

      try {
        const response = await axios.post('http://localhost:1234/api/auth/login', {
          id: this.id,
          password: this.password,
        });

        // Handle successful login
        this.loginStatus = {
          success: true,
          message: "Login successful! Welcome " + response.data.user.name + " 😃",
        };

        // Clear input fields after successful login
        this.id = '';
        this.password = '';
        this.idError = false;

        // Handle post-login actions, like redirecting if needed

      } catch (error) {
        // Handle error response
        if (error.response && error.response.status === 401) {
          this.loginStatus = {
            success: false,
            message: error.response.data.message || "Login has failed, please check your credentials... 😬",
          };
        } else {
          this.loginStatus = {
            success: false,
            message: "An error occurred while logging in... 😬",
          };
        }
      }
    },
  },
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
