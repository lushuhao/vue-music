import {Toast} from 'mint-ui'

export const commonParams = { // QQ音乐jsonp公共参数
  g_tk: 1928093487,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

export const options = { // jsonp库的回调函数name
  param: 'jsonpCallback'
}

export const ERR_OK = 0 // 错误码为0，即成功code=0

export const defaultConfig = {
  // 代理服务器地址
  baseURL: 'https://nginx.lushuhao.cn/music/',
  // 现在，在超时前，所有请求都会等待 6 秒
  timeout: 6000,

}

export function response (response) {
  // 对响应数据做点什么
  return response
}

export function responseError (error) {
  // 对响应错误做点什么
  let errText = ''
  switch (error && error.message) {
    case `timeout of ${defaultConfig.timeout}ms exceeded`:
      errText = '接口超时，请重新获取'
      break
  }
  Toast(errText)
  return Promise.reject(error)
}
