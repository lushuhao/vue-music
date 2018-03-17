import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch} from 'common/js/cache'

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
    currentSong = Object.assign({}, currentSong)
    playList[state.currentIndex] = currentSong

    let sequenceIndex = findIndex(state.sequenceList, currentSong)

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

export const insertSong = ({commit, state}, song) => {
  let playList = [...state.playList]
  let sequenceList = [...state.sequenceList]
  let {currentIndex, currentSong} = state

  // 查找当前列表是否有待插入歌曲
  let fpIndex = findIndex(playList, song)
  // 插入歌曲索引加1
  currentIndex++
  playList.splice(currentIndex, 0, song)
  // 如果已经包含这首歌
  if (fpIndex > -1) {
    // 如果当前歌曲索引大于列表中已有的索引
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      // 插入了一首歌，后面的索引均要加1
      playList.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  setCurrentSong({commit, state})
}

export const deleteSong = ({commit, state}, song) => {
  let playList = [...state.playList]
  let sequenceList = [...state.sequenceList]
  let {currentIndex} = state
  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)

  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAY_LIST, playList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  if (!playList.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    setCurrentSong({commit, state})
  }
}

export const saveSearchHistory = ({commit}, query) => {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query)) // 存储到localStorage，再存储到state
}

export const deleteSearchHistory = ({commit}, query) => {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query)) // 删除localStorage中相应query，再存储到state
}

export const clearSearchHistory = ({commit}) => {
  commit(types.SET_SEARCH_HISTORY, clearSearch()) // 清空localStorage，再存储到state
}
