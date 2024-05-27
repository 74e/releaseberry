import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import icons from './components/icons/index'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

for (const iconName in icons) {
  const icon = icons[iconName]
  app.component(iconName, icon)
}

app.use(router).use(pinia)

app.mount('#app')
