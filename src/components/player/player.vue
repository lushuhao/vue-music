<template>
  <div class="player" v-show="playList.length">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.image" width="100%" height="100%"/>
      </div>
      <div class="top">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="currentSong.name"></h1>
        <h2 class="subTitle" v-html="currentSong.singer"></h2>
      </div>
      <div class="middle">
        <div class="middle-l">
          <div class="cd-wrapper">
            <div class="cd">
              <img class="image" :src="currentSong.image"/>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="operators">
          <div class="icon"><i class="icon-sequence"></i></div>
          <div class="icon"><i class="icon-prev"></i></div>
          <div class="icon i-center"><i class="icon-play"></i></div>
          <div class="icon"><i class="icon-next"></i></div>
          <div class="icon"><i class="icon-not-favorite"></i></div>
        </div>
      </div>
    </div>
    <div class="mini-player" v-show="!fullScreen" @click="open">
      <div class="icon">
        <img width="40" height="40" :src="currentSong.image"/>
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name"></h2>
        <p class="desc" v-html="currentSong.singer"></p>
      </div>
      <div class="control"></div>
      <div class="control">
        <i class="icon-playlist"></i>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState, mapGetters, mapMutations} from 'vuex'
  import * as types from '../../store/mutation-types.js'

  export default {
    computed: {
      ...mapState([
        'fullScreen',
        'playList'
      ]),
      ...mapGetters(['currentSong'])
    },
    methods: {
      ...mapMutations({
        setFullScreen: types.SET_FULL_SCREEN
      }),
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .player {

    .normal-player {
      position: fixed
      top: 0
      bottom: 0
      left: 0
      right: 0
      z-index: 150
      background-color: $color-background

      .background {
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      }

      .top {
        position: relative
        margin-bottom: 25px

        .back {
          position: absolute
          top: 0
          left: 6px
          z-index: 50

          .icon-back {
            display: block
            padding: 9px
            font-size: $font-size-large-x
            transform: rotate(-90deg)
          }
        }

        .title {
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        }
        .subTitle {
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
        }
      }

      .middle {
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px

        .middle-l {
          position: relative
          width: 100%
          height: 0
          padding-top: 80%

          .cd-wrapper {
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            box-sizing: border-box

            .cd {
              width: 100%
              height: 100%
              border-radius: 50%

              .image {
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, .1)
              }
            }
          }
        }
      }

      .bottom {
        position: absolute
        bottom: 50px
        width: 100%

        .operators {
          display: flex
          align-items: center
          padding: 0 20px

          .icon {
            flex: 1
            text-align: center
            i {
              font-size: 30px
            }
          }
          .i-center {
            i {
              font-size 40px
            }
          }
        }
      }

    }

    .mini-player {
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background

      .icon {
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px

        img {
          border-radius: 50%
        }
      }

      .text {
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden

        .name {
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        }

        .desc {
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
        }
      }

      .control {
        flex: 0 0 30px
        width: 30px
        padding: 0 10px

        .icon-play-mini, .icon-pause-mini, .icon-playlist {
          font-size: 30px
          color: $color-theme-d
        }
        .icon-mini{
          font-size: 32px
          position: absolute
          left: 0
          top: 0
        }
      }
    }
  }
</style>
