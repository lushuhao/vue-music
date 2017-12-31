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
      this._getSingerList()
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      selectSinger(singer) {
        this.setSinger(singer)
        this.$router.push(`/singer/${singer.id}`)
      },
      _getSingerList() {
        getSingerList().then(res => {
          if (res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
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
          const singer = {
            id: item.Fsinger_id,
            name: item.Fsinger_name,
            avatar: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`
          }
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
