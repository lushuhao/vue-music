export const pad = (num, n = 2) => { // 补0，默认两位
  let len = num.toString().length
  while (len < n) {
    num = '0' + num
    len++
  }
  return num
}
