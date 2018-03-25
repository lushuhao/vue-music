<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back">
        <i class="icon-back"></i>
      </div>
      <div class="tab-wrapper">
        <switches :switches="switches"
                 :currentIndex="currentIndex"
                 @selectItem="switchesItem"
        ></switches>
      </div>
      <div ref="playBtn" class="play-btn">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div ref="listWrapper" class="list-wrapper"></div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Switches from 'base/switches/switches'

  export default {
    data() {
      return {
        switches: [
          {
            name: '我喜欢的'
          },
          {
            name: '最近听到'
          }
        ],
        currentIndex: 0
      }
    },
    methods: {
      switchesItem(index) {
        this.currentIndex = index
      }
    },
    components: {
      Switches
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center {
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 100
    background: $color-background

    &.slide-enter-active, &.slide-leave-active {
      transition: all .3s
    }
    &.slide-enter, &.slide-leave-to {
      transform: translateX(100%)
    }

    .back {
      position: absolute
      top: 5px
      left: 5px
      z-index: 50
      .icon-back {
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
      }
    }

    .tab-wrapper{
      margin: 10px 0 30px
    }

    .play-btn{
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0

      .icon-play{
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      }

      .text{
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
      }
    }

    .list-wrapper{
      position: absolute
      top: 110px
      bottom: 0
      width: 100%

      .list-scroll{
        height: 100%
        overflow: hidden

        .list-inner{
          padding: 20px 30px
        }
      }
    }

    .no-result-wrapper{
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
    }
  }
</style>
