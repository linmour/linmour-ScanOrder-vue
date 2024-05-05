import request from "@/utils/request";
//todo 字典
export function getDictList() {
    return request.get('/system/dict/getDictList');
}


