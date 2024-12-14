// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Cookies from 'js-cookie'; // <-- Import it here

import Home from '../components/Home.vue';
import LogIn from '../components/LogIn.vue';
import Users from '../components/Users.vue';
import HomeworkGiving from '../components/HomeworkGiving.vue';
import HomeworkViewing from '../components/HomeworkViewing.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'login', component: LogIn },
  { path: '/users', name: 'Users', component: Users },
  { path: '/homeworkGiving', name: 'HomeworkGiving', component: HomeworkGiving },
  { path: '/homeworkViewing', name: 'HomeworkViewing', component: HomeworkViewing },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
    const role = Cookies.get('role'); // Get the user's role
    console.log(`Navigating to: ${to.name}, role: ${role}`); // Debugging

    // Allow access to /login for all users (authenticated or not)
    if (to.name === 'login') {
      return next();
    }

    // Allow access to the Home route for all users (authenticated or not)
    if (to.name === 'Home') {
      return next();
    }

    // Redirect authenticated users trying to access other routes to role-specific views
    if (role) {
      if (to.name === 'Users' && role !== 'Admin') {
        return next({ name: 'Home' }); // Prevent access if not an Admin
      }
      if (to.name === 'HomeworkGiving' && role !== 'Teacher') {
        return next({ name: 'Home' }); // Prevent access if not a Teacher
      }
      if (to.name === 'HomeworkViewing' && role !== 'Student') {
        return next({ name: 'Home' }); // Prevent access if not a Student
      }
    }

    // If no role and trying to access restricted routes, redirect to login
    if (!role && to.name !== 'Home' && to.name !== 'login') {
      return next({ name: 'login' });
    }

    next(); // Allow all other navigation
});


export default router;
