import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/myshop',
    name: 'Myshop',
    component: () => import('@/layout/myShop.vue'),
    redirect: '/myshop/shop',
    children: [
      {
        path: '/myshop/shop',
        name: 'Shop',
        component: () => import('../views/shop.vue')
      },
    ]
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/myself.vue'),
    redirect: '/home',
    children: [

      {
        path: 'home', name: 'Home', component: () => import('@/views/home.vue')
      },
      {
        path: '/person',
        name: 'Person',
        component: () => import('../views/person.vue')
      },
      {
        path: '/open',
        name: 'Open',
        component: () => import('../views/open.vue')
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../views/test.vue')
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
