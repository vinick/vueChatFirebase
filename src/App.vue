<template>
  <div class="view login" v-if="loginState === 'login'">
    <form class="login-form" @submit.prevent="Login">
      <div class="form-inner">
        <h1>Login to FireChat</h1>
        <label for="username">Username</label>
        <input type="text" v-model="inputUserName" placeholder="Username" />
        <label for="password">Password</label>
        <input type="password" v-model="inputPassword" placeholder="Password" />
        <div class="d-flex justify-content-end">
          <button type="button" class="logout" @click="GoToPage('register')">Need an account?</button>
        </div>
        <input type="submit" value="login" @submit.prevent="Login"/>
      </div>
    </form>
  </div>

  <div class="view login" v-else-if="loginState === 'register'">
    <form class="login-form" @submit.prevent="Register">
      <div class="form-inner">
        <h1>Register to FireChat</h1>
        <label for="username">Username</label>
        <input type="text" v-model="inputUserName" placeholder="Username" />
        <label for="password">Password</label>
        <input type="password" v-model="inputPassword" placeholder="Password" />
        <div class="d-flex justify-content-end">
          <button type="button" class="logout" @click="GoToPage('login')">Have an account?</button>
        </div>
        <input type="submit" value="register" @submit.prevent="Register"/>
      </div>
    </form>
  </div>

  <div class="view chat" v-else-if="loginState === 'logged'">
    <header>
      <button class="logout" @click="Logout">Logout</button>
      <h1>Welcome, {{ state.username }}</h1>
    </header>
    
    <section class="chat-box">
      <div v-for="message in state.messages" :key="message.key" 
        :class="(message.username == state.username ? 'message current-user' : 'message')">
        <div class="message-inner">
          <div class="username">{{ message.username }}</div>
          <div class="content">{{ message.content }}</div>
        </div>
      </div>
    </section>

    <footer>
      <form @submit.prevent="SendMessage">
        <input type="text" v-model="inputMessage" placeholder="Write a message..." />
        <input type="submit" value="Send">
      </form>
    </footer>
  </div>
</template>

<script>
import { reactive, onMounted, ref } from 'vue';
import db from './db'
import firebase from 'firebase';

export default {
  setup () {
    const inputUserName = ref("");
    const inputPassword = ref("");
    const inputMessage = ref("");
    const state = reactive({
      username: "",
      messages: []
    });
    const loginState = ref("login");

    const Login = () => {
      
      firebase
        .auth()
        .signInWithEmailAndPassword(inputUserName.value, inputPassword.value)
        .then(data => {
          loginState.value = 'logged';
          state.username = inputUserName.value;
          inputUserName.value = "";
          inputPassword.value = "";
          console.log(data)
        })
        .catch(err => alert(err.message));
    }

    const Logout = () => {
      state.username = "";
      firebase
        .auth()
        .signOut()
        .then(() => console.log("Signed out"))
        .catch(err => alert(err.message));
    }

    const GoToPage = (page) => {
      loginState.value = page;
      inputUserName.value = "";
      inputPassword.value = "";
    }

    const Register = () => {
      firebase
        .auth()
        .createUserWithEmailAndPassword(inputUserName.value, inputPassword.value)
        .then(() => {
          loginState.value = 'login';
          inputUserName.value = "";
          inputPassword.value = "";
        })
        .catch(err => alert(err.message));
    }

    const SendMessage = () => {
      const messagesRef = db.database().ref("messages");

      if (inputMessage.value === "" || inputMessage.value === null) {
        return;
      }

      const message = {
        username: state.username,
        content: inputMessage.value
      }

      messagesRef.push(message);
      inputMessage.value = "";
    }

    onMounted(() => {
      firebase.auth().onAuthStateChanged((user) => {
        if(!user) {
          loginState.value = 'login'
        }
      });

      const messagesRef = db.database().ref("messages");

      messagesRef.on('value', snapshot => {
        const data = snapshot.val();
        let messages = [];

        Object.keys(data).forEach(key => {
          messages.push({
            id: key,
            username: data[key].username,
            content: data[key].content
          });
        });

        state.messages = messages;
      })
    })

    return {
      inputUserName,
      inputMessage,
      inputPassword,
      state,
      loginState,
      Login,
      Logout,
      Register,
      GoToPage,
      SendMessage
    }
  }
}
</script>

<style lang="scss">
  @import "./customStyle.scss"
</style>
