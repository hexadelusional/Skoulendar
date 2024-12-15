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

  // Example: Restrict access to protected routes
  if (to.meta.requiresAuth && !auth.isLoggedIn.value) {
    return next({ name: 'login' }); // Redirect to login if not authenticated
  }

  next(); // Allow navigation
});

// Use the router
app.use(router);

// Mount the application
app.mount('#app');
