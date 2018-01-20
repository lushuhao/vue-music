<template>
  <div class="singer">
    <list-view @select="selectSinger" :data="singers"></list-view>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import ListView from 'base/listview/listview'
  import Singer from 'common/js/singer'
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {mapMutations} from 'vuex'

  const HOT_TITLE = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    data() {
      return {
        singers: []
      }
    },
    created() {
      this.singerList = []
      Promise.all([this._getSingerList(1), this._getSingerList(2)]).then(() => {
        this.singers = this._normalizeSinger([...this.singerList[1], ...this.singerList[2]])
      })
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      selectSinger(singer) {
        this.setSinger(singer)
        this.$router.push(`/singer/${singer.id}`)
      },
      _getSingerList(pageNum) {
        return getSingerList(pageNum).then(res => {
          if (res.code === ERR_OK) {
            this.singerList[pageNum] = res.data.list
          }
        })
      },
      _normalizeSinger(list) {
        const map = {
          hot: {
            title: HOT_TITLE,
            items: []
          }
        }
        list.forEach((item, index) => {
          const singer = new Singer({
            id: item.Fsinger_id,
            mid: item.Fsinger_mid,
            name: item.Fsinger_name
          })
          const key = item.Findex
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(singer)
          }
          if (!map[key]) { // 添加首字母索引
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(singer)
        })
        // 对象循环不一定有序，转成数组
        const hot = []
        const ret = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_TITLE) {
            hot.push(val)
          }
        }
        ret.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0))
        return [...hot, ...ret]
      }
    },
    components: {
      ListView
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer {
    height: calc(100% - 44px - 44px)

    .slide-enter-active, .slide-leave-active {
      transition: all .3s
    }

    .slide-enter, .slide-leave-to {
      transform: translateX(100%)
    }
  }

</style>
