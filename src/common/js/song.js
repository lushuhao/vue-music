import {getSongUrl, getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Toast} from 'mint-ui'
import {Base64} from 'js-base64'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
  }

  async getSongUrl() {
    await getSongUrl(this.mid).then(url => {
      if (url.code === ERR_OK) {
        Toast(url.msg)
      }
      this.url = url
    })
  }

  async getLyric() {
    this.lyric = 'no lyric'
    await getLyric(this.mid).then(res => {
      if (res.retcode === ERR_OK) {
        this.lyric = Base64.decode(res.lyric)
      }
    })
  }
}

export function createSong(musicData) {
  const {songid, songmid, songname, singer, albumname, albummid, interval} = musicData

  return new Song({
    id: songid,
    mid: songmid,
    name: songname,
    singer: filterSinger(singer),
    album: albumname,
    duration: interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000`,
  })
}

function filterSinger(singer) {
  if (!singer) {
    return ''
  }
  let name = singer.map(item => {
    return item.name
  })
  return name.join('/')
}
