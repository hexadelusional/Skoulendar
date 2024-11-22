<template>
    <div class="form">
        <h1>Log In</h1>
        <form @submit.prevent="login">
            <input type="text" v-model="IDnumber" placeholder="ID Number">
            <input type="text" v-model="password" placeholder="Password">
            <button type="submit">Log In</button>
        </form>
    </div>
</template>

  
<script setup>
  import { ref, onMounted } from 'vue'; 
  const IDnumber = ref('');
  const password = ref('');
  const error = ref('');
  
  async function login() {
      try {
          const response = await fetch('http://localhost:1234/logged', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ IDnumber: IDnumber.value, password: password.value }),
          });
  
          if (!response.ok) {
              throw new Error('Invalid credentials');
          }
  
          const data = await response.json();
          alert(data.message);
          localStorage.setItem('IDnumber', IDnumber.value); // Store IDnumber in local storage
      } catch (err) {
          error.value = err.message;
      }
  }
  
  function checkSession() {
      const storedUser = localStorage.getItem('IDnumber');
      if (storedUser) {
          IDnumber.value = storedUser; // Set the IDnumber from local storage
      }
  }
    onMounted(() => {
      checkSession(); 
  });
</script>
  