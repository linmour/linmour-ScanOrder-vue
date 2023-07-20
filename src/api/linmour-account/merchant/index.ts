import request from "@/utils/request";


export function login(phone,password) {
    return request.post('/account/merchant/login',{
        phone,
        password,
    });
}


export function logout() {
    return request.post('/account/merchant/logout');
}