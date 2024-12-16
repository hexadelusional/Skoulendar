<template>
    <div>
        <h1>Lessons List</h1>

        <div class="flex">
            <input
                class="search"
                type="text"
                v-model="searchTerm"
                placeholder="Search by lesson name or class ID."
                @input="searchLessons"
            />
            <button class="add" @click="openAddWindow">&plus; Add Lesson</button>
        </div>

        <p v-if="searchMessage" class="error">{{ searchMessage }}</p>

        <table v-if="filteredLessons.length > 0">
            <thead>
                <tr>
                    <th>Lesson ID</th>
                    <th>Class ID</th>
                    <th>Name</th>
                    <th>Teacher ID</th>
                    <th>Time</th>
                    <th>Room Number</th>
                    <th>Duration</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="lesson in filteredLessons" :key="lesson.lesson_id">
                    <td>{{ lesson.lesson_id }}</td>
                    <td>{{ lesson.class_id }}</td>
                    <td>{{ lesson.name }}</td>
                    <td>{{ lesson.teacher_id }}</td>
                    <td>{{ lesson.time }}</td>
                    <td>{{ lesson.room_number }}</td>
                    <td>{{ lesson.duration_time }}</td>
                    <td>
                        <button @click="editLesson(lesson)">Edit</button>
                        <button @click="deleteLesson(lesson.lesson_id)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <!-- Add Lesson Window -->
        <div v-if="isAddwindowOpen" class="window">
            <div class="window-content">
                <span class="cross" @click="closeAddWindow">&times;</span>
                <h4>Add Lesson</h4>
                <form @submit.prevent="addLesson">
                    <label>Class ID:</label>
                    <div class="checkbox-group">
                        <div v-for="classItem in possibleClasses" :key="classItem.id" class="checkbox-item">
                            <label class="checkbox-label">
                                <input type="checkbox" :value="classItem.class_id" v-model="selectedClassIds"/>
                                {{ classItem.class_id }} - {{ classItem.name }}
                            </label>
                        </div>
                    </div>   
                    <br />

                    <label for="name">Lesson Name:</label>
                    <input type="text" v-model="newLesson.name" />

                    <br />

                    <label for="teacher_id">Teacher ID:</label>
                    <input type="number" v-model="newLesson.teacher_id" />

                    <br />

                    <label for="time">Time:</label>
                    <input type="time" v-model="newLesson.time" />

                    <br />

                    <label for="room_number">Room Number:</label>
                    <input type="number" v-model="newLesson.room_number" />

                    <br />

                    <label for="duration_time">Duration:</label>
                    <input type="time" v-model="newLesson.duration_time" />

                    <br />

                    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
                    <button type="submit">Add Lesson</button>
                </form>
            </div>
        </div>

        <!-- Edit Lesson Window -->
        <div v-if="isEditwindowOpen" class="window">
            <div class="window-content">
                <span class="cross" @click="closeEditWindow">&times;</span>
                <h4>Edit Lesson</h4>
                <form @submit.prevent="updateLesson">
                    <label for="class_id">Class ID:</label>
                    <input type="text" v-model="editableLesson.class_id" />

                    <br />

                    <label for="name">Lesson Name:</label>
                    <input type="text" v-model="editableLesson.name" />

                    <br />

                    <label for="teacher_id">Teacher ID:</label>
                    <input type="number" v-model="editableLesson.teacher_id" />

                    <br />

                    <label for="time">Time:</label>
                    <input type="time" v-model="editableLesson.time" />

                    <br />

                    <label for="room_number">Room Number:</label>
                    <input type="number" v-model="editableLesson.room_number" />

                    <br />

                    <label for="duration_time">Duration:</label>
                    <input type="time" v-model="editableLesson.duration_time" />

                    <br />

                    <button type="submit">Update Lesson</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const lessons = ref([]);
const filteredLessons = ref([]);
const searchTerm = ref('');
const errorMessage = ref('');
const searchMessage = ref('');
const isAddwindowOpen = ref(false);
const isEditwindowOpen = ref(false);
const possibleClasses = ref([]);
const selectedClassIds = ref([]);

const newLesson = ref({
    class_id: '',
    name: '',
    teacher_id: null,
    time: '',
    room_number: null,
    duration_time: '',
});

const editableLesson = ref({});

// Fetching all lessons when the component is mounted
async function fetchLessons() {
    try {
        const response = await axios.get('http://localhost:1234/api/lessons'); // Ensure correct endpoint
        lessons.value = response.data;
        filteredLessons.value = lessons.value; // Initialize filtered lessons
    } catch (error) {
        console.error('Error fetching lessons:', error);
        errorMessage.value = 'Unable to fetch lessons...😬';
    }
}

// Fetch Available Classes
async function fetchClasses() {
    try {
        const response = await axios.get('http://localhost:1234/api/classes'); // Update with your actual endpoint
        possibleClasses.value = response.data; // Assuming response contains the list of classes
    } catch (error) {
        console.error('Error fetching classes:', error);
        errorMessage.value = 'Unable to fetch classes. Please try again.';
    }
}

