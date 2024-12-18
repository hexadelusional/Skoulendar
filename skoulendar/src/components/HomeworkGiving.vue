<template>
    <div class="container">
        <h1>Assign Homework</h1>
        <div v-if="submitError" class="error">{{ submitError }}</div>
        <label for="class-select">Select a class:</label><br />
        <select v-model="selectedClass" id="class-select" class="input-field">
            <option v-for="classItem in uniqueLessons" :key="classItem.class_id" :value="classItem.class_id">
                {{ classItem.class_id }} - {{ classItem.name }}
            </option>
        </select>
        <div>
            <input type="text" v-model="homework.title" placeholder="TITLE" class="title" />
            <textarea v-model="homework.description" placeholder="Description" class="input-field"></textarea>
            <input type="date" v-model="homework.deadline" class="deadline" />
        </div>

        <button @click="submitHomework" :disabled="isSubmitting">Assign Homework</button>
        <div v-if="isSubmitting">Assigning homework...⏳</div>

        <h1>Homework Status</h1>
        <div v-for="classItem in uniqueClasses" :key="classItem.class_id" class="class-section">
            <h2>{{ classItem.class_id }} - {{ classItem.name }}</h2>
            <div v-if="filteredHomeworkStatus(classItem.class_id).length">
                <table class="homework-status-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Homework Title</th>
                            <th>Instructions</th>
                            <th>Deadline</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in filteredHomeworkStatus(classItem.class_id)" :key="item.homework_id">
                            <td>{{ item.student_name }}</td>
                            <td>{{ item.student_surname }}</td>
                            <td>{{ item.title }}</td>
                            <td>{{ item.description }}</td>
                            <td>{{ formatDate(item.deadline) }}</td>
                            <td v-html="getCompletionIcon(item.completed)"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <p>No homework is assigned.</p>
            </div>
        </div>
    </div>
</template>




<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';

const lessons = ref([]);
const selectedClass = ref(null);
const userId = ref(null);
const homeworkStatus = ref([]);
const submitError = ref(null);
const isSubmitting = ref(false);

const uniqueClasses = computed(() => {
    const uniqueMap = new Map();
    lessons.value.forEach(lesson => {
        if (!uniqueMap.has(lesson.class_id)) {
            uniqueMap.set(lesson.class_id, lesson);
        }
    });
    return Array.from(uniqueMap.values());
});

const uniqueLessons = computed(() => {
    const uniqueMap = new Map();
    lessons.value.forEach(lesson => {
        if (!uniqueMap.has(lesson.class_id)) {
            uniqueMap.set(lesson.class_id, lesson);
        }
    });
    return Array.from(uniqueMap.values());
});
const uniqueStudents = (students) => {
    const uniqueMap = new Map();
    students.forEach(student => {
        if (!uniqueMap.has(student.student_id)) {
            uniqueMap.set(student.student_id, student);
        }
    });
    return Array.from(uniqueMap.values());
};

const filteredHomeworkStatus = (classId) => {
    // First filter by class, then get unique students
    const studentsInClass = homeworkStatus.value.filter(item => item.class_id === classId);
    return uniqueStudents(studentsInClass);
};


const getCompletionIcon = (completed) => {
    return completed ? '<i class="fa-solid fa-check success"></i>' : '<i class="fa-solid fa-xmark error"></i>';
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
};

const homework = ref({
    title: '',
    description: '',
    deadline: new Date().toISOString().split("T")[0],  // Sets to today
});

async function fetchLessons() {
    try {
        const response = await axios.get(`http://localhost:1234/api/lessons?teacher_id=${userId.value}`);
        lessons.value = response.data;
    } catch (error) {
        console.error('Error fetching lessons:', error);
        submitError.value = 'Error loading lessons... 😬';
    }
}

async function fetchHomeworkStatus() {
    try {
        const response = await axios.get(`http://localhost:1234/api/homework/status?teacher_id=${userId.value}`);
        homeworkStatus.value = response.data;
    } catch (error) {
        submitError.value = 'Error loading homework statuses... 😬';
    }
}

async function submitHomework() {
    submitError.value = null;
    isSubmitting.value = true;
    const selectedLesson = lessons.value.find(lesson => lesson.class_id === selectedClass.value);
    
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
        teacher_id: userId.value,
        lesson_id: selectedLesson.lesson_id,
    };

    try {
        const response = await axios.post('http://localhost:1234/api/homework', payload);
        alert('Homework assigned successfully! 😃');
        resetForm();
        await fetchHomeworkStatus(); // Ensure to await
    } catch (error) {
        if (error.response) {
            submitError.value = error.response.data.message || 'Failed to assign homework... 😬';
        } else {
            submitError.value = 'An error occurred when assigning homework... 😬';
        }
    } finally {
        isSubmitting.value = false;
    }
}

function resetForm() {
    homework.value.title = '';
    homework.value.description = '';
    homework.value.deadline = new Date().toISOString().split("T")[0];
    selectedClass.value = null;
}

onMounted(async () => {
    userId.value = Cookies.get('userId');

    if (userId.value) {
        await fetchLessons();
        await fetchHomeworkStatus();
    } else {
        submitError.value = 'You need to be logged in to assign homework.';
    }
});
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
</style>