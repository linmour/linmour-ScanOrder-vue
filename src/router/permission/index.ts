import router from "@/router"
import { error } from "@/utils/tips"
import {getLocalstorage} from "@/utils/localStorage";
import {useMenuStore} from "@/stores";
import {toRaw} from "vue";


// 全局前置守卫  to是去哪个路径，from是从哪里来
router.beforeEach((to,from,next)=>{

    const token = getLocalstorage("Token")

    // 没有登录，强制跳转回登录页
    if(!token && (to.path !== "/login" && to.path !== "/register" && to.path !== '/password')){
        error("请先登录","error")
        return next({ path:"/login" })
    }

    // 防止重复登录
    if(token && to.path == "/login"){
        error("请勿重复登录","error")
        return next({ path:from.path ? from.path : "/" })
    }

    const group = to.meta.group
    const store = useMenuStore()
    if (group === 'group1') {
        // 对group1中的路由进行操作
        // 例如更改对应的Pinia中的变量值
        store.setSort('1')
    } else if (group === 'group2') {
        // 对group2中的路由进行操作
        // 例如更改对应的Pinia中的变量值
        store.setSort('2')
    }

    next()
})

