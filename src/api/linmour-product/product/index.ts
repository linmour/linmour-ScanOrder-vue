import request from "@/utils/request";

export function getProductList(params) {
    return request.get('/product/product/getProductList',{
        params
    });
}

export function getProductSort() {
    return request.get('/product/sort/getProductSort');
}

export function changeProduct(product) {
    return request.post('/product/product/changeProduct',{
        product
    });
}

export function getProductDetails(id) {
    return request.get('/product/product/getProductDetails/'+id);
}

export function addProduct(product) {
    return request.post('/product/product/addProduct',{
        product
    });
}

export function updateProduct(product) {
    return request.post('/product/product/updateProduct',{
        product
    });
}
