import { createRouter, createWebHistory } from 'vue-router';
import Cookies from 'js-cookie'; // Import cookies for session management

import Home from '../components/Home.vue';
import LogIn from '../components/LogIn.vue';
import Users from '../components/Users.vue';
import HomeworkGiving from '../components/HomeworkGiving.vue';
import HomeworkViewing from '../components/HomeworkViewing.vue';
import Lessons from "../components/Lessons.vue";
import StudentTeacherTimetable from "../components/StudentTeacherTimetable.vue";
import AdminTimetable from "../components/AdminTimetable.vue";

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'login', component: LogIn },
    { path: '/users', name: 'Users', component: Users },
    { path: '/homeworkGiving', name: 'HomeworkGiving', component: HomeworkGiving },
    { path: '/homeworkViewing', name: 'HomeworkViewing', component: HomeworkViewing },
    { path: '/timetable', name: 'Timetable', component: StudentTeacherTimetable },
    { path: '/adminTimetable', name: 'AdminTimetable', component: AdminTimetable},
    { path: '/lessons', name: 'Lessons', component: Lessons },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
    const role = Cookies.get('role');
    console.log(`Navigating to: ${to.name}, role: ${role}`);

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
      // Redirect Teachers to HomeworkGiving route if they try to access HomeworkViewing or Users
      if (to.name === 'HomeworkGiving' && role !== 'Teacher') {
        return next({ name: 'Home' }); // Prevent access if not a Teacher
      }

      // Redirect Students to HomeworkViewing route if they try to access HomeworkGiving or Users
      if (to.name === 'HomeworkViewing' && role !== 'Student') {
        return next({ name: 'Home' }); // Prevent access if not a Student
      }

      // Admin access to Users route
      if (to.name === 'Users' && role !== 'Admin') {
        return next({ name: 'Home' }); // Prevent access if not an Admin
      }

      // Admin access to Users route
      if (to.name === 'Lessons' && role !== 'Admin') {
        return next({ name: 'Home' }); // Prevent access if not an Admin
      }
    }

    // If no role and trying to access restricted routes, redirect to login
    if (!role && to.name !== 'Home' && to.name !== 'login') {
      return next({ name: 'login' });
    }

    next(); // Allow all other navigation
});

export default router;
