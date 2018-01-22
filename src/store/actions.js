import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

export const selectPlay = ({commit, state}, {list, index}) => { // 两个参数context默认store属性，playload手动传入并被添加到该对象中
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.playMode === playMode.random) {
    let randomList = shuffle(list)
    index = findIndex(randomList, list[index])
    commit(types.SET_PLAY_LIST, randomList)
  } else {
    commit(types.SET_PLAY_LIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)

  setCurrentSong({commit, state})
}

export const setCurrentSong = async ({commit, state}) => {
  let playList = state.playList
  let currentSong = playList[state.currentIndex]

  commit(types.SET_CURRENT_SONG, currentSong)

  if (!currentSong.url) { // 如果当前歌曲没有url，获取URL并保存到playList
    await currentSong.getSongUrl()
    await currentSong.getLyric() // 没有歌词, 获取并保存
    playList[state.currentIndex] = currentSong

    let sequenceIndex = state.sequenceList.findIndex(item => {
      return item.id === currentSong.id
    })

    let sequenceList = state.sequenceList

    sequenceList[sequenceIndex] = currentSong // 保存歌曲地址到原始列表

    commit(types.SET_CURRENT_SONG, currentSong)
    commit(types.SET_PLAY_LIST, playList)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
  }

  if (currentSong.url.code === 0) { // 没有版权
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

export const randomPlay = ({commit, state}, {list}) => {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_PLAY_LIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  setCurrentSong({commit, state})
}
