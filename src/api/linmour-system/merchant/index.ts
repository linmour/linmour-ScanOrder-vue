import request from "@/utils/request";


export function login(phone,password) {
    return request.post('/system/merchant/login',{
        phone,
        password,
    });
}


export function logout(id) {
    return request.post('/system/merchant/logout/'+id);
}

export function userInfo() {
    return request.post('/system/merchant/userInfo');
}

export function saveOrUpdateMerchant(param){
    return request.post('/system/merchant/saveOrUpdateMerchant',param);
}


export function update(userInfo) {
    return request.post('/system/merchant/update', userInfo
    );
}

export function getMerchant(param) {
    return request.get('/system/merchant/getMerchantPage', param);
}


export function save0rUpdateMerchant(param){
    return request.post('/system/merchant/save0rUpdateMerchant',param);
}
