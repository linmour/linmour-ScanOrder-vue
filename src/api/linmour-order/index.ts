import request from "@/utils/request";

export function getOrderInfo(tableId) {
    return request.get('/getOrder/'+ tableId);
}
