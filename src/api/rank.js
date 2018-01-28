import {commonParams} from './config'
import axios from 'axios'

export async function getTopList() {
  const url = 'getTopList'

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
  const url = 'getMusicList'

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
