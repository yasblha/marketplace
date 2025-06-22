import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css'

import { createApp } from 'vue'
import { createPinia } from "pinia";
import piniaPersist from 'pinia-plugin-persist'
import App from './App.vue'
import router from './router/router';
import { VueCookieNext } from 'vue-cookie-next';
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import directives, {clickOutside} from './directives'
import Toast, { type PluginOptions } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
library.add(fas, far, fab)
dom.watch();

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist)

// Enregistrement des directives
directives.install(app)

// Configuration des options de toast
const toastOptions: PluginOptions = {
  position: 'top-right',
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
};

// Enregistrement des directives globales
app.directive('click-outside', clickOutside)

app.use(pinia);
app.use(router);
app.use(VueCookieNext);
app.use(Toast, toastOptions);
app.mount('#app');



