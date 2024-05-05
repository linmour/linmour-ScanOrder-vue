import router from "@/router"
import {error} from "@/utils/tips"
import {getLocalstorage} from "@/utils/localStorage";

import {toRaw} from "vue";


// 全局前置守卫  to是去哪个路径，from是从哪里来
router.beforeEach((to, from, next) => {

    const token = getLocalstorage("Token")

    // 没有登录，强制跳转回登录页
    if (!token && (to.path !== "/login" && to.path !== "/register" && to.path !== '/password')) {
        error("请先登录", "error")
        return next({path: "/login"})
    }


    // 防止重复登录
    if (token && to.path == "/login") {
        error("请勿重复登录", "error")
        return next({path: from.path ? from.path : "/"})
    }

    if (getLocalstorage("UserInfo") != "") {
        const type = JSON.parse(getLocalstorage("UserInfo")).type
        // 检查用户是否有权限访问当前路由
        if (to.matched[1] == undefined ){
            return next({path: "/404"})
        }
        if (to.matched[1].meta.group === 'group1' && type != 1) {
            return next({path: "/404"})
        }
        if (to.matched[1].meta.group === 'group2' && type != 2) {
            return next({path: "/404"})
        }

    }

    next()
})
//
// // 全局路由守卫
// router.beforeEach((to, from, next) => {
//     // 假设`currentUser`是一个Vuex getter，返回当前用户信息
//     const currentUser = store.getters.currentUser;
//
//     // 如果用户未登录，重定向到登录页面
//     if (!currentUser) {
//         return next('/login');
//     }
//
//     // 检查用户是否有权限访问当前路由
//     if (to.matched.some(record => record.meta.group === 'group1') && !currentUser.isAdmin) {
//         // 如果用户不是管理员，但尝试访问管理员的路由，则重定向到错误页面或用户首页
//         return next('/not-authorized'); // 假设你有一个错误页面
//     }
//
//     if (to.matched.some(record => record.meta.group === 'group2') && !currentUser.isMerchant) {
//         // 如果用户不是商户，但尝试访问商户的路由，则重定向到错误页面或用户首页
//         return next('/not-authorized');
//     }
//
//     // 如果用户有权限，继续到目标路由
//     next();
// });
