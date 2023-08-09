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
      {
        path: '/detail',
        name: 'Detail',
        component: () => import('@/views/detail.vue'),
        meta: {
          group: 'group2' // 设置路由所属的组名
        }
      },
      {
        path: '/subclass',
        name: 'Subclass',
        component: () => import('@/component/upoloadProduct.vue'),
        meta: {
          group: 'group2' // 设置路由所属的组名
        }
      },
      {
        path: '/order',
        name: 'Order',
        component: () => import('@/views/order.vue'),
        meta: {
          group: 'group2' // 设置路由所属的组名
        }
      },
      {
        path: '/seat',
        name: 'Seat',
        component: () => import('@/views/seat.vue'),
        meta: {
          group: 'group2' // 设置路由所属的组名
        }
      },
      {
        path: '/inventory',
        name: 'Inventory',
        component: () => import('@/views/inventory.vue'),
        meta: {
          group: 'group2' // 设置路由所属的组名
        }
      },
      {
        path: '/dishes',
        name: 'Dishes',
        component: () => import('@/views/dishes.vue'),
        meta: {
          group: 'group2' // 设置路由所属的组名
        }
      },
      {
        path: '/addProduct',
        name: 'AddProduct',
        component: () => import('@/views/addProduct.vue'),
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
