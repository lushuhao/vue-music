import {commonParams} from './config'
import axios from 'axios'

export async function getSongUrl(songmid) {
  const url = 'http://proxy.lushuhao.club/music/getSongUrl'

  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    songmid,
    filename: `C400${songmid}.m4a`,
    guid: 5373641614
  })

  const res = await axios.get(url, {
    params: data
  })

  const vkey = res.data.data.items[0].vkey // QQ音乐播放歌曲播放地址需要uin，songmid，guid，formtag
  if (!vkey) {
    return {
      code: 0,
      msg: '版权受限，无法播放歌曲'
    }
  }
  return `http://dl.stream.qqmusic.qq.com/C400${songmid}.m4a?vkey=${vkey}&guid=5373641614&fromtag=66`
}
