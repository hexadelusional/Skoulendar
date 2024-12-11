<template>
    <div>
      <h3>Users List</h3>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <button class="add" @click="openAddWindow">&plus; Add User</button>
      <table v-if="users.length > 0">
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
          <tr v-for="user in users" :key="user.id">
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
                        <input type="radio" id="admin" value="Admin" v-model="newUser.status" required />
                        <label for="admin">Admin</label>

                        <input type="radio" id="student" value="Student" v-model="newUser.status" required />
                        <label for="student">Student</label>

                        <input type="radio" id="teacher" value="Teacher" v-model="newUser.status" required />
                        <label for="teacher">Teacher</label>
                    </div>

                    <br>
                    <label for="name">Name:</label>
                    <input type="text" v-model="newUser.name" required />
                    <br>
                    <label for="surname">Surname:</label>
                    <input type="text" v-model="newUser.surname" required />
                    <br>
                    <label for="password">Password:</label>
                    <input type="text" v-model="newUser.password" required />
                    <br>
                    <button type="submit">Add User</button>
                </form>
            </div>
      </div>
      <!-- Existing Edit User Window -->
      <div v-if="isEditwindowOpen" class="window">
        <div class="window-content">
            <span class="cross" @click="closeEditWindow">&times;</span>
            <h4>Edit User</h4>
            <form @submit.prevent="updateUser">
                <label>Status:</label>
                <br>
                <div class="status-options">
                    <input type="radio" id="admin" value="Admin" v-model="editableUser.status" required disabled 
                        :checked="editableUser.status === 'Admin'" />
                    <label for="admin">Admin</label>

                    <input type="radio" id="student" value="Student" v-model="editableUser.status" required disabled 
                        :checked="editableUser.status === 'Student'" />
                    <label for="student">Student</label>

                    <input type="radio" id="teacher" value="Teacher" v-model="editableUser.status" required disabled 
                        :checked="editableUser.status === 'Teacher'" />
                    <label for="teacher">Teacher</label>
                </div>
                <label for="name">Name:</label>
                <input type="text" v-model="editableUser.name" required />
                <br>
                <label for="surname">Surname:</label>
                <input type="text" v-model="editableUser.surname" required />
                <br>
                <label for="password">Password:</label>
                <input type="text" v-model="editableUser.password" required />
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
    const errorMessage = ref('');
    const isEditwindowOpen = ref(false);
    const isAddwindowOpen = ref(false);
    const editableUser = ref({ id: null, name: '', surname: '', password: '', status: '' }); // data for editing user
    const newUser = ref({ name: '', surname: '', password: '', status: '' }); // data for adding a new user

    // fetch users from the API
    async function fetchUsers() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:1234/api/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched users:', response.data); 
        users.value = response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        errorMessage.value = 'Unable to fetch users. Please try again later.';
    }
}

    function editUser(user) {
        editableUser.value = { ...user };
        isEditwindowOpen.value = true; 
        }

    function closeEditWindow() {
        isEditwindowOpen.value = false; 
    }

    async function updateUser() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:1234/api/users/${editableUser.value.id}`,
                editableUser.value,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedUser = { ...users.value.find(user => user.id === editableUser.value.id), ...response.data };

            const index = users.value.findIndex(user => user.id === editableUser.value.id);
            users.value[index] = updatedUser; 

            closeEditWindow(); 
        } catch (error) {
            console.error('Error updating user:', error);
            errorMessage.value = 'Unable to update user. Please try again later.';
        }
    }

    
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
    async function addUser() {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:1234/api/users', newUser.value, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await fetchUsers();
            closeAddWindow();
        } catch (error) {
            console.error('Error adding user:', error);
            errorMessage.value = 'Unable to add user. Please try again later.';
        }
    }

    // delete user by id
    async function deleteUser(userId) {
        console.log(`Attempting to delete user with ID: ${userId}`); 
        if (!confirm("Are you sure you want to delete this user?")) {
        return; 
        }
        try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`http://localhost:1234/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // update the user list
        users.value = users.value.filter(user => user.id !== userId);
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
    .add{
        font-size: 25px;
        font-weight: bold;
    }
    .status-options {
        display: flex;  
        gap: 15px;   
        align-items: center;
    }

</style>
