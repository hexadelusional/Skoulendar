<template>
    <div>
        <h1>
            teacher
        </h1>
        <Chad/>
        <HomeworkGiving/>
        <HomeworkViewing/>
    </div>
</template>  

<script setup>
  import Chad from './Chad.vue';
  import HomeworkGiving from './HomeworkGiving.vue';
  import HomeworkViewing from './HomeworkViewing.vue';
</script>

<style scoped>
  div{
    margin: 10% auto;
  }
  h1{
    font-size: 50px;
  }
</style>
