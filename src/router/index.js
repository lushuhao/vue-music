import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Recommend = () => import(/* webpackChunkName: "group-recommend" */ 'components/recommend/recommend')

const Singer = () => import(/* webpackChunkName: "group-singer" */ 'components/singer/singer')

const SingerDetail = () => import(/* webpackChunkName: "group-singer-detail" */ 'components/singer/singerDetail')

const Disc = () => import(/* webpackChunkName: "group-disc" */ 'components/disc/disc')

const Rank = () => import(/* webpackChunkName: "group-rank" */ 'components/rank/rank')

const TopList = () => import(/* webpackChunkName: "group-top-list" */ 'components/top-list/top-list')

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
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
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
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [{
        path: ':id',
        component: SingerDetail
      }]
    },
  ]
})
