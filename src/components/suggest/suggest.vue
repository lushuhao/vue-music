<template>
  <div class="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item.type)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {createSong} from 'common/js/song'

  const TYPE_SINGER = 'singer'

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: []
      }
    },
    watch: {
      query() {
        this.search()
      }
    },
    methods: {
      search() {
        search(this.query, this.page, this.showSinger).then(res => {
          this.result = this._genResult(res)
        })
      },
      getIconCls(type) {
        if (type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
          ret.push({
            ...data.zhida,
            type: TYPE_SINGER
          })
        }
        if (data.song) {
          ret = [...ret, ...this._normalizeSongs(data.song.list)]
        }
        return ret
      },
      _normalizeSongs(list) {
        return list.map(musicData => {
          if (musicData.songid && musicData.albummid) {
            return createSong(musicData)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest {
    height: 100%
    overflow: hidden

    &-list{
      padding: 0 30px

      .suggest-item{
        display: flex
        align-items: center
        padding-bottom: 20px

        .icon{
          flex: 0 0 30px
          width:30px

          [class^='icon-'] {
            font-size: 14px
            color: $color-text-d
          }
        }

        .name{
          flex: 1
          font-size: $font-size-medium
          color: $color-text-d
          overflow: hidden

          .text{
            no-wrap()
          }
        }
      }
    }
  }
</style>
