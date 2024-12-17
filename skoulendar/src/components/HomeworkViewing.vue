<template>
    <div class="container">
        <h1>View Homework</h1>

        <div v-if="submitErrorLessons" class="error">{{ submitErrorLessons }}</div>

        <div v-for="classItem in lessons" :key="classItem.class_id" class="class-section">
            <h2>{{ classItem.lesson_name }}</h2>

            <div v-if="!homeworksByClass[classItem.class_id]">
                No homework assigned... YET.
            </div>

            <ul v-if="homeworksByClass[classItem.class_id]?.length > 0">
                <li v-for="homework in homeworksByClass[classItem.class_id]" :key="homework.homework_id">
                    <div :class="['homework-card', { 'completed': homework.completed }]">
                        <div class="homework-header">
                            <h3>{{ homework.title }}</h3>
                            <label>
                                <input
                                    type="checkbox"
                                    :checked="homework.completed"
                                    @change="handleCheckboxChange(homework)"
                                /> Mark as Completed
                            </label>
                        </div>
                        <p><strong>Instructions: </strong>{{ homework.description }}</p>
                        <p><strong>Deadline:</strong> {{ formatDate(homework.deadline) }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';

const lessons = ref([]);
const homeworksByClass = ref({});
const submitErrorLessons = ref(null);
const userId = ref(Cookies.get('userId'));


// Fetch lessons for the student
async function fetchLessons() {
    try {
        const response = await axios.get('http://localhost:1234/api/classList', {
            params: { student_id: userId.value }
        });
        lessons.value = Array.isArray(response.data) ? response.data : [];
        fetchHomework(); 
    } catch (error) {
        submitErrorLessons.value = 'Error loading lessons. Please try again later.';
    }
}


// Fetch homework for the student
async function fetchHomework() {
    if (!userId.value) {
        submitErrorLessons.value = 'Student ID is missing. Please log in again.';
        return;
    }
    try {
        const response = await axios.get('http://localhost:1234/api/homework', {
            params: { student_id: userId.value }
        });
        const groupedHomeworks = groupHomeworkByClass(response.data);        
        homeworksByClass.value = groupedHomeworks;

    } catch (error) {
        submitErrorLessons.value = 'Error loading homework.😬';
    }
}

// Group homework by class ID
function groupHomeworkByClass(homeworkList) {
    const grouped = {};
    homeworkList.forEach(homework => {
        if (!homework.class_id) return;
        if (!grouped[homework.class_id]) {
            grouped[homework.class_id] = [];
        }
        grouped[homework.class_id].push(homework); 
    });
    return grouped;
}

// Format date to readable format
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

async function handleCheckboxChange(homework) {
    // Optimistically update the state
    homework.completed = !homework.completed; // Toggle the completed status

    // Now call the API
    try {
        await axios.put('http://localhost:1234/api/homework/update', {
            homeworkId: homework.homework_id,
            completed: homework.completed,
            userId: userId.value
        });

        // Fetch homework again to ensure up-to-date state, if needed can also directly alter local state
        await fetchHomework();
    } catch (error) {
        console.error('Error updating homework status:', error.response?.data || error);
        submitErrorLessons.value = error.response?.data.message || 'Error updating homework status. 😬';

        // Revert the optimistic change on failure
        homework.completed = !homework.completed; // Revert back the change
    }
}

onMounted(() => {
    fetchLessons();
});
</script>


<style scoped>
.error {
    color: rgb(255, 94, 0);
}

.container {
    padding: 0 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.homework-card {
    background-color: #e0f7fa; 
    border-radius: 10px;
    padding: 20px;
    margin: 10px 0;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease; 
}

.homework-card.completed {
    background-color: #98c1b06e; 
    color:#30433b85;
}

.homework-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

.homework-header label {
    display: flex;
    align-items: center;
}

h3 {
    font-size: 1.2rem;
    font-weight: bold;
    margin: 0;
}

ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

li {
    margin-bottom: 20px;
}
</style>
