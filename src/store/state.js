import {playMode} from 'common/js/config'

const state = {
  singer: {},
  playing: false, // 播放状态
  fullScreen: false, // 全屏
  playList: [], // 播放列表
  sequenceList: [], // 顺序播放列表
  playMode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放索引
  currentSong: '', // 当前播放歌曲
}

export default state
