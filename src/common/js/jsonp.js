import originJSONP from 'jsonp'
import {defaultConfig} from 'api/config'

export default function jsonp(url, data, option) {
  url = setBaseUrl(url)
  url += (url.indexOf('?') === -1 ? '?' : '&') + param(data) // 判断是否有?号

  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function param(data) {
  let url = ''
  for (let i in data) {
    if (data.hasOwnProperty(i)) {
      let value = data[i] !== undefined ? data[i] : ''
      url += `&${i}=${encodeURIComponent(value)}`
    }
  }
  return url ? url.substring(1) : ''  // 删除第一个&，不确定是否有？
}

function setBaseUrl(url) {
  if (url.includes('http')) {
    return url
  } else {
    return defaultConfig.baseURL + url
  }
}
