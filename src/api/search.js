import {commonParams, options, ERR_OK} from './config'
import jsonp from 'common/js/jsonp'
import axios from 'axios'

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

export function search(query, page, hasSinger) {
  const url = 'search'

  const data = {
    ...commonParams,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    w: query,
    zhidaqu: 1,
    catZhida: hasSinger ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: 20,
    n: 20,
    p: page,
    remoteplace: 'txt.mqq.all'
  }

  return axios.get(url, {
    params: data
  }).then(res => {
    if (res.data.code === ERR_OK) {
      return res.data.data
    }
  })
}
