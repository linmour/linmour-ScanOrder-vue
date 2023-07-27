import request from "@/utils/request";


export function login(phone,password) {
    return request.post('/account/merchant/login',{
        phone,
        password,
    });
}


export function logout(id) {
    return request.post('/account/merchant/logout/'+id);
}

// export function userInfo() {
//     return request.post('/account/merchant/userInfo');
// }


export function update(userInfo) {
    return request.post('/account/merchant/update',{
        userInfo
    });
}