<template>
  <div>
    <nav>
      <router-link class="head" to="/">Home</router-link>
      <router-link class="head" to="/SignUp">Sign Up</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<style scoped>
  nav{
    display: flex;
    justify-content: space-around;
    border: 2px solid #ffe83dde;
    border-radius: 10px;
    padding: 10px;
  }
  .head{
    font-size: 20px;
    text-decoration: none;
    color: #ffe83dde;
  }
  .head:hover{
    color: #fff5a7de;
  }
</style>
