<template>

    <div class="container">

        <h1>Assign Homework</h1>

        <div v-if="submitError" class="error">{{ submitError }}</div>

        <label for="class-select">Select a class:</label> <br />

        <select v-model="selectedClass" id="class-select" class="input-field">

            <option v-for="classItem in lessons" :key="classItem.class_id" :value="classItem.class_id">

                {{ classItem.class_id }} - {{ classItem.name }} <!-- Show both the ID and the name -->

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

const lessons = ref([]);

const selectedClass = ref(null);

function getTodayDate() {

    const today = new Date();

    const dd = String(today.getDate()).padStart(2, '0');

    const mm = String(today.getMonth() + 1).padStart(2, '0');

    const yyyy = today.getFullYear();

    return `${yyyy}-${mm}-${dd}`; // formatted date in yyyy-mm-dd

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

    fetchLessons();

});

async function fetchLessons() {

    isLoading.value = true;

    submitError.value = null;

    try {

        const teacherId = getTeacherId();

        const response = await axios.get(
            `http://localhost:1234/api/lessons?teacher_id=${teacherId}`
            );

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

    // Ensure that selectedClass and selectedLesson are defined in your Vue instance
    const selectedLesson = lessons.value.find(lesson => lesson.class_id === selectedClass.value);

    // If lesson_id was not found, you should handle that.
    if (!selectedLesson) {
        submitError.value = 'Selected class does not correspond to a lesson.';
        isSubmitting.value = false;
        return;
    }

    const payload = {
        title: homework.value.title,
        description: homework.value.description,
        deadline: homework.value.deadline,
        class_id: selectedClass.value,
        teacher_id: getTeacherId(),
        lesson_id: selectedLesson.lesson_id, // Add lesson_id here
    };

    try {
        const response = await axios.post('http://localhost:1234/api/homework', payload);
        alert('Homework assigned successfully!😃');
        resetForm();
    } catch (error) {
        if (error.response) {
            submitError.value = error.response.data.message || 'Failed to assign homework...😬';
        } else {
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

    return 8; // Example; replace this with the actual method to get the logged-in teacher's ID

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