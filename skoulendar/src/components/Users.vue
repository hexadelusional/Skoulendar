<template>
  <div>
      <h3>Users List</h3>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

      <table v-if="users.length > 0">
          <thead>
              <tr>
                  <th>ID Number</th>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Password</th>
                  <th>Actions</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.surname }}</td>
                  <td>{{ user.password }}</td>
                  <td>
                      <button>Edit</button>
                      <button>Delete</button>
                  </td>
              </tr>
          </tbody>
      </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);
const errorMessage = ref('');

// Fetch users from the API
async function fetchUsers() {
    try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get('http://localhost:1234/api/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Response data:', response.data); 
        users.value = response.data; // populate with database
    } catch (error) {
        console.error('Error fetching users:', error);
        errorMessage.value = 'Unable to fetch users. Please try again later.';
    }
}

onMounted(() => {
  fetchUsers(); 
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

.error {
  color: rgb(255, 94, 0);
}
</style>
