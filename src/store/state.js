import {playMode} from 'common/js/config'
import {getInitSearch} from 'common/js/cache'

const state = {
  singer: {}, // 歌手详情页
  playing: false, // 播放状态
  fullScreen: false, // 全屏
  playList: [], // 播放列表
  sequenceList: [], // 顺序播放列表
  playMode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放索引
  currentSong: '', // 当前播放歌曲
  disc: {}, // 歌单详情页
  topList: {}, // 排行榜详情页
  searchHistory: getInitSearch(), // 搜索历史
}

export default state
