<template>
  <div>
      <h1>Admin Timetable</h1>
      <div>
        <div class="flex">
            <i class="fa-solid fa-magnifying-glass"></i>
            <label for="user-id"></label>
            <input class="search" v-model="inputUserId" type="text" id="user-id" placeholder="Enter User ID" />
            <select v-model="selectedRole" id="user-role">
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
            </select>
            <button class="butt" @click="fetchUserTimetable">Get Timetable</button>
        </div>
      </div>
      <h3 v-if="userName || userId">
        <span class="error">Results for id {{ userId }}:</span> {{ userName }}'s timetable
      </h3>
      <div class="container" v-if="lessons_as_events.length > 0">
          <Timetable :events="lessons_as_events" @eventClicked="handleEventClick" />
      </div>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <div v-if="selectedEvent" class="modal-overlay" @click="closeDetails">
          <div class="modal-content" @click.stop>
              <h2>{{ formatDate(selectedEvent.start, 'date') }}</h2>
              <p v-if="selectedEvent.title"><strong>Lesson:</strong> {{ selectedEvent.title }}</p>
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
  import Timetable from './Timetable.vue';
  import { ref } from 'vue';
  import axios from 'axios';

  const lessons_as_events = ref([]);
  const errorMessage = ref('');
  const selectedEvent = ref(null);
  const inputUserId = ref('');
  const selectedRole = ref('');
  const userName = ref('');
  const userId = ref('');

  async function fetchUserTimetable() {
    if (!inputUserId.value || !selectedRole.value) {
        errorMessage.value = 'Please provide a User ID and select a role.☝️';
        return;
    }
    errorMessage.value = '';
    try {
        // Get the relevant lessons based on the role
        const teachersResponse = await axios.get('http://localhost:1234/api/users/teachers');
        const teachers = teachersResponse.data.reduce((acc, teacher) => {
            acc[teacher.id] = `${teacher.name} ${teacher.surname}`;
            return acc;
        }, {});
        // Call the appropriate function based on the selected role
        if (selectedRole.value === 'teacher') {
            await fetchTeacherLessons(teachers);
        } else if (selectedRole.value === 'student') {
            await fetchStudentLessons(teachers);
        } else {
            errorMessage.value = 'Invalid role selected.';
        }
        await fetchUserDetails(); 
    } catch (error) {
        console.error('Error fetching timetable:', error);
        errorMessage.value = error.response ? error.response.data.message : 'Network error or server is unreachable.';
    }
  }

  async function fetchUserDetails() {
      try {
          const response = await axios.get(`http://localhost:1234/api/users/${inputUserId.value}`);
          userName.value = `${response.data.name} ${response.data.surname}`;
          userId.value = response.data.id;
      } catch (error) {
          console.error('Error fetching user details:', error);
          userName.value = 'User not found';
          userId.value = '';
      }
  }
  // Fetch teacher lessons based on the teacher ID
  async function fetchTeacherLessons(teachers) {
    try {
        const response = await axios.get('http://localhost:1234/api/lessons', {
            params: { teacher_id: inputUserId.value },
        });
        lessons_as_events.value = response.data.map(lesson => processLessonData(lesson, teachers));
      } catch (error) {
        console.error('Error while fetching teacher lessons:', error);
        errorMessage.value = error.response ? error.response.data.message : 'Network error or server is not reachable.';
    }
  }

  // Fetch student lessons based on the student ID
  async function fetchStudentLessons(teachers) {
    try {
        const response = await axios.get('http://localhost:1234/api/classList', {
            params: { student_id: inputUserId.value },
        });

        lessons_as_events.value = response.data.map(lesson => processLessonData(lesson, teachers));

      } catch (error) {
        console.error('Error while fetching student lessons:', error);
        errorMessage.value = error.response ? error.response.data.message : 'Network error or server is not reachable.';
    }
  }

  // Process lesson data to format it as an event
  function processLessonData(lesson, teachers) {
    const lessonDate = lesson.lesson_date ? lesson.lesson_date.split('T')[0] : 'unknown date';
    const startingTime = lesson.time ? lesson.time.slice(0, 5) : '00:00';
    const startDateTimeString = `${lessonDate} ${startingTime}`; // Combine date and time as a string
    const startDateTime = new Date(`${startDateTimeString}`);

    const durationParts = lesson.duration_time ? lesson.duration_time.split(":").map(Number) : [0, 0];
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + durationParts[0]); // Add hours
    endDateTime.setMinutes(endDateTime.getMinutes() + durationParts[1]); // Add minutes

    // Format start and end times as YYYY-MM-DD HH:MM
    const formattedStart = `${startDateTime.getFullYear()}-${String(startDateTime.getMonth() + 1).padStart(2, '0')}-${String(startDateTime.getDate()).padStart(2, '0')} ${String(startDateTime.getHours()).padStart(2, '0')}:${String(startDateTime.getMinutes()).padStart(2, '0')}`;
    const formattedEnd = `${endDateTime.getFullYear()}-${String(endDateTime.getMonth() + 1).padStart(2, '0')}-${String(endDateTime.getDate()).padStart(2, '0')} ${String(endDateTime.getHours()).padStart(2, '0')}:${String(endDateTime.getMinutes()).padStart(2, '0')}`;
    const teacherName = teachers[lesson.teacher_id] || 'Unknown Teacher';

    return {
        title: lesson.lesson_name || lesson.name,
        start: formattedStart, 
        end: formattedEnd,
        info1: lesson.room_number || 'N/A',
        info2: lesson.class_id || 'N/A',
        teacher: teacherName,
    };
  }

  function handleEventClick(event) {
      selectedEvent.value = event;
  }

  function closeDetails() {
      selectedEvent.value = null;
  }

  function formatDate(dateString, type) {
  const date = new Date(dateString);
  if (type === 'date') {
    // Format for date
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-GB', options); 
  } else {
    // Format for time
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    return date.toLocaleTimeString('en-GB', options);
  }
}

</script>

<style scoped>
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
    z-index: 9999; 
  }

  .modal-content {
    background: #fff;
    border: 2px solid #005da0;
    padding: 20px;
    border-radius: 20px;
    z-index: 10000;
  }

  .modal-content h2 {
    margin-bottom: 10px;
  }

  .modal-content p {
    margin: 5px 0;
  }

  .container {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
  }
  select {
    background-color: #c8d6f3;
    color: #005da0;
    font: inherit;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.067);
  }
  .flex{
    display: flex;
    justify-content: center;
  }
  .search{
    width: 30%;
    height: 30px;
    padding: 8px;
    border: 2px solid #acbbda;
  }
  i{
    margin: 25px;
  }

  .butt{
    padding: 15px;
    margin: 10px;
    border: solid 2px #bacaeb;
    background-color: #c8d6f3;
    border-radius: 10px;
    color: #005da0;
    font-size: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.067);
  }
  .butt:hover{
      background-color: #b0d4ee;
      border: solid 2px #2b7cb6ae;
  }
</style>