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
      <div ref="listWrapper" class="list-wrapper">
        <scroll ref="favoriteList"
                v-show="currentIndex === 0"
                :data="favoriteList"
                class="list-scroll">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="songList"
                v-show="currentIndex === 1 "
                :data="playHistory"
                class="list-scroll">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
          <div v-if="playHistory && !playHistory.length" class="no-result-wrapper">
            <no-result :title="noResult"></no-result>
          </div>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Switches from 'base/switches/switches'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import NoResult from 'base/no-result/no-result'
  import {mapState, mapActions} from 'vuex'

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
    computed: {
      ...mapState(['favoriteList', 'playHistory'])
    },
    methods: {
      ...mapActions(['insertSong']),
      switchesItem(index) {
        this.currentIndex = index
        this.initScroll()
      },
      initScroll() {
        this.$nextTick(() => {
          const scroll = this.currentIndex === 0 ? 'favoriteList' : 'songList'
          this.$refs[scroll].refresh()
        })
      },
      selectSong(song) {
        this.insertSong(song)
      }
    },
    components: {
      Switches,
      Scroll,
      SongList,
      NoResult
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

    .tab-wrapper {
      margin: 10px 0 30px
    }

    .play-btn {
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid $color-text-l
      color: $color-text-l
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

    .list-wrapper {
      position: absolute
      top: 110px
      bottom: 0
      width: 100%

      .list-scroll {
        height: 100%
        overflow: hidden

        .list-inner {
          padding: 20px 30px
        }
      }
    }

    .no-result-wrapper {
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
    }
  }
</style>
