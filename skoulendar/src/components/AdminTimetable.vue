<script setup>
import { ref, onMounted } from "vue";
import Cookies from "js-cookie"
import Timetable from "./Timetable.vue";

const user_id = Cookies.get("user_id");
const isFound = ref(false)
const searchUser = ref(true)
const currentTimetable = ref('')

function getTimetable() {
  isFound.value = true;
  currentTimetable.value = searchUser.value ? "Someone":"Some room"

}

</script>

<template>
  <h1>Timetable</h1>
  <div class="container">
    <div class="search_container">
      <i class="fa-solid fa-magnifying-glass"></i>
      <select v-model="searchUser">
        <option :value="true">User</option>
        <option :value="false">Room</option>
      </select>
      <input class="search" type="text" :placeholder="`${ searchUser ? 'Search by ID number':'Search by room number'}`"/>
      <button class="add" @click="getTimetable">Get Timetable</button>
    </div>
    <div v-if="isFound"><p><strong>Currently viewing <span class="viewed"> {{ currentTimetable }} </span>'s timetable</strong></p></div>
    <Timetable v-if="isFound" :events="[]"/>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
}

.search_container {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: min(100%, 1000px);
  align-self: center;
}

select {
  background-color: #c8d6f3;
  color: #005da0;
  font: inherit;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.067);
}

.viewed {
  color: rgb(255, 94, 0);
}

</style>