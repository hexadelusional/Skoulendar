import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import SignUp from '../components/SignUp.vue';
import LogIn from '../components/LogIn.vue';

const routes = [
    { path: '/', name: 'Home', component: Home },
    {path: '/signup', name: 'SignUp', component: SignUp},
    {path: '/login', name:'login', component: LogIn}
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;