export function getLocalstorage(key: string) {
    let value = window.localStorage.getItem(key)
    value = value === null ? '' : value
    return value
}

export function setLocalstorage(key: string, value: any) {
    if (key && value !== '') {
        if (typeof value === 'object') {
            value = JSON.stringify(value)
        }
        window.localStorage.setItem(key, value)
    }
}

export function removeLocalstorage(key: string) {
    if (getLocalstorage(key)) {
        window.localStorage.removeItem(key)
    }
}

export function getUserInfo(){
    return JSON.parse(getLocalstorage('UserInfo'))
}






