import request from "@/utils/request";

export function getTable() {
    return request.get('/restaurant/table/getTable');
}

export function createTable(dto) {
    return request.post('/restaurant/table/createTable',{
        dto
    });
}

