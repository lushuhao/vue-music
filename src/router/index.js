import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Recommend = () => import(/* webpackChunkName: "group-recommend" */ 'components/recommend/recommend')

const Singer = () => import(/* webpackChunkName: "group-singer" */ 'components/singer/singer')

const SingerDetail = () => import(/* webpackChunkName: "group-singer" */ 'components/singer/singerDetail')

const Search = () => import(/* webpackChunkName: "group-search" */ 'components/search/search')

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
    },
    {
      path: '/singer',
      component: Singer,
      children: [{
        path: ':id',
        component: SingerDetail
      }]
    },
    {
      path: '/search',
      component: Search,
    },
  ]
})
