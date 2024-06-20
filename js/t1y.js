const T1Y_API_URL = "https://api.t1y.net"; // 您的T1后端云域名
const T1Y_APP_ID = "1001"; // 您的 APP ID
const T1Y_APP_API_KEY = "2c6118c4e02b40fe96f5c40ee1dc5561"; // 您的 API Key
const T1Y_APP_SECRET_KEY = "ac5070d211904b9a835e4f67138a36b7"; // 您的 Secret Key

// 添加一条数据
function createOne(collection, params) {
  return request(`/v5/classes/${collection}`, params, "post");
}

// 删除一条数据
function deleteOne(collection, id) {
  return request(`/v5/classes/${collection}/${id}`, {}, "delete");
}

// 更新一条数据
function updateOne(collection, id, params) {
  return request(`/v5/classes/${collection}/${id}`, params, "put");
}

// 查询一条数据
function findOne(collection, id) {
  return request(`/v5/classes/${collection}/${id}`, {}, "get");
}

// 查询全部数据（分页查询）
function findAll(collection, page, size) {
  return request(
    `/v5/classes/${collection}?page=${page}&size=${size}`,
    {},
    "get"
  );
}

// 批量添加数据
function createMany(collection, params) {
  return request(`/v5/classes/${collection}/batch`, params, "post");
}

// 批量删除数据
function deleteMany(collection, params) {
  return request(`/v5/classes/${collection}/batch`, params, "delete");
}

// 批量更新数据
function updateMany(collection, params) {
  return request(`/v5/classes/${collection}/batch`, params, "put");
}

// 高级查询（分页、排序、比较）
function query(collection, params) {
  return request(`/v5/classes/${collection}/query`, params, "post");
}

// 聚合查询（分组、聚合、运算）
function aggregate(collection, params) {
  return request(`/v5/classes/${collection}/aggregate`, params, "post");
}

// 查询所有集合
function getAllCollections() {
  return request(`/v5/schemas`, {}, "get");
}

// 创建集合
function createCollection(collection) {
  return request(`/v5/schemas/${collection}`, {}, "post");
}

// 清空集合
function clearCollection(collection) {
  return request(`/v5/schemas/${collection}`, {}, "put");
}

// 删除集合
function deleteCollection(collection) {
  return request(`/v5/schemas/${collection}`, {}, "delete");
}

// 发送邮件
function sendEmail(params) {
  return request(`/v5/sys/email`, params, "post");
}

// 发送短信验证码
function sendSMSCode(phone) {
  return request(`/v5/sys/code?phone=${phone}`, {}, "get");
}

// 调用云函数
function callFunc(name, params) {
  return request(`/${T1Y_APP_ID}/${name}`, params, "post");
}

function request(path, params, type) {
  // 封装统一请求函数
  const url = new URL(T1Y_API_URL + path); // 构建完整请求url
  const nonceStr = md5(Math.floor(Math.random() * (1000 - 1 + 1)) + 1); // 生成32位随机数安全码
  const timestamp = Math.floor(Date.now() / 1000); // 获取当前时间戳，精确到秒
  return axios({
    url: url.toString(),
    method: type,
    data: type === "get" ? undefined : params,
    params: type === "get" ? params : undefined,
    headers: {
      // 构建T1后端云请求加密头
      "X-T1Y-Application-ID": T1Y_APP_ID,
      "X-T1Y-Api-Key": T1Y_APP_API_KEY,
      "X-T1Y-Safe-NonceStr": nonceStr,
      "X-T1Y-Safe-Timestamp": timestamp,
      "X-T1Y-Safe-Sign": md5(
        url.pathname +
          T1Y_APP_ID +
          T1Y_APP_API_KEY +
          nonceStr +
          timestamp +
          T1Y_APP_SECRET_KEY
      ), // 生成请求签名
    },
  });
}

function md5(text) {
  return CryptoJS.MD5(text).toString();
}
