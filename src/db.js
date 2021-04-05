import firebase from "firebase/app"
import "firebase/database"

const config = {
  apiKey: "AIzaSyC8XK0CJuMHeU6_F_Ih6GjaElD0bZvoaVE",
  authDomain: "vue-chat-example-59382.firebaseapp.com",
  projectId: "vue-chat-example-59382",
  storageBucket: "vue-chat-example-59382.appspot.com",
  messagingSenderId: "910110228253",
  appId: "1:910110228253:web:51f56e0ee25199a67f2bf4"
}

const db = firebase.initializeApp(config);
export default db;