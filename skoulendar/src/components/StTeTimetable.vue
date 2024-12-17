<script setup>
import Timetable from "./Timetable.vue";

</script>

<template>
  <h1>Timetable</h1>
  <div class="container"><Timetable :events="[]"/></div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
</style>