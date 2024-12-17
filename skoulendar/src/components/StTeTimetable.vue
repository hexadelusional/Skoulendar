<script setup>
import Timetable from "./Timetable.vue";
import {ref, onMounted} from "vue";
import Cookies from "js-cookie";
import axios from "axios"

const lessons = ref([])
const lessons_as_events = ref([])
const errorMessage = ref('');
const user_id = ref(Cookies.get('userId'));

async function fetchLessons() {
  try {
    const r_lessons = await axios.get('http://localhost:1234/api/lessons')
    if (props.isStudent) {
      const r_class_list = await axios.get('http://localhost:1234/api/lessons/class_list')
      const r_users = await axios.get('http://localhost:1234/api/users')
      for (let i=0; i < r_class_list.data.length; i++) {
        if (r_class_list.data[i].student_id === user_id.value) {
          lessons.value.push(r_lessons.data.find(lesson => lesson.lesson_id === r_class_list.data[i].lesson_id));
        }
      }
      lessons_as_events.value = lessons.value.map((lesson) => ({
        title: lesson.name,
        start: `${lesson.lesson_date} ${lesson.time}`,
        end: `${lesson.lesson_date} ${String(new Date(lesson.time) + new Date(lesson.duration_time))}`,
        info1: lesson.room_number,
        info2: r_users.data.find(teacher => teacher.id === lesson.teacher_id)
      }));

    } else {
      for (let lesson in r_lessons.data) {
        if (lesson.teacher_id === user_id.value ) { lessons.value.push(lesson); }
      }
      lessons_as_events.value = lessons.value.map((lesson) => ({
        title: lesson.name,
        start: `${lesson.lesson_date} ${lesson.time}`,
        end: `${lesson.lesson_date} ${String(new Date(lesson.time) + new Date(lesson.duration_time))}`,
        info1: lesson.room_number,
        info2: lesson.class_id
      }))
    }

  } catch (error) {
    console.error('Error while fetching lessons:', error);
    errorMessage.value = 'Unable to fetch lessons...😬'
  }
}

const props = defineProps({
  isStudent: Boolean,
})

onMounted(() => {
  fetchLessons();
})

</script>

<template>
  <h1>Timetable</h1>
  <div class="container"><Timetable :events="lessons_as_events.value"/></div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}
</style>