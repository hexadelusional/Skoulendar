// src/composables/useAuth.js
import { ref } from 'vue';
import Cookies from 'js-cookie';

const isLoggedIn = ref(false);
const username = ref(null);

export const useAuth = () => {
  const logIn = (userDetails) => {
    isLoggedIn.value = true;
    username.value = userDetails.username;
    Cookies.set('role', userDetails.role, { path: '/' });
    Cookies.set('username', userDetails.username, { path: '/' });
    Cookies.set('authToken', userDetails.token, { path: '/', secure: true });
  };

  const logOut = () => {
    isLoggedIn.value = false;
    username.value = null;
    Cookies.remove('role', { path: '/' });
    Cookies.remove('username', { path: '/' });
    Cookies.remove('authToken', { path: '/' });
  };

  const checkAuthState = () => {
    const role = Cookies.get('role');
    const userNameFromCookie = Cookies.get('username');
    const token = Cookies.get('authToken');

    if (role && userNameFromCookie && token) {
      isLoggedIn.value = true;
      username.value = userNameFromCookie;
    } else {
      isLoggedIn.value = false;
      username.value = null;
    }
  };

  return {
    isLoggedIn,
    username,
    logIn,
    logOut,
    checkAuthState,
  };
};
