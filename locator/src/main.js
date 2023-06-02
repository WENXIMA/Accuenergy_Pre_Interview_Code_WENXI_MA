// import './assets/main.css'

// import { createApp } from 'vue'
// import App from './App.vue'
// import router from './router/router.js';


// const app = createApp(App);
// app.use(router);
// // const googleMapsScript = document.createElement('script');
// // googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBt3Pnau356No6HqdsvKNH8deAav5dvJtI`;
// // document.head.appendChild(googleMapsScript);


// createApp(App).mount('#app');

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js';

const app = createApp(App);
app.use(router);

const googleMapsScript = document.createElement('script');
googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBt3Pnau356No6HqdsvKNH8deAav5dvJtI&libraries=places`;
googleMapsScript.defer = true;
googleMapsScript.async = true;
googleMapsScript.addEventListener('load', () => {
  app.mount('#app');
});
document.head.appendChild(googleMapsScript);