// Searching for lessons based on input
function searchLessons() {
    const term = searchTerm.value.toLowerCase();
    if (!term) {
        filteredLessons.value = lessons.value; // Reset to all lessons
        searchMessage.value = '';
        return;
    }

    filteredLessons.value = lessons.value.filter(lesson =>
        lesson.name.toLowerCase().includes(term) || lesson.class_id.toLowerCase().includes(term)
    );

    searchMessage.value = filteredLessons.value.length ? '' : 'No lessons found...😬';
}

// Opening the add lesson window
function openAddWindow() {
    isAddwindowOpen.value = true;
    resetNewLesson();
}

// Closing the add lesson window
function closeAddWindow() {
    isAddwindowOpen.value = false;
}

// Resetting new lesson data
function resetNewLesson() {
    newLesson.value = {
        class_id: '',
        name: '',
        teacher_id: null,
        time: '',
        room_number: null,
        duration_time: '',
    };
    errorMessage.value = '';
}

// Adding a new lesson
async function addLesson() {
    errorMessage.value = '';
    // Check for empty fields
    if (selectedClassIds.value.length === 0 || !newLesson.value.name || !newLesson.value.teacher_id || !newLesson.value.time || !newLesson.value.room_number || !newLesson.value.duration_time) {
        errorMessage.value = 'All fields must be filled in.☝️';
        return;
    }
    const lessonPromises = selectedClassIds.value.map(classId => {
        // Create a new lesson based on the selected class_id
        return axios.post('http://localhost:1234/api/lessons', {
            class_id: classId,
            name: newLesson.value.name,
            teacher_id: newLesson.value.teacher_id,
            time: newLesson.value.time,
            room_number: newLesson.value.room_number,
            duration_time: newLesson.value.duration_time,
        });
    });
    try {
        await Promise.all(lessonPromises);
        await fetchLessons();
        closeAddWindow();
    } catch (error) {
        console.error('Error adding lesson:', error);
        errorMessage.value = 'Error adding lesson.😬';
    }
}

// Opening the edit lesson window and loading data
function editLesson(lesson) {
    editableLesson.value = { ...lesson }; 
    isEditwindowOpen.value = true; 
}
function closeEditWindow() {
    isEditwindowOpen.value = false; 
}

async function updateLesson() {
    try {
        await axios.put(`http://localhost:1234/api/lessons/${editableLesson.value.lesson_id}`, editableLesson.value); 
        await fetchLessons();
        closeEditWindow();
    } catch (error) {
        console.error('Error updating lesson:', error);
        errorMessage.value = 'Error updating lesson.😬';
    }
}

// Deleting a selected lesson
async function deleteLesson(lessonId) {
    if (confirm('Are you sure you want to delete this lesson?🤔')) {
        try {
            await axios.delete(`http://localhost:1234/api/lessons/${lessonId}`);
            await fetchLessons();
        } catch (error) {
            console.error('Error deleting lesson:', error);
            errorMessage.value = 'Error deleting lesson. Please try again.';
        }
    }
}

onMounted(() => {
    fetchLessons();
    fetchClasses();
});
</script>



<style scoped>
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 8px;
        text-align: left;
        border: 1px solid #aad2ef;
    }
    ul{
        list-style-type: none;
        padding-left: 5px;
        line-height: 2;
    }
    .error {
        color: rgb(255, 94, 0);
    }

    .window {
        display: block;
        position: fixed;
        z-index: 999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.219);
        justify-content: center; 
        align-items: flex-start;
        display: flex;
    }

    .window-content {
        background-color: #f3f9ff;
        margin: 15% auto;
        padding: 20px;
        border: 2px solid #83a9c6;
        border-radius: 10px;
        width: 80%;
        max-width: 500px; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center;
    }

    .cross {
        color: #a4a4a4;
        float: right;
        font-size: 35px;
        font-weight: bold;
    }

    .cross:hover, .cross:focus {
        color: #124b74ae;
        cursor: pointer;
    }
    .flex{
        display: flex;
        justify-content: space-evenly;
        flex-direction: row;
        margin: 30px 20% 30px 20%;
    }
    .add{
        font-size: 15px;
        font-weight: bold;
        width: 20%;
        margin: 0;
    }
    .search{
        width: 60%;
        height: 30px;
        padding: 8px;
        border: 2px solid #acbbda;
    }
    .search::placeholder{
        color:#5d7bb6;
    }
    .status-options {
        display: flex;  
        gap: 15px;   
        align-items: center;
    }
    .checkbox-group {
        display: flex;       
        flex-wrap: wrap;  
        line-height: 2;
    }

    .checkbox-item {
        margin-right: 15px; 
        white-space: nowrap; 
    }

    .checkbox-label {
        display: flex;    
        align-items: center;
    }

    input[type="checkbox"] {
        box-shadow: none;  
        margin-right: 5px;  
    }



</style>
