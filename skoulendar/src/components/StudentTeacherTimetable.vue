<template>
  <div>
    <h1>Timetable</h1>
    <div class="container">
      <Timetable :events="lessons_as_events" @eventClicked="handleEventClick" />
    </div>
    <p v-if="errorMessage">{{ errorMessage }}</p> <!-- Display error message if present -->

    <!-- Modal for Event Details -->
    <div v-if="selectedEvent" class="modal-overlay" @click="closeDetails">
        <div class="modal-content" @click.stop>
            <h2>Lesson Details</h2>
            <p v-if="selectedEvent.title"><strong>Title:</strong> {{ selectedEvent.title }}</p>
            <p v-if="selectedEvent.start"><strong>Start:</strong> {{ selectedEvent.start }}</p>
            <p v-if="selectedEvent.end"><strong>End:</strong> {{ selectedEvent.end }}</p>
            <p v-if="selectedEvent.info1"><strong>Room:</strong> {{ selectedEvent.info1 }}</p>
            <p v-if="selectedEvent.info2"><strong>Class ID:</strong> {{ selectedEvent.info2 }}</p>
            <p v-if="selectedEvent.teacher"><strong>Teacher:</strong> {{ selectedEvent.teacher }}</p> <!-- Added Teacher Name -->
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
const selectedEvent = ref(null); // For storing clicked event details

// Fetch lessons function for teachers
async function fetchLessons() {
  try {
    const response = await axios.get('http://localhost:1234/api/lessons', {
      params: { teacher_id: user_id.value },
    });

    lessons_as_events.value = response.data.map(lesson => {
      const lessonDate = lesson.lesson_date.split('T')[0];
      const startDateTimeString = `${lessonDate} ${lesson.time.slice(0, 5)}`;
      const startDateTime = new Date(`${startDateTimeString}:00`);
      
      const durationParts = lesson.duration_time.split(":").map(Number);
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(endDateTime.getHours() + durationParts[0]);
      endDateTime.setMinutes(endDateTime.getMinutes() + durationParts[1]);
      
      const endDateTimeString = `${endDateTime.getFullYear()}-${String(endDateTime.getMonth() + 1).padStart(2, '0')}-${String(endDateTime.getDate()).padStart(2, '0')} ${String(endDateTime.getHours()).padStart(2, '0')}:${String(endDateTime.getMinutes()).padStart(2, '0')}`;

      return {
        title: lesson.name,
        start: startDateTimeString,
        end: endDateTimeString,
        info1: lesson.room_number,
        info2: lesson.class_id || 'N/A',
        teacher: lesson.teacher_name || 'Unknown Teacher',
      };
    });
  } catch (error) {
    console.error('Error while fetching lessons:', error);
    errorMessage.value = 'Unable to fetch lessons...😬';
  }
}

// Handle event click
function handleEventClick(event) {
    console.log("Received event in parent:", event); // Check what is received
    selectedEvent.value = event; // Store the clicked event details
    console.log("Selected Event:", selectedEvent.value); // Check if selectedEvent is updated
}


// Close event details modal
function closeDetails() {
  selectedEvent.value = null;
}

onMounted(() => {
  fetchLessons();
});

</script>

<style scoped>
/* Modal styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999; /* Make sure this is higher than other elements */
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


</style>
