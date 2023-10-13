import request from "@/utils/request";

export function shopList(params) {
    return request.get('/system/shop/shopList',{
        params
    });
}




