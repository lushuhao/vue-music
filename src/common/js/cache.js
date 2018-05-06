import {isCacheExpiration} from 'common/js/util'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

export function saveSearch(query) {
  let searches = store.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  store.set(SEARCH_KEY, searches)
  return searches
}

export function deleteSearch(query) {
  let searches = store.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  store.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  store.remove(SEARCH_KEY)
  return []
}

export function getInitSearch() {
  return store.get(SEARCH_KEY, [])
}

export function savePlay(song) {
  let songs = store.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, PLAY_MAX_LENGTH)
  store.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
  const playList = store.get(PLAY_KEY, [])
  return playList.map(item => {
    if (isCacheExpiration(item.catchDate)) {
      item.url = ''
      return item
    }
  })
}

export function deletePlay(song) {
  let songs = store.get(PLAY_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  store.set(PLAY_KEY, songs)
  return songs
}

export function saveFavorite(song) {
  let songs = store.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  }, FAVORITE_MAX_LENGTH)
  store.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = store.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  store.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return store.get(FAVORITE_KEY, [])
}

function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }

  if (index > 0) {
    arr.splice(index, 1) // 删掉之前的历史记录
  }

  arr.unshift(val) // 插入到第一条

  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

const store = {
  storage: window.localStorage,
  get(key, val) {
    let storage = this.storage.getItem(key)
    return JSON.parse(storage) || val
  },
  set(key, val) {
    if (val === undefined) {
      this.remove(key)
    }
    this.storage.setItem(key, JSON.stringify(val))
    return val
  },
  remove(key) {
    this.storage.removeItem(key)
  }
}
