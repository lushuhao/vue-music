import {commonParams} from './config'
import axios from 'axios'

export async function getTopList() {
  const url = 'http://proxy.lushuhao.club/music/getTopList'

  const data = {
    ...commonParams,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
  }

  const res = await axios.get(url, {
    params: data
  })
  return res.data
}

export async function getMusicList(topid) {
  const url = 'http://proxy.lushuhao.club/music/getMusicList'

  const data = {
    ...commonParams,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid,
  }

  const res = await axios.get(url, {
    params: data
  })
  return res.data
}
