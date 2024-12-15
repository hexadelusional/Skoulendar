<template>
    <div class="container">
        <h1>Assign Homework</h1>
        <div v-if="submitError" class="error">{{ submitError }}</div>

        <label for="class-select">Select a class:</label> <br />
        <select v-model="selectedClass" id="class-select" class="input-field">
            <option v-for="classItem in lessons" :key="classItem.id" :value="classItem.id">
                {{ classItem.id }} - {{ classItem.name }}
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
import axios from 'axios';
import Cookies from 'js-cookie'; // Import the js-cookie library

const lessons = ref([]);
const selectedClass = ref(null);

function getTodayDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`; // formatted date in `yyyy-mm-dd`
}

const homework = ref({
    title: '',
    description: '',
    deadline: getTodayDate(),
});

const isLoading = ref(false);
const isSubmitting = ref(false);
const submitError = ref(null);

onMounted(() => {
    fetchLessons(); // Fetch lessons on component mount
});

async function fetchLessons() {
    isLoading.value = true;
    submitError.value = null;

    try {
        const teacherId = getTeacherId(); // Get the teacher ID from the cookie

        const response = await axios.get(`http://localhost:1234/api/lessons`, { params: { teacher_id: teacherId } }); // Use teacher ID in API call
        lessons.value = response.data;
    } catch (error) {
        console.error('Error fetching lessons:', error.message || error);
        submitError.value = 'Error loading lessons. Please try again later.';
    } finally {
        isLoading.value = false;
    }
}

async function submitHomework() {
    submitError.value = null;
    isSubmitting.value = true;

    const payload = {
        title: homework.value.title,
        description: homework.value.description,
        deadline: homework.value.deadline,
        lesson_id: selectedClass.value,
        teacher_id: getTeacherId(), // Use the teacher ID from the cookie
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
    homework.value.deadline = getTodayDate();
    selectedClass.value = null;
}

function getTeacherId() {
    return Cookies.get('teacherId'); // Get the teacher ID from the cookie
}
</script>

<style scoped>
.container {
    width: 500px;
    margin: auto;
    padding: 20px;
    border-radius: 8px;
}
.input-field {
    width: 100%;
    margin-bottom: 15px;
    padding: 10px;
    box-sizing: border-box;
}
.title, .deadline {
    text-align: center;
    font-size: 16px;
    width: 50%;
}
.error {
    color: rgb(255, 94, 0);
}
</style>
