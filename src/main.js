import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import App from './App.vue'
import './assets/main.css'
import { useThemeStore } from './stores/theme.js'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.config.errorHandler = (err, instance, info) => { console.error('[UNIASSIST]', err, info) }
app.mount('#app')

const theme = useThemeStore()
theme.initTheme()
