// import {getSongUrl} from 'api/song'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
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
