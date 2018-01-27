import {commonParams, options} from './config'
import axios from 'axios'
import jsonp from 'common/js/jsonp'

export async function getSongUrl(songmid) {
  const url = 'http://proxy.lushuhao.club/music/getSongUrl'

  const data = {
    ...commonParams,
    format: 'json',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    songmid,
    filename: `C400${songmid}.m4a`,
    guid: 5373641614
  }

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

export function getLyric(mid) {
  const url = 'http://proxy.lushuhao.club/music/getLyric'

  const data = {
    ...commonParams,
    songmid: mid,
    platform: 'yqq',
  }

  return jsonp(url, data, options)
}
