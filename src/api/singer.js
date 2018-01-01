import {commonParams, options} from './config'
import jsonp from 'common/js/jsonp'
import axios from 'axios'

export function getSingerList() {
  const url = 'https://szc.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    notice: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
  })

  return jsonp(url, data, options)
}

export async function getSingerDetail(id, num = 100) {
  const url = 'http://proxy.lushuhao.club/music/getSinger'

  const data = Object.assign({}, commonParams, {
    singerid: id,
    format: 'json',
    from: 'h5',
    num: num,
    begin: 0
  })

  const res = await axios.get(url, {
    params: data
  })

  return res.data
}
