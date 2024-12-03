import api from './api.js';

const users = [
    { IDnumber: '050304', password: 'elodie' },
    { IDnumber: '160305', password: 'adele' },
];

export default {
    login(credentials) {
        return new Promise((resolve, reject) => {
            // Finding the user by IDnumber
            const user = users.find(user => user.IDnumber === credentials.IDnumber);
            // Checking if user exists and if password matches
            if (user && user.password === credentials.password) {
              resolve({ success: true, message: 'Login successful!' });
            } else {
              reject({ success: false, message: 'Invalid ID number or password.' });
            }
        });
    },
    signup(credentials) {
        return new Promise((resolve, reject) => {
            // Checking if the IDnumber already exists
            const existingUser = users.find(user => user.IDnumber === credentials.IDnumber);
    
            if (existingUser) {
              // Rejecting if the IDnumber is already taken
              reject({ success: false, message: 'ID number already exists. Please choose another.' });
            } else {
              // Creating user and adding him to the users array
              users.push({ IDnumber: credentials.IDnumber, password: credentials.password });
              resolve({ success: true, message: 'Signup successful! You can now log in.' });
            }
        });
    },
    userList() {
        return users;
    },
};

