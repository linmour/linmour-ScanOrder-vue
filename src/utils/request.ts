import axios from 'axios'
import {error, success} from '@/utils/tips'
import {getLocalstorage, removeLocalstorage} from "@/utils/localStorage";

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
        const shopId = JSON.parse(getLocalstorage("ShopId")).shopId
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

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
//TODO  删除多余code验证
    if (response.data.code === 200) {
        success(response.data.msg)
    } else {
        error(response.data.msg)
    }
    if (response.data.code === 401) {
        removeLocalstorage("Token")
        // router.push("/login")
    }
    if (response.data.code === 403) {
      error(response.data.msg)
        // router.push("/login")
    }

    // 这个就直接是对返回的数据进行操作了
    return response.data;
}, function (err) {

    // 对响应错误做点什么

    error("请求错误")

    return Promise.reject(err);
})
export default axios
