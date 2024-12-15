<template>
    <div class="container">
        <h1>View Homework</h1>
        <div v-if="submitErrorLessons" class="error">{{ submitErrorLessons }}</div>

        <div v-for="classItem in lessons" :key="classItem.id" class="class-section">
            <h2>{{ classItem.name }}</h2>
            <div v-if="!homeworksByClass[classItem.id] || homeworksByClass[classItem.id].length === 0">
                No homework assigned... YET.
            </div>


            <ul v-if="homeworksByClass[classItem.id]?.length">
                <li v-for="homework in homeworksByClass[classItem.id]" :key="homework.id">
                    <div :class="['homework-card', { 'completed': homework.completed }]">
                        <div class="homework-header">
                            <h3>{{ homework.title }}</h3>

                            <label>
                                <input
                                    type="checkbox"
                                    v-model="homework.completed"
                                    @change="updateHomeworkStatus(homework)"
                                />
                                Mark as Completed
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
const isLoadingLessons = ref(false);
const isLoadingHomework = ref(false);
const submitErrorLessons = ref(null);
const submitErrorHomework = ref(null);

const studentId = ref(Cookies.get('studentId'));

// Fetch the lessons that the student is enrolled in
async function fetchLessons() {
    if (!studentId.value) {
        submitErrorLessons.value = 'Student ID is missing. Please log in again.';
        return;
    }

    isLoadingLessons.value = true;
    submitErrorLessons.value = null;

    try {
        const response = await axios.get(`http://localhost:1234/api/classList`, {
            params: { student_id: studentId.value }
        });
        lessons.value = response.data;
        fetchHomework();
    } catch (error) {
        submitErrorLessons.value = 'Error loading lessons. Please try again later.';
    } finally {
        isLoadingLessons.value = false;
    }
}

// Fetch homework data and group it by class
async function fetchHomework() {
    if (!studentId.value) {
        submitErrorHomework.value = 'Student ID is missing. Please log in again.';
        return;
    }

    isLoadingHomework.value = true;
    submitErrorHomework.value = null;

    try {
        const response = await axios.get('http://localhost:1234/api/homework', {
            params: {
                student_id: studentId.value // Ensure homework is for the logged-in student
            }
        });

        // Group homework by class and set the homework state
        const groupedHomeworks = groupHomeworkByClass(response.data);

        // Get saved homework states from localStorage or cookies
        const savedHomeworks = JSON.parse(localStorage.getItem('homeworksState')) || {};

        // Apply saved state to the homeworks
        for (const classId in groupedHomeworks) {
            groupedHomeworks[classId].forEach(homework => {
                // Check if saved state exists for the homework
                if (savedHomeworks[homework.id] !== undefined) {
                    homework.completed = savedHomeworks[homework.id];
                }
            });
        }

        homeworksByClass.value = groupedHomeworks;
    } catch (error) {
        console.error('Error fetching homework:', error);
        submitErrorHomework.value = 'Error loading homework. Please try again later.';
    } finally {
        isLoadingHomework.value = false;
    }
}

// Group homework by class ID
function groupHomeworkByClass(homeworkList) {
    const grouped = {};
    homeworkList.forEach(homework => {
        if (!grouped[homework.lesson_id]) {
            grouped[homework.lesson_id] = [];
        }
        grouped[homework.lesson_id].push(homework);
    });
    return grouped;
}

// Format date for better readability
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Update homework completion status and save to localStorage
async function updateHomeworkStatus(homework) {
    try {
        // Update in backend (optional)
        await axios.put('http://localhost:1234/api/homework/update', {
            homeworkId: homework.id,
            completed: homework.completed,
            studentId: studentId.value
        });

        // Save the updated completion status in localStorage
        let savedHomeworks = JSON.parse(localStorage.getItem('homeworksState')) || {};
        savedHomeworks[homework.id] = homework.completed;

        // Store the updated state in localStorage
        localStorage.setItem('homeworksState', JSON.stringify(savedHomeworks));

    } catch (error) {
        submitErrorHomework.value = 'Error updating homework status. Please try again later.';
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
