import request from "@/utils/request";

export function getOrderInfo(tableId) {
    return request.get('/order/order/getOrderInfo/'+ tableId);
}

export function changeOrder(orderInfoDto) {
    return request.post('/order/order/changeOrder', {orderInfoDto});
}

