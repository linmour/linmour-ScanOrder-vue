import request from "@/utils/request";

export function getProductPage(params) {
    return request.get('/product/product/getProductPage', {
        params
    });
}


export function changeProduct(id, status) {
    return request.post('/product/product/changeProduct', {
        id,
        status
    });
}

export function getProductDetails(id) {
    return request.get('/product/product/getProductDetails?productIds=0' + '&productIds=' + id);
}

export function addProduct(product) {
    return request.post('/product/product/addProduct', {
        product
    });
}

export function updateProduct(product) {
    return request.post('/product/product/updateProduct', {
        product
    });
}

export function createProductSort(sort, shopId) {
    return request.post('/product/sort/createProductSort', {
        sort,
        shopId
    });
}

export function getProductSort() {
    return request.get('/product/sort/getProductSort');
}
