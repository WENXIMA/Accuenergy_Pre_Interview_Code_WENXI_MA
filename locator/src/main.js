import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js';


const app = createApp(App);
app.use(router);
// const googleMapsScript = document.createElement('script');
// googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBt3Pnau356No6HqdsvKNH8deAav5dvJtI`;
// document.head.appendChild(googleMapsScript);

createApp(App).mount('#app');
