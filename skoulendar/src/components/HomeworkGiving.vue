<template>
    <div>
        <h1>Assign Homework</h1>
        <div v-if="submitError" class="error">{{ submitError }}</div>

        <label for="class-select">Select a class:</label> <br>
        <select v-model="selectedClass" id="class-select">
            <option v-for="classItem in classes" :key="classItem.id" :value="classItem.id">
                {{ classItem.name }}
            </option>
        </select>

        <div>
            <input type="text" v-model="homework.title" placeholder="Homework Title" />
            <textarea v-model="homework.description" placeholder="Homework Description"></textarea>
            <input type="date" v-model="homework.due_date" placeholder="Due Date" />
        </div>

        <button @click="submitHomework" :disabled="isSubmitting">Submit Homework</button>
        <div v-if="isSubmitting">Submitting homework...</div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // Import Axios

const classes = ref([]);
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
    due_date: getTodayDate(), // Set today's date here
});
const isLoading = ref(false);
const isSubmitting = ref(false);
const submitError = ref(null);

// Fetch classes when the component mounts
onMounted(() => {
    fetchClasses();
});

// Function to fetch classes
async function fetchClasses() {
    isLoading.value = true;
    submitError.value = null;

    try {
        const response = await axios.get('http://localhost:1234/api/classes'); // Use full URL
        classes.value = response.data;
    } catch (error) {
        console.error('Error fetching classes:', error.message || error);
        submitError.value = 'Error loading classes. Please try again later.';
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
        due_date: homework.value.due_date,
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
    homework.value.due_date = getTodayDate(); // Reset date to today again
    selectedClass.value = null;
}

function getTeacherId() {
    return 8; // 8 c'est l'id de zahraa
}
</script>

<style scoped>
    .error {
        color: rgb(255, 94, 0);
    }
</style>


