export const pad = (num, n = 2) => { // 补0，默认两位
  let len = num.toString().length
  while (len < n) {
    num = '0' + num
    len++
  }
  return num
}

export function shuffle(arr) { // 对数组洗牌
  for (let i = 0; i < arr.length; i++) {
    let j = getRandomInt(0, i);
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function getRandomInt(min, max) { // 获取[min, max]之间的一个随机数
  return Math.floor(Math.random() * (max - min + 1) + min)
}
