import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from "pinia";
import piniaPersist from 'pinia-plugin-persist'
import App from './App.vue'
import router from './router/router';
import { VueCookieNext } from 'vue-cookie-next';

const pinia = createPinia()
pinia.use(piniaPersist)

const app = createApp(App)

app.use(pinia);
app.use(router);
app.use(VueCookieNext);
app.mount('#app');



