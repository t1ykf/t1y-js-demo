const T1Y_API_URL = 'https://api.t1y.net' // 您的T1后端云域名
const T1Y_APP_ID = '1001' // 您的 APP ID
const T1Y_APP_API_KEY = '2c6118c4e02b40fe96f5c40ee1dc5561' // 您的 API Key
const T1Y_APP_SECRET_KEY = '650bd657da0243b282d9cab6d75a80ff' // 您的 Secret Key

function createOne(table, params) { // 添加一条数据
    return request(`/v5/classes/${table}`, params, 'post')
}

function deleteOne(table, id) { // 删除一条数据
    return request(`/v5/classes/${table}/${id}`, {}, 'delete')
}

// 使用 request 函数封装更多的接口操作……

function request(path, params, type) { // 封装统一请求函数
    const url = new URL(T1Y_API_URL + path) // 构建完整请求url
    const nonceStr = md5(Math.floor(Math.random() * (1000 - 1 + 1)) + 1) // 生成32位随机数安全码
    const timestamp = Math.floor(Date.now() / 1000) // 获取当前时间戳，精确到秒
    return axios({
        url: url.toString(),
        method: type,
        data: type === 'get' ? undefined : params,
        params: type === 'get' ? params : undefined,
        headers: { // 构建T1后端云请求加密头
            'X-T1Y-Application-ID': T1Y_APP_ID,
            'X-T1Y-Api-Key': T1Y_APP_API_KEY,
            'X-T1Y-Safe-NonceStr': nonceStr,
            'X-T1Y-Safe-Timestamp': timestamp,
            'X-T1Y-Safe-Sign': md5(url.pathname + T1Y_APP_ID + T1Y_APP_API_KEY + nonceStr + timestamp + T1Y_APP_SECRET_KEY) // 生成请求签名
        }
    })
}

function md5(text) {
    return CryptoJS.MD5(text).toString()
}