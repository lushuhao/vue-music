const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

export function saveSearch(query) {
  let searches = store.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  store.set(SEARCH_KEY, searches)
  return searches
}

export function getInitSearch() {
  return store.get(SEARCH_KEY, [])
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
