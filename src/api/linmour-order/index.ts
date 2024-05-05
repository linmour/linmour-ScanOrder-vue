import request from "@/utils/request";

// export function getOrderInfo(tableId) {
//     return request.get('/order/order/getOrderInfo/'+ tableId);
// }

export function GetCurrentOrderInfo(tableId) {
    return request.get('/order/order/GetCurrentOrderInfo/'+ tableId);
}



export function GetOrderByShopId() {
    return request.get('/order/order/GetOrderByShopId');
}

export function getOrderPayAmount(param) {
    return request.get('/order/order/getOrderPayAmount',param);
}

export function changeOrder(orderInfoDto) {
    return request.post('/order/order/changeOrder', {orderInfoDto});
}

export const checkout = (tableId,payType,openid) => request({url: '/app/order/order/checkout'  ,method: 'post',
    data: {tableId,payType,openid}
})
export const updateOrderItemStatus = (tableId,index) => request({
    url: '/app/order/order/updateOrderItemStatus/'+tableId +"/" +index, method: 'post',
})
