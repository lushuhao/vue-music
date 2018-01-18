<template>
  <div class="player" v-show="playList.length">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
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
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" ref="cd">
                <img ref="cdImage" :class="cdRotate" class="image" :src="currentSong.image"/>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="operators">
            <div class="icon"><i class="icon-sequence"></i></div>
            <div class="icon"><i class="icon-prev"></i></div>
            <div class="icon i-center"><i @click="togglePlaying" :class="playIcon"></i></div>
            <div class="icon"><i class="icon-next"></i></div>
            <div class="icon"><i class="icon-not-favorite"></i></div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <div class="imgWrapper" ref="miniCd">
            <img ref="miniCdImage" width="40" height="40" :src="currentSong.image" :class="cdRotate"/>
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i @click.stop="togglePlaying" :class="miniPlayIcon"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio @select="initPlaySong" ref="audio" :src="currentSong.url"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState, mapActions, mapMutations} from 'vuex'
  import * as types from 'store/mutation-types'
  import animations from 'create-keyframe-animation'
  import {perfixStyle, getStyle} from 'common/js/dom'

  const transform = perfixStyle('transform')
  //  const animationPlayState = perfixStyle('animationPlayState')

  export default {
    data() {
      return {
        cdStyle: '',
        angle: 0,
      }
    },
    computed: {
      ...mapState([
        'fullScreen',
        'playList',
        'currentSong',
        'playing'
      ]),
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniPlayIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdRotate() {
        return this.playing ? 'play' : ''
      }
    },
    watch: {
      currentSong(song) {
        if (!song.url) {
          return
        }
        this.$nextTick(() => {
          this.$refs.audio.play()
        })
      },
      playing(newPlaying) {
        const audio = this.$refs.audio
        if (!newPlaying) {
          this._calculateAndSaveAngle()
        } else {

        }
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    methods: {
      ...mapActions([
        'setSongUrl'
      ]),
      ...mapMutations({
        setFullScreen: types.SET_FULL_SCREEN,
        setPlayingState: types.SET_PLAYING_STATE
      }),
      back() {
        this.setFullScreen(false)
        this._calculateAndSaveAngle('back')
      },
      open() {
        this.setFullScreen(true)
        this._calculateAndSaveAngle('open')
      },
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale()

        const animation = {
          0: {
            transform: `translate(${x}px, ${y}px) scale(${scale})`
          },
          60: {
            transform: `translate(0, 0) scale(1.1)`
          },
          100: {
            transform: `translate(0, 0) scale(1)`
          }
        }

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })

        animations.runAnimation(this.$refs.cdWrapper, 'move', done) // 动画执行完成调用done
      },
      afterEnter(el) {
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = '' // 清空animation
      },
      leave(el, done) {
        const {x, y, scale} = this._getPosAndScale()

        this.$refs.cdWrapper.style.transition = 'all .4s'
        this.$refs.cdWrapper.style[transform] = `translate(${x}px, ${y}px) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave(el) {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },
      togglePlaying() {
        this.setPlayingState(!this.playing)
      },
      initPlaySong() {
        this.$refs.audio.play()
      },
      _getPosAndScale() {
        const targetWidth = 40 // mini播放器CD的宽度
        const paddingLeft = 40 // 中心点到屏幕左侧的距离
        const paddingBottom = 40 // 中心点到屏幕底部的距离
        const paddingTop = 80 // normal播放器CD到屏幕顶部的距离
        const width = window.innerWidth * 0.8 // normal播放器CD的宽度
        const scale = targetWidth / width // 两个播放器的缩放比例
        const x = -(window.innerWidth / 2 - paddingLeft) // 水平位移
        const y = window.innerHeight - paddingTop - paddingBottom - width / 2
        return {x, y, scale}
      },
      _calculateAndSaveAngle(status) {
        let cdStyle = getStyle(this.$refs.cdImage)[transform]
        let miniCdStyle = getStyle(this.$refs.miniCdImage)[transform]

        let cd = this.$refs.cd
        if (cdStyle === 'none') { // 判断当前是哪个播放器在显示
          cdStyle = miniCdStyle
          cd = this.$refs.miniCd
        }

        let cdTransform = getStyle(cd)[transform]

        let cdRotate = cdStyle === 'none'

        switch (status) {
          case 'back':
            cd = this.$refs.miniCd
            if (cdRotate) {
              cdStyle = this.$refs.cd.style[transform]
              cdTransform = 'none'
            }
            break
          case 'open':
            cd = this.$refs.cd
            if (cdRotate) {
              cdStyle = this.$refs.miniCd.style[transform]
              cdTransform = 'none'
            }
            break
        }

        cd.style[transform] = cdTransform === 'none'
          ? cdStyle
          : cdStyle.concat(' ', cdTransform)
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
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, .1)

                &.play {
                  animation: rotate 20s linear infinite
                }
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

      &.normal-enter-active, &.normal-leave-active {
        transition: all .4s

        .top, .bottom {
          transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
        }
      }

      &.normal-enter, &.normal-leave-to {
        opacity: 0

        .top {
          transform: translateY(-100px)
        }
        .bottom {
          transform: translateY(100px)
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

        .imgWrapper {
          width: 40px
          height: 40px
          border-radius: 50%

          img {
            border-radius: 50%

            &.play {
              animation: rotate 20s linear infinite
            }
          }
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
        .icon-mini {
          font-size: 32px
          position: absolute
          left: 0
          top: 0
        }
      }

      &.mini-enter-active, &.mini-leave-active {
        transition: all .4s
      }
      &.mini-enter, &.mini-leave-to {
        opacity: 0
      }
    }

    @keyframes rotate {
      0% {
        transform: rotate(0)
      }
      100% {
        transform: rotate(360deg)
      }
    }
  }
</style>
