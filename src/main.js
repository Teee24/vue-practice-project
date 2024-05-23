import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Import our custom CSS
import './scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

// Import bootstrap icon

import 'bootstrap-icons/font/bootstrap-icons.css'
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
