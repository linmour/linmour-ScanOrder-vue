import {createRouter, createWebHashHistory} from 'vue-router'
const routes = [
    // 用户路由组
    {
        path: '/user',
        component: () => import('@/layout/index.vue'),
        children: [
            {
                path: '/user/home',
                name: 'Home',
                component: () => import('@/views/user/home.vue'),
                meta: {
                    group: 'group2' // 设置路由所属的组名
                }
            },
            {
                path: '/user/person',
                name: 'Person',
                component: () => import('@/views/user/person.vue'),
                meta: {
                    group: 'group2' // 设置路由所属的组名
                }
            },
            {
                path: '/user/open',
                name: 'Open',
                component: () => import('@/views/user/open.vue'),
                meta: {
                    group: 'group2' // 设置路由所属的组名
                }
            },
            {
                path: '/user/overview',
                name: 'Overview',
                component: () => import('@/views/user/overview.vue'),
                meta: {
                    group: 'group2' // 设置路由所属的组名
                }
            },
            {
                path: '/user/detail',
                name: 'Detail',
                component: () => import('@/views/user/detail.vue'),
                meta: {
                    group: 'group2' // 设置路由所属的组名
                }
            },
            {
                path: '/user/order',
                name: 'Order',
                component: () => import('@/views/user/order.vue'),
                meta: {
                    group: 'group2' // 设置路由所属的组名
                }
            },
            {
                path: '/user/seat',
                name: 'Seat',
                component: () => import('@/views/user/seat.vue'),
                meta: {
                    group: 'group2' // 设置路由所属的组名
                }
            },
            {
                path: '/user/inventory',
                name: 'Inventory',
                component: () => import('@/views/user/inventory.vue'),
                meta: {
                    group: 'group2' // 设置路由所属的组名
                }
            },
            {
                path: '/user/dishes',
                name: 'Dishes',
                component: () => import('@/views/user/dishes.vue'),
                meta: {
                    group: 'group2' // 设置路由所属的组名
                }

            },
            {
                path: '/user/addProduct',
                name: 'AddProduct',
                component: () => import('@/views/user/addProduct.vue'),
                meta: {
                    group: 'group2' // 设置路由所属的组名
                }
            },

        ],
        // 你可以在这里添加路由守卫，以确保只有登录用户可以访问这些路由
    },
    // 管理员路由组
    {
        path: '/admin',
        component: () => import('@/layout/index.vue'),
        children: [
            {
                path: '/admin/shop',
                name: 'Shop',
                component: () => import('@/views/admin/shop.vue'),
                meta: {
                    group: 'group1' // 设置路由所属的组名
                }
            }, {
                path: '/admin/merchant',
                name: 'Merchant',
                component: () => import('@/views/admin/merchant.vue'),
                meta: {
                    group: 'group1' // 设置路由所属的组名
                }
            },{
                path: '/admin/overview',
                name: 'Overview1',
                component: () => import('@/views/admin/overview.vue'),
                meta: {
                    group: 'group1' // 设置路由所属的组名
                }
            },{
                path: '/admin/detail',
                name: 'Detail1',
                component: () => import('@/views/admin/detail.vue'),
                meta: {
                    group: 'group1' // 设置路由所属的组名
                }
            },{
                path: '/admin/fund',
                name: 'Fund',
                component: () => import('@/views/admin/fund.vue'),
                meta: {
                    group: 'group1' // 设置路由所属的组名
                }
            },
        ],
        // 同样，你可以在这里添加路由守卫，以确保只有管理员可以访问这些路由
    },
    // 登录和注册路由
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/login.vue')
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import("../views/admin/register.vue")
    },
    // 404 Not Found 路由
    {
        path: '/:pathMatch(.*)*', // 确保这是最后一个路由
        name: 'NotFound',
        component: () => import('@/views/404.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
