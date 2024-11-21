<template>
    <div class="register">
        <h1>Sign Up</h1>
        <form action="">
            <input type="text" placeholder="Student Number">
            <input type="text" placeholder="E-mail">
            <input type="text" placeholder="Password">
            <button>Sign Up</button>
        </form>
    </div>
</template>

<style scoped>
  .register{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 80vh;
  }
  form{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80%;
  }
  input{
    padding: 10px;
    margin: 10px;
    width: 100%;
    border: solid 2px #53c2db;
    border-radius: 10px;
    color: #0a4b5a;
  }
  input:hover{
    background-color: #e0e9ec;
  }
  input:focus{
    outline: none;
    border: solid 2px #003453d3;
  }
  button{
    padding: 15px;
    margin: 10px;
    border: solid 2px #53c2db;
    border-radius: 10px;
    color: #0a4b5a;
    font-size: 15px;
  }
  button:hover{
      background-color: #8ad9ea;
      border: solid 2px #26869b;
  }
  ::placeholder{
    color: #248094;
  }
</style>