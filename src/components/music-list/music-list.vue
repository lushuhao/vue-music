<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <marquee-title :title="title"></marquee-title>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper" v-show="songs.length" ref="playBtn" @click="random">
        <div class="play">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list"
            ref="list">
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import MarqueeTitle from 'base/marquee-title/marquee-title'
  import {perfixStyle} from 'common/js/dom'
  import {mapActions} from 'vuex'
  import {playListMixin} from 'common/js/mixin'

  const RESERVED_HEIGHT = 40  // 预留高度
  const transform = perfixStyle('transform')
  const backdrop = perfixStyle('backdrop-filter')

  export default {
    mixins: [playListMixin],
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        scrollY: 0
      }
    },
    computed: {
      bgStyle() {
        return `background-image: url(${this.bgImage})`
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
      this.imageHeight = 0
      this.minTranslateY = 0
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    watch: {
      scrollY(newY) {
        let translateY = Math.max(this.minTranslateY, newY)
        let zIndex = 0
        let scale = 1
        let blur = 0
        const percent = Math.abs(newY / this.imageHeight)
        this.$refs.layer.style[transform] = `translateY(${translateY}px)`
        if (newY > 0) { // 列表从初始位置下拉的时候
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20 * percent, 20)
        }
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`
        if (newY < this.minTranslateY) { // 滚动到顶部
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = RESERVED_HEIGHT + 'px'
          this.$refs.playBtn.style.display = 'none'
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
          this.$refs.playBtn.style.display = 'block'
        }
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style[transform] = `scale(${scale})`
      }
    },
    methods: {
      ...mapActions(['selectPlay', 'randomPlay']),
      handlePlayList(playList) {
        this.changeScrollList(playList, this.$refs.list.$el, this.$refs.list)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      back() {
        this.$router.back()
      },
      selectItem(item, index) {
        this.emit()
        this.selectPlay({
          list: this.songs,
          index,
        })
      },
      random() {
        this.emit()
        this.randomPlay({
          list: this.songs
        })
      },
      emit() {
        window.bus.$emit('audioPlay')
      }
    },
    components: {
      Scroll,
      SongList,
      MarqueeTitle
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list {
    position: fixed
    z-index: 100
    top: 0
    bottom: 0
    left: 0
    right: 0
    background: $color-background

    .back {
      position: absolute
      z-index: 50
      top: 0
      left: 6px
      .icon-back {
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
      }
    }

    .bg-image {
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      background-size: cover
      transform-origin: top

      .play-wrapper {
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%

        .play {
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          border-radius: 100px
          font-size: 0

          .icon-play {
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          }

          .text {
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
          }
        }
      }

      .filter {
        position: absolute
        top: 0
        bottom: 0
        left: 0
        right: 0
        background: rgba(7, 17, 27, .4)
      }
    }

    .bg-layer {
      height: 100%
      background: $color-background
    }

    .list {
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background-color: $color-background

      .song-list-wrapper {
        padding: 20px 30px
      }
    }
  }
</style>
