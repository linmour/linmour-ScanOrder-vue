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

export function saveOrUpdateProduct(product) {
    return request.post('/product/product/saveOrUpdateProduct', {
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

export function getProductInventory(params) {
    return request.get('/product/inventory/getProductInventory', {
        params
    });

}

export function deletedProduct(id) {
    return request.get('/product/product/deletedProduct/' + id);
}

export function createInventory(dto) {
    return request.post('/product/inventory/createInventory',dto);

}

export function deletedInventory(id) {
    return request.get('/product/inventory/deletedInventory/' + id);
}

export function getProductInventoryById(id) {
    return request.get('/product/inventory/getProductInventoryById/' + id);
}

export function updateInventory(param) {
    return request.post('/product/inventory/updateInventory',param);

}
