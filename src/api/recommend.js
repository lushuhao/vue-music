import axios from 'axios'
import {commonParams} from './config'

export async function getRecommend() {
  const url = 'getRecommend' // 反向代理QQ音乐接口

  let res = await axios.get(url)
  return res.data
}

export async function getDiscList() {
  const url = 'getDiscList'

  const data = {
    ...commonParams,
    rnd: Math.random(),
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29,
    format: 'json'
  }

  let res = await axios.get(url, {
    params: data
  })

  return res.data
}

export async function getSongList(disstid) {
  const url = 'getDisc'

  const data = {
    ...commonParams,
    uin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0,
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 1,
    picmid: 1,
    nosign: 0,
  }

  const res = await axios.get(url, {
    params: data
  })

  return res.data
}
