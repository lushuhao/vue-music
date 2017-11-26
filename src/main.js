import Vue from 'vue'
import App from './App'
// import router from './router'

import 'common/stylus/index.styl'

Vue.config.productionTip = false // 关闭生产模式下给出的提示

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
