import firebase from 'firebase/app'
import 'firebase/analytics'

import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

const firebaseConfig = {
  apiKey: "AIzaSyDwSeYTxxqY4XDcC6b2q6Geo88hRh4619Q",
  authDomain: "gitcabinet-bing.firebaseapp.com",
  projectId: "gitcabinet-bing",
  storageBucket: "gitcabinet-bing.appspot.com",
  messagingSenderId: "73400342457",
  appId: "1:73400342457:web:2590bfc48f7873e0624868",
  measurementId: "G-DD1GZGGSYX"
};
firebase.initializeApp(firebaseConfig)
firebase.analytics()

createApp(App).mount('#app')
