import axios from 'axios'
import {commonParams} from './config'

export async function getRecommend() {
  const url = 'http://proxy.lushuhao.club/music/getrecommend' // 反向代理QQ音乐接口

  let res = await axios.get(url)
  return res.data
}

export async function getDiscList() {
  const url = 'http://proxy.lushuhao.club/music/getdisclist'

  const data = Object.assign({}, commonParams, {
    g_tk: 1724489420,
    rnd: Math.random(),
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29
  })

  let res = await axios.get(url, {
    params: data
  })

  return res.data
}
