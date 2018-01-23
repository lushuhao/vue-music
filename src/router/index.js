import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Recommend = () => import(/* webpackChunkName: "group-recommend" */ 'components/recommend/recommend')

const Singer = () => import(/* webpackChunkName: "group-singer" */ 'components/singer/singer')

const SingerDetail = () => import(/* webpackChunkName: "group-singer-detail" */ 'components/singer/singerDetail')

const Disc = () => import(/* webpackChunkName: "group-disc" */ 'components/disc/disc')

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
    }
  ]
})
