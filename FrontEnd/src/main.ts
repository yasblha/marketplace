import { createApp } from 'vue';
import App from './App.vue';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import './assets/main.css';

const app = createApp(App);

// Configuration optionnelle de Toast
const options = {
  // Vous pouvez ajuster les options comme la position, la durée, etc.
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  closeButton: "button",
  icon: true,
  rtl: false
};

app.use(Toast, options);
app.mount('#app');
