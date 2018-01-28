import {commonParams, options, ERR_OK} from './config'
import jsonp from 'common/js/jsonp'

export function getHotKey() {
  const url = 'getHotKey'

  const data = {
    ...commonParams,
    platform: 'yqq'
  }

  return jsonp(url, data, options).then(res => {
    if (res.code === ERR_OK) {
      return res.data
    }
  })
}

export function search() {
}
