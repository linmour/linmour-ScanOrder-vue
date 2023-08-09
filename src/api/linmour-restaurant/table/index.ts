import request from "@/utils/request";

export function getTable(shopId) {
    return request.get('/restaurant/table/getTable?shopId='+ shopId);
}