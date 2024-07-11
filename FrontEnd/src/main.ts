import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import router from './router/router';
import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)
const pinia = createPinia()
//App.config.globalProperties.$axios = axios;

app.use(pinia)
app.use(router);
app.mount('#app');


