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
    border: 1px solid #82aeffe9;
    background-color: #c8dbfee3;
    border-radius: 10px;
    padding: 10px;
  }
  .head{
    font-size: 20px;
    text-decoration: none;
    color: #005da0;
  }
  .head:hover{
    color: #5698c7;
  }
</style>
