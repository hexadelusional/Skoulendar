<template>
    <div class="container">
        <h1>Assign Homework</h1>

        <div v-if="submitError" class="error">{{ submitError }}</div>

        <label for="class-select">Select a class:</label> <br>
        <select v-model="selectedClass" id="class-select" class="input-field">
            <option v-for="classItem in lessons" :key="classItem.id" :value="classItem.id">
                {{ classItem.name }}
            </option>
        </select>

        <div>
            <input type="text" v-model="homework.title" placeholder="TITLE" class="title" />

            <textarea v-model="homework.description" placeholder="Description" class="input-field"></textarea>

            <input type="date" v-model="homework.deadline" class="deadline" />
        </div>

        <button @click="submitHomework" :disabled="isSubmitting">Assign Homework</button>
        <div v-if="isSubmitting">Assigning homework...</div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // Import Axios

const lessons = ref([]);
const selectedClass = ref(null);

function getTodayDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0'); 
    const mm = String(today.getMonth() + 1).padStart(2, '0'); 
    const yyyy = today.getFullYear(); 

    return `${yyyy}-${mm}-${dd}`; // formatted date in `yyyy-mm-dd`
}

// Initialize homework with today's date as default
const homework = ref({
    title: '',
    description: '',
    deadline: getTodayDate(), // Set today's date here
});
const isLoading = ref(false);
const isSubmitting = ref(false);
const submitError = ref(null);

// Fetch lessons when the component mounts
onMounted(() => {
    fetchLessons();
});

// Function to fetch lessons
async function fetchLessons() {
    isLoading.value = true;
    submitError.value = null;

    try {
        const response = await axios.get('http://localhost:1234/api/lessons'); // Use full URL
        lessons.value = response.data;
    } catch (error) {
        console.error('Error fetching lessons:', error.message || error);
        submitError.value = 'Error loading lessons. Please try again later.';
    } finally {
        isLoading.value = false;
    }
}

// Function to submit homework
async function submitHomework() {
    submitError.value = null;
    isSubmitting.value = true;

    const payload = {
        title: homework.value.title,
        description: homework.value.description,
        deadline: homework.value.deadline,
        class_id: selectedClass.value,
        teacher_id: getTeacherId(), // ephemere, pour zarhaa qui submit le homework
    };

    try {
        const response = await axios.post('http://localhost:1234/api/homework', payload);
        alert('Homework assigned successfully!😃');
        resetForm();
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.data);
            submitError.value = error.response.data?.message || 'Failed to assign homework...😬';
        } else {
            console.error('Error message:', error.message);
            submitError.value = 'An error occurred when assigning homework...😬';
        }
    } finally {
        isSubmitting.value = false;
    }
}

function resetForm() {
    homework.value.title = '';
    homework.value.description = '';
    homework.value.deadline = getTodayDate(); // Reset date to today again
    selectedClass.value = null;
}

function getTeacherId() {
    return 8; // 8 c'est l'id de zahraa
}
</script>

<style scoped>
.container {
    width: 500px; /* Set the container width */
    margin: auto; /* Center the container */
    padding: 20px; /* Add some padding around the content */
    border-radius: 8px; /* Optional: Rounded corners */
}

.input-field {
    width: 100%; /* Make input fields take full width of the container */
    margin-bottom: 15px; /* Space between input fields */
    padding: 10px; /* Add padding for the input fields */
    box-sizing: border-box; /* Ensures padding is included in width */
}

.title, .deadline{
    text-align: center;
    font-size: 16px;
    width: 50%;
}

.error {
    color: rgb(255, 94, 0);
}
</style>


