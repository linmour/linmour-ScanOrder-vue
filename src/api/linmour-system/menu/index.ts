import request from "@/utils/request";

export function getMenus() {
    return request.get('/system/menu/getMenus');
}
