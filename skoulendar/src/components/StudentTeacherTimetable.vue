<template>
  <div>
    <h1>Timetable</h1>
    <div class="container">
      <Timetable :events="lessons_as_events" @eventClicked="handleEventClick" />
    </div>
    <p v-if="errorMessage">{{ errorMessage }}</p>

    <!-- Event details -->
    <div v-if="selectedEvent" class="modal-overlay" @click="closeDetails">
      <div class="modal-content" @click.stop>
        <h2>{{ formatDate(selectedEvent.start, 'date') }}</h2>
        <p v-if="selectedEvent.title"><strong>Title:</strong> {{ selectedEvent.title }}</p>
        <p v-if="selectedEvent.start"><strong>Time:</strong> {{ formatDate(selectedEvent.start, 'time') }} - {{ formatDate(selectedEvent.end, 'time') }}</p>
        <p v-if="selectedEvent.info1"><strong>Room:</strong> {{ selectedEvent.info1 }}</p>
        <p v-if="selectedEvent.info2"><strong>Class ID:</strong> {{ selectedEvent.info2 }}</p>
        <p v-if="selectedEvent.teacher"><strong>Teacher:</strong> {{ selectedEvent.teacher }}</p>
        <button @click="closeDetails">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Timetable from "./Timetable.vue";
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';

// Reactive variables
const lessons_as_events = ref([]);
const errorMessage = ref('');
const user_id = ref(Cookies.get('userId'));
const user_role = ref(Cookies.get('role'));
const selectedEvent = ref(null);

async function fetchLessons() {
  try {
    // Fetch teacher data only once
    const teachersResponse = await axios.get('http://localhost:1234/api/users');
    const teachers = teachersResponse.data.reduce((acc, teacher) => {
      acc[teacher.id] = `${teacher.name} ${teacher.surname}`;
      return acc;
    }, {});

    // Determine user role
    const role = user_role.value ? user_role.value.trim().toLowerCase() : '';

    // Call the appropriate function based on user role
    if (role === 'teacher') {
      await fetchTeacherLessons(teachers); // Fetch teacher lessons
    } else if (role === 'student') {
      await fetchStudentLessons(teachers); // Fetch student lessons
    } else {
      errorMessage.value = 'User role is not recognized.';
    }

  } catch (error) {
    console.error('Error while fetching lessons:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
      errorMessage.value = error.response.data.message || 'Unable to fetch lessons...😬';
    } else {
      errorMessage.value = 'Network error or server is not reachable...😬';
    }
  }
}

async function fetchTeacherLessons(teachers) {
  try {
    const response = await axios.get('http://localhost:1234/api/lessons', {
      params: { teacher_id: user_id.value },
    });

    // Process the lessons data from the response
    lessons_as_events.value = response.data.map(lesson => processLessonData(lesson, teachers));

  } catch (error) {
    console.error('Error while fetching teacher lessons:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
      errorMessage.value = error.response.data.message || 'Unable to fetch teacher lessons...😬';
    } else {
      errorMessage.value = 'Network error or server is not reachable...😬';
    }
  }
}

async function fetchStudentLessons(teachers) {
  try {
    const response = await axios.get('http://localhost:1234/api/classList', {
      params: { student_id: user_id.value },
    });

    // Process the lessons data from the response
    lessons_as_events.value = response.data.map(lesson => processLessonData(lesson, teachers));

  } catch (error) {
    console.error('Error while fetching student lessons:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
      errorMessage.value = error.response.data.message || 'Unable to fetch student lessons...😬';
    } else {
      errorMessage.value = 'Network error or server is not reachable...😬';
    }
  }
}

function processLessonData(lesson, teachers) {
  // Ensure lesson_date is available and handle potential issues
  const lessonDate = lesson.lesson_date ? lesson.lesson_date.split('T')[0] : 'unknown date';
  const startingTime = lesson.time ? lesson.time.slice(0, 5) : '00:00';
  const startDateTimeString = `${lessonDate} ${startingTime}`;
  const startDateTime = new Date(`${startDateTimeString}:00`);

  const durationParts = lesson.duration_time ? lesson.duration_time.split(":").map(Number) : [0, 0];
  const endDateTime = new Date(startDateTime);
  endDateTime.setHours(endDateTime.getHours() + durationParts[0]);
  endDateTime.setMinutes(endDateTime.getMinutes() + durationParts[1]);

  const endDateTimeString = `${endDateTime.getFullYear()}-${String(endDateTime.getMonth() + 1).padStart(2, '0')}-${String(endDateTime.getDate()).padStart(2, '0')} ${String(endDateTime.getHours()).padStart(2, '0')}:${String(endDateTime.getMinutes()).padStart(2, '0')}`;

  const teacherName = teachers[lesson.teacher_id] || 'Unknown Teacher';

  return {
    title: lesson.lesson_name || lesson.name,
    start: startDateTimeString,
    end: endDateTimeString,
    info1: lesson.room_number || 'N/A',
    info2: lesson.class_id || 'N/A',
    teacher: teacherName,
  };
}


// Handle event click
function handleEventClick(event) {
  console.log("Received event in parent:", event); // Check what is received
  selectedEvent.value = event; // Store the clicked event details
  console.log("Selected Event:", selectedEvent.value); // Check if selectedEvent is updated
}

// Close event details modal
function closeDetails() {
  console.log("Closing modal...");
  selectedEvent.value = null;
}

// Helper function to format the date
function formatDate(dateString, type) {
  const date = new Date(dateString);
  if (type === 'date') {
    // Format for date
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-GB', options); // Using British format
  } else {
    // Format for time
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    return date.toLocaleTimeString('en-GB', options); // Using British format
  }
}

onMounted(() => {
  fetchLessons();
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Ensure it's visible */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Adjust as needed */
}

.modal-content {
  background: #fff;
  border: 2px solid #005da0;
  padding: 20px;
  border-radius: 20px;
  z-index: 10000; /* Higher than overlay */
}

.modal-content h2 {
  margin-bottom: 10px;
}

.modal-content p {
  margin: 5px 0;
}

button {
  margin-top: 15px;
  padding: 8px 16px;
  background-color: #005da0;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #004080;
}

.container{
  display: flex;
  justify-content: center;
  margin: auto;
}
</style>
