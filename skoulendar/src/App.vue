<template>
  <div>
    <nav>
      <router-link class="head" to="/">
        <strong><i class="fa-solid fa-house"></i></strong>
      </router-link>

      <router-link class="head" to="/users">
        <strong>Users</strong>
      </router-link>

      <router-link class="head" to="/login">
        <strong><i class="fa-solid fa-right-from-bracket"></i></strong>
      </router-link>

    </nav>

    <router-view></router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuth } from './composable/useAuth.js';

const auth = useAuth();

onMounted(() => {
  auth.checkAuthState(); // Refresh session state when app loads
});
</script>


<style scoped>
nav {
  display: flex;
  justify-content: space-around;
  border: 1px solid #82aeffe9;
  background-color: #c8dbfee3;
  border-radius: 10px;
  padding: 10px;
}

.head {
  font-size: 20px;
  text-decoration: none;
  color: #005da0;
}

.head:hover {
  color: #5698c7;
}
</style>
