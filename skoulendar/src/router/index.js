import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import LogIn from '../components/LogIn.vue';
import Users from '../components/Users.vue';

const routes = [
    { path: '/', name: 'Home', component: Home },
    {path: '/login', name:'login', component: LogIn},
    {path: '/users', name: 'Users', component: Users}
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;