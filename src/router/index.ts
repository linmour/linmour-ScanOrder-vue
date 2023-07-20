import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/login.vue'
import NotFound from '@/views/404.vue'
import Index from '@/views/index.vue'

const routes = [{
  path:"/",
  component:Index
},{
  path:"/login",
  component:Login
},{ 
  path: '/:pathMatch(.*)*', 
  name: 'NotFound', 
  component: NotFound 
}]

const router = createRouter({
  history:createWebHashHistory(),
  routes
})

export default router
