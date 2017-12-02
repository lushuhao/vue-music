import Vue from 'vue'
import App from './App.vue'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

import 'common/stylus/index.styl'

Vue.config.productionTip = false // 关闭生产模式下给出的提示

fastclick.attach(document.body) // 取消300ms的touch延迟

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png') // webpack解析替换成base64地址
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
