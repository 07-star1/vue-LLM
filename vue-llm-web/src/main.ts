import './styles/common.scss'
import "./styles/markdown.scss"
import "./styles/themes/dark.scss"
import "./styles/themes/light.scss"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import "highlight.js/styles/github.css"

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
