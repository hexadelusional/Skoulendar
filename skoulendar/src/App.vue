<template>
  <div>
    <nav>
      <router-link class="head" to="/">
        <strong><i class="fa-solid fa-house"></i></strong>
      </router-link>

      <!-- Only show the 'Users' link if the user is an Admin -->
      <router-link v-if="isAdmin" class="head" to="/users">
        <strong>Users</strong>
      </router-link>

      <!-- Only show the 'Lessons' link if the user is an Admin -->
      <router-link v-if="isAdmin" class="head" to="/lessons">
        <strong>Lessons</strong>
      </router-link>

      <!-- Only show the 'admin_timetable' link if the user is an Admin -->
      <router-link v-if="isAdmin" class="head" to="/adminTimetable" :isStudent="isStudent">
        <strong>Timetable</strong>
      </router-link>

      <!-- Only show the 'HomeworkGiving' link if the user is a Teacher -->
      <router-link v-if="isTeacher" class="head" to="/homeworkGiving">
        <strong>Homework</strong>
      </router-link>
      
      <!-- Only show the 'HomeworkViewing' link if the user is a Student -->
      <router-link v-if="isStudent" class="head" to="/homeworkViewing">
        <strong>Homework</strong>
      </router-link>

      <!-- Only show 'Timetable' link if the user is a Student or a Teacher -->
      <router-link v-if="isStudent || isTeacher" class="head" to="/timetable" :isStudent="isStudent">
        <strong>Timetable</strong>
      </router-link>

      <router-link class="head" to="/login">
        <strong><i class="fa-solid fa-right-from-bracket"></i></strong>
      </router-link>
    </nav>

    <router-view></router-view>
  </div>
  
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useAuth } from './composable/useAuth.js';
import Cookies from 'js-cookie';

// Reactive role state (initially from cookies or auth state)
const role = ref(Cookies.get('role'));

// Watch for changes in the role
const isAdmin = computed(() => role.value === 'Admin');
const isTeacher = computed(() => role.value === 'Teacher');
const isStudent = computed(() => role.value === 'Student');


// Update role when authentication state changes
watch(() => Cookies.get('role'), (newRole) => {
  role.value = newRole;  // Update the role reactively when the cookie changes
});
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-around;
  border: 1px solid #82aeffe9;
  background-color: #c8dbfee3;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.067);
}

.head {
  font-size: 20px;
  text-decoration: none;
  color: #005da0;
}

.head:hover {
  color: #5698c7;
}
</style>
