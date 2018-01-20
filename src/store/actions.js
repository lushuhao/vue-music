import * as types from './mutation-types'
import {getSongUrl} from 'api/song'
import {Toast} from 'mint-ui'

export const selectPlay = ({commit, state}, {list, index}) => { // 两个参数context默认store属性，playload手动传入并被添加到该对象中
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)

  setCurrentSong({commit, state})
}

export const setCurrentSong = async ({commit, state}) => {
  let playList = state.playList
  let currentSong = playList[state.currentIndex]
  let mid = currentSong.mid

  commit(types.SET_CURRENT_SONG, currentSong)

  if (!currentSong.url) { // 如果当前歌曲没有url，获取URL并保存到playList
    await getSongUrl(mid).then(url => {
      if (url.code === 0) {
        Toast(url.msg)
      }
      currentSong = Object.assign({}, currentSong, {url})
      playList[state.currentIndex] = currentSong

      commit(types.SET_CURRENT_SONG, currentSong)
      commit(types.SET_PLAY_LIST, playList)
    })
  }

  if (currentSong.url.code === 0) { // 没有版权
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}
