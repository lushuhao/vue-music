export default class Singer {
  constructor({id, mid, name}) {
    this.id = id
    this.name = name
    this.mid = mid
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${mid}.jpg?max_age=2592000`
  }
}
