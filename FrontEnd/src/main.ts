import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router';
//import '@fortawesome/fontawesome-free/css/all.css'

const app = createApp(App)

//App.config.globalProperties.$axios = axios;
app.use(router);
app.mount('#app');


