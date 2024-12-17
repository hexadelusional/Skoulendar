import { createApp } from 'vue';
import './style.css'
import App from './App.vue';
import router from './router/index.js';
import { useAuth } from './composable/useAuth.js';

const app = createApp(App);

// Add navigation guard to check session state
router.beforeEach((to, from, next) => {
  const auth = useAuth();

  // Check authentication state
  auth.checkAuthState();

  if (to.meta.requiresAuth && !auth.isLoggedIn.value) {
    return next({ name: 'login' }); // Redirect to login if not authenticated
  }

  next(); // Allow navigation
});

app.use(router);

app.mount('#app');
