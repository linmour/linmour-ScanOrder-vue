import router from "@/router"
import { error } from "@/utils/tips"
import {getLocalstorage} from "@/utils/localStorage";


// 全局前置守卫  to是去哪个路径，from是从哪里来
router.beforeEach((to,from,next)=>{

    const token = getLocalstorage("Token")

    // 没有登录，强制跳转回登录页
    if(!token && to.path != "/login"){
        error("请先登录","error")
        return next({ path:"/login" })
    }

    // 防止重复登录
    if(token && to.path == "/login"){
        error("请勿重复登录","error")
        return next({ path:from.path ? from.path : "/" })
    }

    next()
})