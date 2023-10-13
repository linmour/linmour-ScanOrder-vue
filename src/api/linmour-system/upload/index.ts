import request from "@/utils/request";


export function uploadImgs(files) {
    return request.post("/system/upload/uploadImgs", files)
}
