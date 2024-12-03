<template>
    <div>
      <h3>Users List</h3>
  
      <table v-if="users.length > 0">
        <thead>
          <tr>
            <th>ID Number</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.IDnumber">
            <td>{{ user.IDnumber }}</td>
            <td>{{ user.password }}</td>
          </tr>
        </tbody>
      </table>
  
      <p v-else>No users available</p>
    </div>
</template>
  
<script setup>
    import { ref, onMounted } from 'vue';
    import Authentification from '../services/authentication.js';
  
    const users = ref([]);
  
    // Fetching the list of users when mounted
    onMounted(() => {
      users.value = Authentification.userList();
    });
</script>
  
<style scoped>
    table {
      width: 100%;
      border-collapse: collapse;
    }
  
    th, td {
      padding: 8px;
      text-align: left;
      border: 1px solid #aad2ef;
      border-collapse: collapse;
    }
  
</style>
  