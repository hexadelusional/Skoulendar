<template>
    <div>
        <h1>View Homework</h1>

        <h2>Select Your Class:</h2>
        <div v-if="submitErrorClasses" class="error">{{ submitErrorClasses }}</div>

        <div v-if="classes.length === 0">No classes found.</div> <!-- Add this line -->

        <select v-model="selectedClassId" @change="fetchHomework" v-if="classes.length"> <!-- Modify here -->
            <option v-for="classItem in classes" :key="classItem.id" :value="classItem.id">
                {{ classItem.name }}
            </option>
        </select>

        <div v-if="isLoadingHomework">Loading homework...</div>
        <div v-if="submitErrorHomework" class="error">{{ submitErrorHomework }}</div>

        <ul v-if="homeworks.length">
            <li v-for="homework in homeworks" :key="homework.id">
                <h3>{{ homework.title }}</h3>
                <p>{{ homework.description }}</p>
                <p><strong>Due Date:</strong> {{ formatDate(homework.due_date) }}</p>
            </li>
        </ul>
        <div v-else>No homework assigned for the selected class.</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const classes = ref([]);
const selectedClassId = ref(null);
const homeworks = ref([]);
const isLoadingClasses = ref(false);
const isLoadingHomework = ref(false);
const submitErrorClasses = ref(null);
const submitErrorHomework = ref(null);

const studentId = 3; // Replace with the logged-in student's ID

async function fetchClasses() {
    isLoadingClasses.value = true;
    submitErrorClasses.value = null;

    try {
        const response = await axios.get(`http://localhost:1234/api/classList`, {
            params: { student_id: studentId }
        });

        console.log('Fetched classes:', response.data);
        classes.value = response.data;
    } catch (error) {
        console.error('Error fetching classes:', error);
        submitErrorClasses.value = 'Error loading classes. Please try again later.';
    } finally {
        isLoadingClasses.value = false;
    }
}

async function fetchHomework() {
    if (!selectedClassId.value) {
        alert('Please select a class.');
        return;
    }

    isLoadingHomework.value = true;
    submitErrorHomework.value = null;

    try {
        const response = await axios.get('http://localhost:1234/api/homework', {
            params: {
                class_id: selectedClassId.value
            }
        });
        homeworks.value = response.data;
    } catch (error) {
        console.error('Error fetching homework:', error);
        submitErrorHomework.value = 'Error loading homework. Please try again later.';
    } finally {
        isLoadingHomework.value = false;
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

onMounted(() => {
    fetchClasses();
});
</script>

<style scoped>
.error {
    color: rgb(255, 94, 0);
}
</style>
