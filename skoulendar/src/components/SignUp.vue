<template>
    <div class="form">
        <h1>Sign Up</h1>
        <form @submit.prevent="signup">
            <input v-model="IDnumber" type="text" placeholder="ID Number" required />
            <input v-model="email" type="text" placeholder="E-mail" required />
            <input v-model="password" type="password" placeholder="Password" required />
            <input v-model="confirmPassword" type="password" placeholder="Confirm password" required />
            <button type="submit">Sign Up</button>
        </form>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const IDnumber = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref(null);
const success = ref(null);

async function signup() {
    error.value = null;
    success.value = null;

    // Basic client-side validation for password match
    if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match';
        return;
    }

    try {
        const response = await fetch('http://localhost:1234/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                IDnumber: IDnumber.value,
                email: email.value,
                password: password.value,
                confirmPassword: confirmPassword.value,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred');
        }

        const data = await response.json();
        success.value = data.message;
    } catch (err) {
        error.value = err.message;
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
