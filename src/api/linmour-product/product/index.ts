import request from "@/utils/request";

export function getProductList(shopId) {
    return request.get('/product/product/getProductList/'+shopId);
}