import {commonParams, options} from './config'
import jsonp from 'common/js/jsonp'

export function getSingerList(pagenum) {
  const url = 'https://szc.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum,
    notice: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
  })

  return jsonp(url, data, options)
}

export function getSingerDetail(mid, num = 100) {
  const url = 'http://proxy.lushuhao.club/music/getSinger'

  const data = Object.assign({}, commonParams, {
    g_tk: 336982717,
    singermid: mid,
    platform: 'yqq',
    needNewCode: 0,
    num: num,
    begin: 0,
    order: 'listen',
    songstatus: 1
  })

  return jsonp(url, data, options)
}
