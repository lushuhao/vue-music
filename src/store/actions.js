import * as types from './mutation-types'
import {getSongUrl} from 'api/song'

export const selectPlay = ({commit, state}, {list, index, mid}) => { // 两个参数context默认store属性，playload手动传入并被添加到该对象中
  let currentSong = list[index]

  getSongUrl(mid).then(url => {
    currentSong.url = url
    commit(types.SET_SEQUENCE_LIST, list)
    commit(types.SET_PLAY_LIST, list)
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
    commit(types.SET_CURRENT_SONG, currentSong)
  })
}
