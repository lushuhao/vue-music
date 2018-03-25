export const pad = (num, n = 2) => { // 补0，默认两位
  let len = num.toString().length
  while (len < n) {
    num = '0' + num
    len++
  }
  return num
}

export function shuffle(arr) { // 对数组洗牌,有副作用，会修改原来的数组
  let _arr = [...arr] // 深复制
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i);
    [_arr[i], _arr[j]] = [_arr[j], _arr[i]]
  }
  return _arr
}

function getRandomInt(min, max) { // 获取[min, max]之间的一个随机数
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export function isCacheExpiration(cacheDate) {
  const currentDate = new Date().toLocaleDateString()
  if (!cacheDate) { // 当前没有缓存日期，提示设置成本地日期
    return true
  }
  return cacheDate !== currentDate
}
