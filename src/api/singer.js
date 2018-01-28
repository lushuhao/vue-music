import {commonParams, options} from './config'
import jsonp from 'common/js/jsonp'

export function getSingerList(pagenum) {
  const url = 'https://szc.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = {
    ...commonParams,
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
  }

  return jsonp(url, data, options)
}

export function getSingerDetail(mid, num = 100) {
  const url = 'getSinger'

  const data = {
    ...commonParams,
    singermid: mid,
    platform: 'yqq',
    needNewCode: 0,
    num: num,
    begin: 0,
    order: 'listen',
    songstatus: 1
  }

  return jsonp(url, data, options)
}
