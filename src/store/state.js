import {playMode} from 'common/js/config'
import {getInitSearch, loadPlay} from 'common/js/cache'

const initPlayList = loadPlay()

const currentSong = initPlayList.length && initPlayList[0]

const currentIndex = initPlayList.findIndex(item => {
  if (item && currentSong) {
    return item.id === currentSong.id
  } else {
    return -1
  }
})

const state = {
  singer: {}, // 歌手详情页
  playing: false, // 播放状态
  fullScreen: false, // 全屏
  playList: initPlayList, // 播放列表
  sequenceList: initPlayList, // 顺序播放列表
  playMode: playMode.sequence, // 播放模式
  currentIndex, // 当前播放索引
  currentSong, // 当前播放歌曲
  disc: {}, // 歌单详情页
  topList: {}, // 排行榜详情页
  searchHistory: getInitSearch(), // 搜索历史
  playHistory: initPlayList, // 播放历史
}

export default state
