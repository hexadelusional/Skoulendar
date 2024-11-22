<template>
    <div class="form">
        <h1>Log In</h1>
        <form @submit.prevent="login">
            <input type="text" v-model="IDnumber" placeholder="ID Number" required>
            <input type="password" v-model="password" placeholder="Password" required>
            <button type="submit">Log In</button>
        </form>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const IDnumber = ref('');
const password = ref('');
const error = ref('');
const success = ref('');

async function login() {
    error.value = '';    // Reset error before each login attempt
    success.value = '';  // Reset success message

    try {
        const response = await fetch('http://localhost:1234/logged', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ IDnumber: IDnumber.value, password: password.value }),
        });

        if (!response.ok) {
            throw new Error('Invalid credentials or other error occurred');
        }

        const data = await response.json();
        success.value = data.message; // Show success message
        localStorage.setItem('IDnumber', IDnumber.value); // Store IDnumber in local storage
    } catch (err) {
        error.value = err.message || 'An unexpected error occurred.';
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

<style scoped>
.error {
    color: rgb(255, 94, 0);
}
.success {
    color: rgb(55, 128, 0);
}
</style>
