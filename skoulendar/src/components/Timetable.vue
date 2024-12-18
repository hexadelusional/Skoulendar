<template>
  <div class="timetable">
    <vue-cal
      small
      :hide-weekdays="[7]"
      :disableViews="['years']"
      events-on-month-view="short"
      :time-from="7*60"
      :time-to="20*60"
      :events="events"
      :on-event-click="openDetails"
    >
    <template #event="{ event, view }">
    <div class="vuecal__event" @mouseover="hovering = true" @mouseleave="hovering = false">
        <div v-if="view === 'day'" class="vuecal__event-title" v-html="event.title" />
        <div v-else class="vuecal__event-title" v-html="truncate(event.title, LIMIT)" />
        <small v-if="view === 'day' || view === 'week'" class="vuecal__event-subtitle">
            <span>{{ event.info1 }}</span><br />
            <span>{{ event.info2 }}</span>
        </small>
    </div>
</template>

    </vue-cal>
  </div>
</template>


<script setup>
import VueCal from "vue-cal";
import 'vue-cal/dist/vuecal.css';


const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  }
})

function truncate(str, limit) {
  return (str.length > limit ? str.slice(0, limit - 1) + '&hellip;' : str)
}

const LIMIT = 20

// Define the openDetails function
import { defineEmits } from 'vue';
const emit = defineEmits(['eventClicked']); // Define custom event

function openDetails(event) {
    console.log("Event clicked in Timetable.vue:", event);
    emit('eventClicked', event); // sends the event
}


</script>

<style>
.timetable {
  align-self: center;
  height: 700px;
  width: min(100%, 1000px);
}

.vuecal__event {
    background-color: #005da0; /* Normal background color */
    border-radius: 5px;
    color: #fff;
    transition: background-color 0.3s, border-color 0.3s, transform 0.3s; /* Added for smoothness */
    position: relative; /* Added for stacking context */
    z-index: 1; /* Ensure this is above anything below */
}

.vuecal__event:hover {
    background-color: #007bff; /* Color on hover */
    border-color: #0056b3; /* Border color on hover */
    cursor: pointer; /* Change cursor to pointer */
    transform: scale(1.05); /* Slight scaling effect on hover */
    z-index: 2; /* On top of other events */
}

.vuecal__now-line { display: none; }

.vuecal__event-title {
  font-weight: bold;
  font-size:  0.85em;
}

.vuecal--month-view .vuecal__cell-content {
  justify-content: flex-start;
  height: 100%;
  align-items: flex-end;
}

.vuecal--month-view .vuecal__cell-date { padding: 4px; }
.vuecal__no-event { display: none; }
</style>
