<script setup>
  import VueCal from "vue-cal"
  import 'vue-cal/dist/vuecal.css'

  const props = defineProps({
    events: {
      type: Array,
      default: () => [],
      }
  })

  function truncate(str, limit) {
    return (str.length > limit ? str.slice(0, limit-1) + '&hellip;' : str)
  }
  const LIMIT = 20

</script>

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
        <div v-if="view==='day'" class="vuecal__event-title" v-html="event.title" />
        <div v-else class="vuecal__event-title" v-html="truncate(event.title, LIMIT)"/>
        <small v-if="view==='day' || view==='week'" class="vuecal__event-subtitle">
          <span>{{ event.info1 }}</span><br/>
          <span>{{ event.info2 }}</span>
        </small>
      </template>
    </vue-cal>
  </div>


</template>

<style>
.timetable {
  align-self: center;
  height: 700px;
  width: min(100%, 1000px);
}

.vuecal__event {
  background-color: #005da0;
  border: solid 1px #5d7bb6;
  border-radius: 5px;
  color: #fff;
}

.vuecal__now-line { display: none; }

.vuecal__event-title {
  font-weight: bold;
  font-size: 1em;
}

.vuecal--month-view .vuecal__cell-content {
  justify-content: flex-start;
  height: 100%;
  align-items: flex-end;
}

.vuecal--month-view .vuecal__cell-date {padding: 4px;}
.vuecal__no-event {display: none;}

</style>