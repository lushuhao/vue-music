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

export function getData(el, name, val) { // val为空是get操作，有值是set操作
  name = 'data-' + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

// 创建一个标签，拿到style，支持哪些前缀
let elementStyle = document.createElement('div').style

// IIFE浏览器厂商
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function perfixStyle(style) {
  if (!vendor) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

export function getStyle(el) {
  return window.getComputedStyle(el)
}
