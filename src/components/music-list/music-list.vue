<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll @scroll="scroll" :probe-type="probeType" :listen-scroll="listenScroll" :data="songs" class="list"
            ref="list">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'

  const RESERVED_HEIGHT = 40  // 预留高度

  export default {
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
        this.$refs.layer.style.transform = `translateY(${translateY}px)`
        this.$refs.layer.style.webkitTransform = `translateY(${translateY}px)`
        if (newY > 0) { // 列表从初始位置下拉的时候
          scale = 1 + percent
          zIndex = 10
        } else {
          blur = Math.min(20 * percent, 20)
        }
        this.$refs.filter.style['backdrop-filter'] = `blur(${blur}px)`
        this.$refs.filter.style['webkitBackdrop-filter'] = `blur(${blur}px)`
        if (newY < this.minTranslateY) {
          zIndex = 10
          this.$refs.bgImage.style.paddingTop = 0
          this.$refs.bgImage.style.height = RESERVED_HEIGHT + 'px'
        } else {
          this.$refs.bgImage.style.paddingTop = '70%'
          this.$refs.bgImage.style.height = 0
        }
        this.$refs.bgImage.style.zIndex = zIndex
        this.$refs.bgImage.style.transform = `scale(${scale})`
        this.$refs.bgImage.style.webkitTransform = `scale(${scale})`
      }
    },
    methods: {
      scroll(pos) {
        this.scrollY = pos.y
      }
    },
    components: {
      Scroll,
      SongList
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

    .title {
      position: absolute
      z-index: 40
      top: 0
      left: 10%
      width: 80%
      text-align: center
      no-wrap()
      line-height: 42px
      font-size: $font-size-large
      color: $color-text
    }

    .bg-image {
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      background-size: cover
      transform-origin: top

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
