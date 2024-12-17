<template>
    <div>
        <h1>Lessons List</h1>
        <div class="flex">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input class="search" type="text" v-model="searchTerm" placeholder="Search by lesson name or class ID." @input="searchLessons" />
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
                    <th>Date</th>
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
                    <td>{{ getTeacherFullName(lesson.teacher_id) }}</td>
                    <td>{{ formatDate(lesson.lesson_date) }}</td>
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
                    <div class="radio-group">
                        <div v-for="classItem in possibleClasses" :key="classItem.id" class="radio-item">
                            <label class="radio-label">
                                <input type="radio" :value="classItem.class_id" v-model="newLesson.class_id" />
                                {{ classItem.class_id }} - {{ classItem.name }}
                            </label>
                        </div>
                    </div>   
                    <br>
                    <label for="name">Lesson Name:</label>
                    <input type="text" v-model="newLesson.name" />
                    <br>
                    <label>Teacher:</label>
                    <div class="radio-group">
                        <div v-for="teacher in teachers" :key="teacher.id" class="radio-item">
                            <label class="radio-label">
                                <input type="radio" :value="teacher.id" v-model="newLesson.teacher_id" />
                                {{ teacher.name }} {{ teacher.surname }}
                            </label>
                        </div>
                    </div>
                    <br>
                    <label for="lesson_date">Date:</label>
                    <input type="date" v-model="newLesson.lesson_date" />
                    <br>
                    <label for="time">Time:</label>
                    <input type="time" v-model="newLesson.time" />
                    <br>
                    <label for="room_number">Room Number:</label>
                    <input type="number" v-model="newLesson.room_number" min="0" max="500"/>
                    <br>
                    <label for="duration_time">Duration:</label>
                    <input type="time" v-model="newLesson.duration_time" />
                    <br>
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
                    <label>Class ID:</label>
                    <div class="radio-group">
                        <div v-for="classItem in possibleClasses" :key="classItem.class_id" class="radio-item">
                            <label class="radio-label">
                                <input 
                                    type="radio" 
                                    :value="classItem.class_id" 
                                    v-model="editableLesson.class_id"
                                    :checked="editableLesson.class_id === classItem.class_id"
                                />
                                {{ classItem.class_id }} - {{ classItem.name }}
                            </label>
                        </div>
                    </div>
                    <br>
                    <label for="name">Lesson Name:</label>
                    <input type="text" v-model="editableLesson.name" />
                    <br>
                    <div class="radio-group">
                        <div v-for="teacher in teachers" :key="teacher.id" class="radio-item">
                            <label class="radio-label">
                                <input
                                    type="radio"
                                    :value="teacher.id"
                                    v-model="editableLesson.teacher_id"
                                    :checked="editableLesson.teacher_id === teacher.id"
                                />
                                {{ teacher.name }} {{ teacher.surname }} 
                            </label>
                        </div>
                    </div>
                    <br>
                    <label for="lesson_date">Date:</label>
                    <input type="date" v-model="editableLesson.lesson_date" />
                    <br>
                    <label for="time">Time:</label>
                    <input type="time" v-model="editableLesson.time" />
                    <br>
                    <label for="room_number">Room Number:</label>
                    <input type="number" v-model="editableLesson.room_number" min="0" max="500"/>
                    <br>
                    <label for="duration_time">Duration:</label>
                    <input type="time" v-model="editableLesson.duration_time" />
                    <br>
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
    const teachers = ref([]); 

    const newLesson = ref({
        class_id: '',
        name: '',
        teacher_id: null,
        time: '',
        lesson_date: '',
        room_number: null,
        duration_time: '',
    });

    const editableLesson = ref({});

    async function fetchLessons() {
        try {
            const response = await axios.get('http://localhost:1234/api/lessons'); 
            lessons.value = response.data;
            filteredLessons.value = lessons.value; 
        } catch (error) {
            console.error('Error fetching lessons:', error);
            errorMessage.value = 'Unable to fetch lessons...😬';
        }
    }

    // Fetch Available Classes
    async function fetchClasses() {
        try {
            const response = await axios.get('http://localhost:1234/api/classes'); 
            possibleClasses.value = response.data; 
        } catch (error) {
            console.error('Error fetching classes:', error);
            errorMessage.value = 'Unable to fetch classes. Please try again.';
        }
    }

    // Fetch Teachers Function
    async function fetchTeachers() {
        try {
            const response = await axios.get('http://localhost:1234/api/users/teachers');
            teachers.value = response.data; // Assuming the response.data is an array of teacher objects
        } catch (error) {
            console.error('Error fetching teachers:', error);
            errorMessage.value = 'Unable to fetch teachers. Please try again.';
        }
    }

    function getTeacherFullName(teacherId) {
        const teacher = teachers.value.find(t => t.id === teacherId);
        return teacher ? `${teacher.name} ${teacher.surname}` : 'Unknown Teacher'; // Fallback if not found
    }

    // Searching for lessons based on input
    function searchLessons() {
        const term = searchTerm.value.toLowerCase();
        if (!term) {
            filteredLessons.value = lessons.value; 
            searchMessage.value = '';
            return;
        }

        filteredLessons.value = lessons.value.filter(lesson =>
            lesson.name.toLowerCase().includes(term) || lesson.class_id.toLowerCase().includes(term)
        );

        searchMessage.value = filteredLessons.value.length ? '' : 'No lessons found under that name or id...🧐';
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
            lesson_date: '',
            room_number: null,
            duration_time: '',
        };
        selectedClassIds.value = [];
        errorMessage.value = '';
    }

    // Adding a new lesson
    async function addLesson() {
        errorMessage.value = '';
        // Validation check
        if (
            !newLesson.value.name.trim() || 
            !newLesson.value.teacher_id || 
            !newLesson.value.lesson_date || 
            !newLesson.value.time || 
            !newLesson.value.room_number || 
            !newLesson.value.duration_time
        ) {
            errorMessage.value = 'All fields must be filled in.☝️';
            return;
        }

        // Continue to process adding the lesson
        try {
            const response = await axios.post('http://localhost:1234/api/lessons', {
                class_id: newLesson.value.class_id, // Use the radio-selected class_id
                name: newLesson.value.name.trim(),
                teacher_id: newLesson.value.teacher_id,
                time: newLesson.value.time,
                lesson_date: newLesson.value.lesson_date,
                room_number: newLesson.value.room_number,
                duration_time: newLesson.value.duration_time,
            });
            
            // Assuming fetchLessons is a method that refreshes lessons list
            await fetchLessons(); 
            closeAddWindow();
        } catch (error) {
            console.error('Error adding lesson:', error);
            errorMessage.value = 'Error adding lesson.😬';
        }
    }


    // Opening the edit lesson window and loading data
    async function editLesson(lesson) {
        editableLesson.value = {
            class_id: lesson.class_id,
            name: lesson.name,
            teacher_id: lesson.teacher_id, 
            lesson_date: lesson.lesson_date.split('T')[0], 
            time: lesson.time,
            room_number: lesson.room_number,
            duration_time: lesson.duration_time,
            lesson_id: lesson.lesson_id 
        };
        await fetchTeachers(); 
        isEditwindowOpen.value = true; 
    }

    function closeEditWindow() {
        isEditwindowOpen.value = false; 
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    }

    async function updateLesson() {
        errorMessage.value = ''; 
        
        // Validation if a teacher is selected
        if (!editableLesson.value.teacher_id) {
            errorMessage.value = 'You must select a teacher.☝️';
            return;
        }

        if (!editableLesson.value.class_id) {
            errorMessage.value = 'You must select a class.☝️';
            return;
        }
        try {
            await axios.put(`http://localhost:1234/api/lessons/${editableLesson.value.lesson_id}`, {
                class_id: editableLesson.value.class_id,
                name: editableLesson.value.name.trim(),
                teacher_id: editableLesson.value.teacher_id, 
                lesson_date: editableLesson.value.lesson_date,
                time: editableLesson.value.time,
                room_number: editableLesson.value.room_number,
                duration_time: editableLesson.value.duration_time,
            });

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
        fetchTeachers();
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
</style>
