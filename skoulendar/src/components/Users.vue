<template>
    <div>
      <h1>Users List</h1>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <div class="flex">
        <input class="search" type="text" v-model="searchTerm" placeholder="Search by name or surname." @input="searchUsers" />
        <button class="add" @click="openAddWindow">&plus; Add User</button>
      </div>
      <p v-if="searchMessage" class="error">{{ searchMessage }}</p>
      <table v-if="filteredUsers.length > 0">
        <thead>
          <tr>
            <th>ID Number</th>
            <th>Status</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.status }}</td>
                <td>{{ user.name }}</td>
                <td>{{ user.surname }}</td>
                <td>{{ user.password }}</td> 
            <td>
                <button @click="editUser(user)">Edit</button>
                <button @click="deleteUser(user.id)">Delete</button>
            </td>
            </tr>
        </tbody>
      </table>

      <!-- Add User Window -->
      <div v-if="isAddwindowOpen" class="window">
            <div class="window-content">
                <span class="cross" @click="closeAddWindow">&times;</span>
                <h4>Add User</h4>
                <form @submit.prevent="addUser">
                    <label>Status:</label>
                    <br>
                    <div class="status-options">
                        <input type="radio" id="admin" value="Admin" v-model="newUser.status" />
                        <label for="admin">Admin</label>

                        <input type="radio" id="student" value="Student" v-model="newUser.status" />
                        <label for="student">Student</label>

                        <input type="radio" id="teacher" value="Teacher" v-model="newUser.status" />
                        <label for="teacher">Teacher</label>
                    </div>

                    <br>
                    <label for="name">Name:</label>
                    <input type="text" v-model="newUser.name" />
                    <br>
                    <label for="surname">Surname:</label>
                    <input type="text" v-model="newUser.surname" />
                    <br>
                    <label for="password">Password:</label>
                    <input type="password" v-model="newUser.password" />
                    <br>
                    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
                    <button type="submit">Add User</button>
                </form>
            </div>
      </div>

      <!-- Edit User Window -->
      <div v-if="isEditwindowOpen" class="window">
            <div class="window-content">
                <span class="cross" @click="closeEditWindow">&times;</span>
                <h4>Edit User</h4>
                <form @submit.prevent="updateUser">
                    <label>Name:</label>
                    <input type="text" v-model="editableUser.name" required />
                    
                    <br>
                    <label>Surname:</label>
                    <input type="text" v-model="editableUser.surname" required />
                    
                    <br>
                    <label>Password:</label>
                    <input type="password" v-model="editableUser.password" placeholder=""/> <!-- Allow password to be changed, but without affecting status -->

                    <br>
                    <button type="submit">Update User</button>
                </form>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const users = ref([]);
const filteredUsers = ref([]);
const errorMessage = ref('');
const searchMessage = ref('');
const searchTerm = ref('');

