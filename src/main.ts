import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { es } from 'primelocale/js/es.js'
import Aura from '@primeuix/themes/aura'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

import '@/assets/tailwind.css'
import '@/assets/styles.scss'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(PrimeVue, {
  locale: es,
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark',
    },
  },
})

app.use(ToastService)
app.use(ConfirmationService)
app.use(DialogService)

app.mount('#app')
