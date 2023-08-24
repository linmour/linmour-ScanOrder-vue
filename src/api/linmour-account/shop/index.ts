import request from "@/utils/request";

export function shopList(params) {
    return request.get('/account/shop/shopList',{
        params
    });
}




