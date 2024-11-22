<template>
  <div>
    <nav>
      <router-link class="head" to="/"><strong>Home</strong></router-link>
      <router-link class="head" to="/signup"><strong>Sign Up</strong></router-link>
      <router-link class="head" to="/login"><strong>Log In</strong></router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style scoped>
  nav{
    display: flex;
    justify-content: space-around;
    border: 2px solid #ffa60085;
    border-radius: 10px;
    padding: 10px;
  }
  .head{
    font-size: 20px;
    text-decoration: none;
    color: #ffa600;
  }
  .head:hover{
    color: #ffe30d;
  }
</style>
