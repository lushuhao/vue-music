<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle">
      <div class="filter"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
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
    computed: {
      bgStyle() {
        return `background-image: url(${this.bgImage})`
      }
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

    .back{
      position: absolute
      z-index: 50
      top: 0
      left: 6px
      .icon-back{
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
      }
    }

    .title{
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

    .bg-image{
      position: relative
      width:100%
      height:0
      padding-top:70%
      background-size: cover
    }
  }
</style>
