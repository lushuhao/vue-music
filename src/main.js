import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
import axios from 'axios'
import {defaultConfig, response, responseError} from 'api/config'

import 'common/stylus/index.styl'

Vue.config.productionTip = false // 关闭生产模式下给出的提示

fastclick.attach(document.body) // 取消300ms的touch延迟

Vue.use(VueLazyLoad, {
  loading: require('common/image/default.png') // webpack解析替换成base64地址
})

axios.defaults = Object.assign(axios.defaults, defaultConfig)

// 添加响应拦截器
axios.interceptors.response.use(response, responseError)

window.bus = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
