// import './assets/main.css'
import { createApp ,h} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'virtual:windi.css'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'virtual:svg-icons-register'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import "./router/permission"



const app = createApp(App)
app.use(router)
app.use(ElementPlus, {locale: zhCn})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app')
