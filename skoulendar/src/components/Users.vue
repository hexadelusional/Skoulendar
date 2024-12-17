<template>
    <div>
        <h1>Users list</h1>
        <div class="flex">
            <i class="fa-solid fa-magnifying-glass"></i>
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
                    <th>Classes</th>
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
                        <ul>
                            <li v-for="course in user.classes" :key="course.class_id">
                                <i class="fa-solid fa-arrow-right"></i> {{ course.class_id }} - {{ course.lesson_name }}
                            </li>
                        </ul>
                        <p v-if="!user.classes || user.classes.length === 0"><i>None</i></p>
                    </td>
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
                    <div class="status-options">
                        <label>Status:</label>
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
                    <label>Available Classes:</label>
                    <div class="checkbox-group">
                        <div v-for="classe in allClasses" :key="classe.lesson_id" class="checkbox-item">
                            <label class="checkbox-label">
                                <input type="checkbox" :value="classe.lesson_id" v-model="selectedLessonIds" />
                                {{ classe.class_id }} - {{ classe.name }}
                            </label>
                        </div>
                    </div>                    
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
                    <input type="text" v-model="editableUser.name" />
                    <br>
                    <label>Surname:</label>
                    <input type="text" v-model="editableUser.surname" />
                    <br>
                    <label>Password:</label>
                    <input type="password" v-model="editableUser.password" />
                    <br>
                    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
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
    const newUser = ref({ name: '', surname: '', password: '', status: '', lessonIds: [] });
    const selectedLessonIds = ref([]); 
    const allClasses = ref([]);


    // Fetching classes list
    async function fetchClasses() {
        const token = localStorage.getItem('token'); 

        try {
            const response = await axios.get('http://localhost:1234/api/classes', {
                headers: { Authorization: `Bearer ${token}` }
            });
            allClasses.value = response.data; 
        } catch (error) {
            console.error('Error fetching classes:', error);
            errorMessage.value = 'Unable to fetch class data. 😬';
        }
    }

    // Fetching user list
    async function fetchUsers() {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:1234/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            users.value = response.data.map(user => ({
                ...user,
                classes: user.classes || [] 
            }));

            filteredUsers.value = users.value; 
        } catch (error) {
            console.error('Error fetching users:', error);
            errorMessage.value = 'Uh oh... unable to fetch users. 😬';
        }
    }

    // Searching users by name or surname
    async function searchUsers() {
        if (!searchTerm.value) {
            filteredUsers.value = users.value;
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:1234/api/users/search`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { nameOrSurname: searchTerm.value }
            });

            filteredUsers.value = Array.isArray(response.data) ? response.data : [];

            if (filteredUsers.value.length === 0) {
                searchMessage.value = 'No user under that name... 🧐';
            } else {
                searchMessage.value = '';
            }
        } catch (error) {
            console.error('Error searching users:', error);
            errorMessage.value = 'Uh oh... unable to search users. 😬';
        }
    }

    async function addLessonToUser(userId, lessonId, classId) {
        const token = localStorage.getItem('token');

        // Log the data being sent
        console.log('Adding lesson with:', {
            student_id: userId,
            lesson_id: lessonId,
            class_id: classId
        });

        try {
            const response = await axios.post('http://localhost:1234/api/classList', {
                student_id: userId,
                lesson_id: lessonId,
                class_id: classId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log(response.data.message);
        } catch (error) {
            console.error('Error adding lesson:', error);
            console.log('Response data:', error.response.data);
            console.log('Response status:', error.response.status);
            errorMessage.value = error.response.data.message || 'Failed to add lesson. 😬';
        }
    }

    // Adding user to the user list
    async function addUser() {
        if (!validateNewUser() || selectedLessonIds.value.length === 0) {
            errorMessage.value = 'All fields must be filled in.☝️';
            return;
        }

        errorMessage.value = '';

        try {
            const token = localStorage.getItem('token'); 
            const response = await axios.post('http://localhost:1234/api/users', newUser.value, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const userId = response.data.id;
            const lessonPromises = selectedLessonIds.value.map(lessonId => {
                const selectedClass = allClasses.value.find(classe => classe.lesson_id === lessonId);
                const classId = selectedClass ? selectedClass.class_id : null;

                if (classId) {
                    return addLessonToUser(userId, lessonId, classId); 
                } else {
                    console.warn(`Class ID not found for lesson ID: ${lessonId}`);
                    return Promise.resolve();
                }
            });

            await Promise.all(lessonPromises); 
            await fetchUsers(); 
            closeAddWindow(); 
        } catch (error) {
            errorMessage.value = 'Uh oh... unable to add user or lessons. 😬';
        }
    }

    // Edit a user of the list
    function editUser(user) {
        editableUser.value = {
            id: user.id,
            name: user.name,
            surname: user.surname,
            password: '', // start with an empty password field
            status: user.status,
        };
        isEditwindowOpen.value = true;
    }

    // Update a user of the list
    async function updateUser() {
        if (!validateEditableUser()) {
            errorMessage.value = 'Name and surname are required. ☝️';
            return;
        }
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
            errorMessage.value = 'Unable to update user. 😬';
        }
    }

    // Delete user by id
    async function deleteUser(userId) {
        console.log(`Attempting to delete user with ID: ${userId}`);
        
        if (!confirm("Are you sure you want to delete this user? 🤔")) {
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
            errorMessage.value = 'Unable to delete user. 😬';
        }
    }
    
    // Toggle the edit window
    function closeEditWindow() {
        isEditwindowOpen.value = false;
    }
    function resetNewUser() {
        newUser.value = { name: '', surname: '', password: '', status: '' };
        selectedLessonIds.value = []; 
        errorMessage.value = ''; 
    }
    // Toggle the add user window
    function openAddWindow() {
        isAddwindowOpen.value = true;
    }
    function closeAddWindow() {
        isAddwindowOpen.value = false;
        resetNewUser();
    }

    // Validate edited user
    function validateEditableUser() {
        return editableUser.value.name.trim() !== '' &&
        editableUser.value.surname.trim() !== '';
    }

    // Checking if all fields are filled
    function validateNewUser() {
        return newUser.value.name && newUser.value.surname && newUser.value.password && newUser.value.status;
    } 

    onMounted(() => {
        fetchUsers();
        fetchClasses();
    });

</script>

<style scoped>
    .status-options {
        display: flex;  
        gap: 15px;   
        align-items: center;
    }
    .checkbox-group {
        display: flex;       
        flex-wrap: wrap;  
        line-height: 2;
    }

    .checkbox-item {
        margin-right: 15px; 
        white-space: nowrap; 
    }

    .checkbox-label {
        display: flex;    
        align-items: center;
    }
</style>
