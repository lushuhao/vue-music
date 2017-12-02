export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ') // 添加className
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s+)' + className + '(\\s|$)') // \\s 转义空白匹配字符
  return reg.test(el.className)
}
