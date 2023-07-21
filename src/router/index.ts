import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home', name: 'Home', component: () => import('@/views/home.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },

  {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/404.vue')
  }
]

const router = createRouter({
  history:createWebHashHistory(),
  routes
})

export default router
