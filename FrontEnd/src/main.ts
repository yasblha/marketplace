import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css'

import { createApp }  from 'vue'
import { createPinia } from 'pinia'
import piniaPersist    from 'pinia-plugin-persist'
import { VueCookieNext } from 'vue-cookie-next'
import { library, dom }  from '@fortawesome/fontawesome-svg-core'
import { fas }           from '@fortawesome/free-solid-svg-icons'
import { far }           from '@fortawesome/free-regular-svg-icons'
import { fab }           from '@fortawesome/free-brands-svg-icons'
import directives        from '@/directives'

import Toast, { POSITION } from 'vue-toastification'
import type { PluginOptions } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App    from './App.vue'
import router from './router/router'

library.add(fas, far, fab)
dom.watch()

const app   = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist)

directives.install(app)

const toastOptions: PluginOptions = {
  position : POSITION.TOP_RIGHT,
  timeout  : 5000
}

app
    .use(pinia)
    .use(router)
    .use(VueCookieNext)
    .use(Toast, toastOptions)
    .mount('#app')
