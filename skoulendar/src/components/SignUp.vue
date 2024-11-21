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
    border: solid 2px #ffd890ad;
    border-radius: 10px;
    color: #ffa600de;
  }
  input:hover{
    background-color: #e0e9ec;
  }
  input:focus{
    outline: none;
    border: solid 2px #b17300de;
  }
  button{
    padding: 15px;
    margin: 10px;
    border: solid 2px #ffe5b4ad;
    border-radius: 10px;
    color: #ffa600de;
    font-size: 15px;
  }
  button:hover{
      background-color: #e4c68ead;
      border: solid 2px #ffa600ad;
  }
  ::placeholder{
    color: #ffa600ad;
  }
</style>