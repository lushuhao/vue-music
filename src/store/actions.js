import * as types from './mutation-types'
import {getSongUrl} from 'api/song'

export const selectPlay = ({commit, state}, {list, index}) => { // 两个参数context默认store属性，playload手动传入并被添加到该对象中
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)

  setCurrentSong({commit, state})
}

export const setCurrentSong = ({commit, state}) => {
  let currentSong = state.playList[state.currentIndex]
  let mid = currentSong.mid
  commit(types.SET_CURRENT_SONG, currentSong)

  return getSongUrl(mid).then(url => {
    currentSong = Object.assign({}, currentSong, {url})
    commit(types.SET_CURRENT_SONG, currentSong)
    commit(types.SET_PLAYING_STATE, true)
  })

}
