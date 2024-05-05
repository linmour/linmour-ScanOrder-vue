import request from "@/utils/request";

export function shopList(params) {
    return request.get('/system/shop/shopList', params);
}



export function save0rUpdateShop(param){
    return request.post('/system/shop/save0rUpdateShop',param);
}


