import axios from 'axios'
import {error, success} from '@/utils/tips'
import {getLocalstorage, removeLocalstorage} from "@/utils/localStorage";
import router from "../router";

// 配置请求的跟路径
axios.defaults.baseURL = 'api'
axios.interceptors.request.use(config => {
    return config
})

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    //设置超时时间
    config.timeout = 5000;
    // 往header头自动添加token
    const token = getLocalstorage("Token")
    if (getLocalstorage("ShopId") !== '') {
        const shopId = getLocalstorage("ShopId")
        config.headers["ShopId"] = shopId
    }
    if (token) {
        config.headers["Token"] = token

    }

    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});
axios.interceptors.response.use(response => {
    let data = response.data
    console.log(data.code,"----")
    if (data.code === 200) {
        success(data.msg)
    } else {
        error(data.msg)
    }
    if (data.code === 401) {
        removeLocalstorage("Token")
        router.push("/login")
    }
    if (data.code === 403) {
        error(data.msg)
        router.push("/login")
    }
    return data.data
})

export default axios
