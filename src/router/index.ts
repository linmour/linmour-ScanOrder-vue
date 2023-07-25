import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/home.vue'),
        meta: {
          group: 'group1' // 设置路由所属的组名
        }
      },
      {
        path: '/person',
        name: 'Person',
        component: () => import('@/views/person.vue'),
        meta: {
          group: 'group1' // 设置路由所属的组名
        }
      },
      {
        path: '/open',
        name: 'Open',
        component: () => import('@/views/open.vue'),
        meta: {
          group: 'group1' // 设置路由所属的组名
        }
      },
      {
        path: '/overview',
        name: 'Overview',
        component: () => import('@/views/overview.vue'),
        meta: {
          group: 'group2' // 设置路由所属的组名
        }
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
