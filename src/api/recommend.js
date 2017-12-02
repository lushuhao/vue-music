import axios from 'axios'

export async function getRecommend() {
  const url = 'http://proxy.lushuhao.club/music/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg' // 反向代理QQ音乐接口

  let res = await axios.get(url)
  return res.data
}
