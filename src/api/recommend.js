import axios from 'axios'

export function getRecommend() {
  const url = 'http://proxy.lushuhao.club/music/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg' // 反向代理QQ音乐接口

  return axios.get(url).then(res => res.data)
}
