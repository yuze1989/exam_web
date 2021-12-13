import axios from "axios";
class MyUploadAdapter {
    constructor(loader) {
        // Save Loader instance to update upload progress.
        this.loader = loader
    }

    async upload() {
        const data = new FormData()
        data.append('typeOption', 'upload_image')
        data.append('upload', await this.loader.file)

        return new Promise((resolve, reject) => {
            axios({
                url: `/file/upload`,
                method: 'post',
                data,
                headers: {
                    'Authorization': 'Bearer tokenxxxxxxxxxxxxxxxxxxx'  // 此处为你定义的token 值(Bearer token 接口认证方式)
                },
                withCredentials: true // true 为不允许带 token, false 为允许，可能会遇到跨域报错：Error: Network Error 弹窗提示
            }).then(res => {
                var resData = res.data
                resData.default = resData.url
                resolve(resData)
            }).catch(error => {
                reject(error)
            })
        })
    }

    abort () {

    }
}