const isEditwindowOpen = ref(false);
const isAddwindowOpen = ref(false);
const editableUser = ref({ id: null, name: '', surname: '', password: '', status: '', isPasswordChanged: false }); // data for editing user
const newUser = ref({ name: '', surname: '', password: '', status: '' });

    // Checking if all fields are filled
    function validateNewUser() {
        return newUser.value.name && newUser.value.surname && newUser.value.password && newUser.value.status;
    }

    // Adding user to the user list
    async function addUser() {
        if (!validateNewUser()) {
            errorMessage.value = 'All fields must be filled in.☝️';
            return;
        }
        // Reset error message before API call
        errorMessage.value = '';
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:1234/api/users', newUser.value, {
                headers: { Authorization: `Bearer ${token}` }
            });
            await fetchUsers();
            closeAddWindow();
        } catch (error) {
            console.error('Error adding user:', error);
            errorMessage.value = 'Uh oh... unable to add user.😬';
        }
    }

    // Fetching user list
    async function fetchUsers() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:1234/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });

            users.value = response.data;
            filteredUsers.value = response.data; // Initialize the filtered users
        } catch (error) {
            console.error('Error fetching users:', error);
            errorMessage.value = 'Uh oh... unable to fetch users.😬';
        }
    }

    // Searching users by name or surname
    async function searchUsers() {
        if (!searchTerm.value) {
            filteredUsers.value = users.value; 
            searchMessage.value = '';
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:1234/api/users/search`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { nameOrSurname: searchTerm.value } // Send the search term as a query parameter
            });

            filteredUsers.value = response.data; // Update filtered users with search results
            // Update search message based on results
            if (response.data.length === 0) {
                searchMessage.value = 'No user has that name or surname...🧐';
            } else {
                searchMessage.value = ''; // Clear message if results are found
            }
        } catch (error) {
            console.error('Error searching users:', error);
            errorMessage.value = 'Uh oh... unable to search users.😬';
        }
    }

    // Edit a user of the list
    function editUser(user) {
        editableUser.value = {
            id: user.id,
            name: user.name,
            surname: user.surname,
            password: '', // Start with an empty password field
            status: user.status,
        };
        isEditwindowOpen.value = true;
    }

    // Toggle the edit window
    function closeEditWindow() {
        isEditwindowOpen.value = false;
    }

    // Update a user of the list
    async function updateUser() {
        try {
            const token = localStorage.getItem('token');
            const { id, name, surname, password } = editableUser.value;
            // Send the password only if it's provided
            const payload = {
                name,
                surname,
                ...(password ? { password } : {}) 
            };
            const response = await axios.put(
                `http://localhost:1234/api/users/${id}`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Update data
            const updatedUser = { ...users.value.find(user => user.id === id), ...response.data };
            const index = users.value.findIndex(user => user.id === id);
            users.value[index] = updatedUser;

            closeEditWindow(); // calling toggle function
            editableUser.value.password = '';
        } catch (error) {
            console.error('Error updating user:', error);
            errorMessage.value = 'Unable to update user. Please try again later.';
        }
    }
    // Toggle the add user window
    function openAddWindow() {
        isAddwindowOpen.value = true;
    }
    function closeAddWindow() {
        isAddwindowOpen.value = false;
        resetNewUser();
    }

    function resetNewUser() {
        newUser.value = { name: '', surname: '', password: '', status: '' };
    }

    // Delete user by id
    async function deleteUser(userId) {
        console.log(`Attempting to delete user with ID: ${userId}`);
        
        if (!confirm("Are you sure you want to delete this user?")) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:1234/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update both the full user list and the filtered user list
            users.value = users.value.filter(user => user.id !== userId);
            filteredUsers.value = filteredUsers.value.filter(user => user.id !== userId);

        } catch (error) {
            console.error('Error deleting user:', error);
            console.error('Error response:', error.response);
            errorMessage.value = 'Unable to delete user. Please try again later.';
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
    }

    .error {
        color: rgb(255, 94, 0);
    }

    .window {
        display: block;
        position: fixed;
        z-index: 999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.219);
        justify-content: center; 
        align-items: center;
        display: flex;
    }

    .window-content {
        background-color: #f3f9ff;
        margin: 15% auto;
        padding: 20px;
        border: 2px solid #83a9c6;
        border-radius: 10px;
        width: 80%;
        max-width: 500px; 
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center;
    }

    .cross {
        color: #a4a4a4;
        float: right;
        font-size: 35px;
        font-weight: bold;
    }

    .cross:hover, .cross:focus {
        color: #124b74ae;
        cursor: pointer;
    }
    .flex{
        display: flex;
        justify-content: space-evenly;
        flex-direction: row;
        margin: 30px 20% 30px 20%;
    }
    .add{
        font-size: 15px;
        font-weight: bold;
        width: 20%;
    }
    .search{
        width: 60%;
        height: 30px;
        padding: 8px;
        border: 2px solid #acbbda;
    }
    .search::placeholder{
        color:#5d7bb6;
    }
    .status-options {
        display: flex;  
        gap: 15px;   
        align-items: center;
    }
</style>
