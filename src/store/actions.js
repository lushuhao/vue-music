import * as types from './mutation-types'

export const selectPlay = ({commit, state}, {list, index}) => { // 两个参数context默认store属性，playload手动传入并被添加到该对象中
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
