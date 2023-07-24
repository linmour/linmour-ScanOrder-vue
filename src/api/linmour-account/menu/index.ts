import request from "@/utils/request";

export function getMenus() {
    return request.get('/account/menu/getMenus');
}