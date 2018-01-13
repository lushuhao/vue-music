<template>
  <div class="player" v-show="playList.length">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img src="" alt="" width="100%" height="100%"/>
      </div>
      <div class="top">
        <div class="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title"></h1>
        <h2 class="subTitle"></h2>
      </div>
      <div class="middle">
        <div class="middle-l">
          <div class="cd-wrapper">
            <div class="cd">
              <img class="image" src="" alt=""/>
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
    <div class="mini-player" v-show="!fullScreen">
      <div class="icon">
        <img width="40" height="40" src="" alt="">
      </div>
      <div class="text">
        <h2 class="name"></h2>
        <p class="desc"></p>
      </div>
      <div class="control"></div>
      <div class="control">
        <i class="icon-playlist"></i>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState} from 'vuex'

  export default {
    computed: {
      ...mapState([
        'fullScreen',
        'playList'
      ])
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

            .cd {
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, .1)
              border-radius: 50%

              .image{
                position: absolute
                top: 0
                left: 0
                width: 100%
                height: 100%
                border-radius: 50%
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
  }
</style>
