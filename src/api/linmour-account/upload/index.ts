import request from "@/utils/request";

export function uploadImage(file) {
    return request.post('/product/product/upload_product',{
        file
    });
}