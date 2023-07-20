import { ElNotification } from 'element-plus'

// 消息成功提示
export function success(message,type = "success",dangerouslyUseHTMLString = false){
    ElNotification({
        message,
        type,
        dangerouslyUseHTMLString,
        duration:1200
    })
}

// 消息失败提示
export function error(message,type = "error",dangerouslyUseHTMLString = false){
    ElNotification({
        message: message || "请求错误",
        type,
        dangerouslyUseHTMLString,
        duration:1200
    })
}