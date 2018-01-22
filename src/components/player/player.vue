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
        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" ref="cd">
                <img ref="cdImage" :class="cdRotate" class="image" :src="currentSong.image"/>
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine" class="text"
                   :class="{'current': currentLineNum === index}"
                   v-for="(line, index) in currentLyric.lines">
                  {{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <div class="dot" :class="{'active': currentDotShow === 'cd'}"></div>
            <div class="dot" :class="{'active': currentDotShow === 'lyric'}"></div>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{currentTime | date}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{currentSong.duration | date}}</span>
          </div>
          <div class="operators">
            <div class="icon" @click="changeMode"><i :class="iconMode"></i></div>
            <div class="icon" :class="disableCls"><i @click="prev" class="icon-prev"></i></div>
            <div class="icon i-center" :class="disableCls"><i @click="togglePlaying"
                                                              :class="playIcon"></i></div>
            <div class="icon" :class="disableCls"><i @click="next" class="icon-next"></i></div>
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
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniPlayIcon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio ref="audio"
           :src="currentSong.url"
           @canplay="ready"
           @error="error"
           @timeupdate="updateTime"
           @ended="end"
    >
    </audio>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState, mapActions, mapMutations} from 'vuex'
  import * as types from 'store/mutation-types'
  import animations from 'create-keyframe-animation'
  import {perfixStyle, getStyle} from 'common/js/dom'
  import {pad, shuffle} from 'common/js/util'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {playMode} from 'common/js/config'
  import {Toast} from 'mint-ui'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll'

  const transform = perfixStyle('transform')
  const transitionDuration = perfixStyle('transitionDuration')
  const lyricLineHeight = 32 // 歌词单行高度

  export default {
    data() {
      return {
        cdStyle: '',
        angle: 0,
        songReady: false,
        currentTime: 0,
        radius: 32,
        currentLyric: null,
        currentLineNum: 0,
        currentDotShow: 'cd',
        playingLyric: ''
      }
    },
    computed: {
      ...mapState([
        'fullScreen',
        'playList',
        'currentSong',
        'playing',
        'currentIndex',
        'playMode',
        'sequenceList'
      ]),
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniPlayIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      cdRotate() {
        return this.playing ? 'play' : ''
      },
      disableCls() {
        return this.songReady ? '' : 'disable'
      },
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      iconMode() {
        let mode
        switch (this.playMode) {
          case playMode.sequence:
            mode = 'icon-sequence'
            break
          case playMode.loop:
            mode = 'icon-loop'
            break
          case playMode.random:
            mode = 'icon-random'
            break
        }
        return mode
      },
      isPlayLoop() {
        return this.playMode === playMode.loop
      },
    },
    watch: {
      currentSong(song) {
        if (!song.url) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        this.setLyric()
        this.$nextTick(() => {
          this.$refs.audio.play()
        })
      },
      playing(newPlaying) {
        const audio = this.$refs.audio
        if (!newPlaying) {
          this._calculateAndSaveAngle()
        }
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      },
    },
    filters: {
      date(interval) {
        interval = Math.floor(interval)
        const minute = Math.floor(interval / 60)
        const second = Math.floor(interval % 60)
        return `${minute}:${pad(second)}`
      }
    },
    created() {
      this.touch = {}
    },
    mounted() {
      window.bus.$once('audioPlay', () => {
        this.$refs.audio.play()
      })
      this.lyricEl = this.$refs.lyricList.$el
    },
    methods: {
      ...mapActions([
        'setCurrentSong'
      ]),
      ...mapMutations({
        setFullScreen: types.SET_FULL_SCREEN,
        setPlayingState: types.SET_PLAYING_STATE,
        setCurrentIndex: types.SET_CURRENT_INDEX,
        setPlayMode: types.SET_PLAY_MODE,
        setPlayList: types.SET_PLAY_LIST,
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
        if (this.currentSong.url && this.currentSong.url.code === 0) {
          return Toast(this.currentSong.url.msg)
        }
        this.setPlayingState(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      end() {
        if (this.playMode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      prev() {
        if (!this.songReady) {
          return
        }
        if (this.playList.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playList.length - 1  // 最后一首歌循环到第一首
          }
          this.currentTime = 0
          this.setCurrentIndex(index)
          this.setCurrentSong()
          this.songReady = false
        }
      },
      next() {
        if (!this.songReady) {
          return
        }
        if (this.playList.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex + 1
          if (index === this.playList.length) {
            index = 0  // 最后一首歌循环到第一首
          }
          this.currentTime = 0
          this.setCurrentIndex(index)
          this.setCurrentSong()
          this.songReady = false
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      ready() {
        this.songReady = true // 防止用户快速点击，加载好一首再点击下一首
      },
      error() {
        this.songReady = true // 出现错误，不执行ready，需要置为true，才能播放下首
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime
      },
      onProgressBarChange(percent) { // 拖动点击进度回调修改百分比
        const currentTime = this.currentSong.duration * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      changeMode() {
        const mode = (this.playMode + 1) % 3 // 获取下一种模式
        this.setPlayMode(mode)
        let list = []
        switch (mode) {
          case playMode.random:
            list = shuffle(this.sequenceList)
            break
          case playMode.sequence:
            list = this.sequenceList
            break
          case playMode.loop: // 单曲循环不用改变播放列表
            return
        }
        this.resetCurrentIndex(list)
        this.setPlayList(list)
      },
      resetCurrentIndex(list) {
        let index = list.findIndex(item => {
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
      setLyric() {
        if (this.currentSong.lyric === 'no lyric') {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
          return
        }
        this.currentLyric = new Lyric(this.currentSong.lyric, this.handleLyric)
        this.lyricMiddleLine = Math.floor(this.lyricEl.clientHeight / lyricLineHeight / 2)
        if (this.playing) {
          this.currentLyric.play()
        }
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (this.lyricMiddleLine < lineNum) {
          let lineEl = this.$refs.lyricLine[lineNum - this.lyricMiddleLine]
          this.$refs.lyricList.scrolltoElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollto(0, 0, 1000)
        }
        this.playingLyric = txt
      },
      middleTouchStart(e) {
        this.touch.initiated = true // 标志开始触摸
        const touch = e.touches[0]
        this.touch.startX = touch.pageX // 触摸点横向坐标
        this.touch.startY = touch.pageY // 记录纵向坐标，因为歌词可以上下滚动
      },
      middleTouchMove(e) {
        if (!this.touch.initiated) { // 没有进入start事件
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) { // 可以认为这是纵向滚动
          return
        }
        const left = this.currentDotShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX)) // 歌词距离屏幕左侧的距离
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        const opacity = 1 - this.touch.percent
        this._lyricDomOperate(offsetWidth, 0, opacity)
      },
      middleTouchEnd(e) {
        this.touch.initiated = false
        let offsetWidth
        let opacity
        if (this.currentDotShow === 'cd') {
          if (this.touch.percent > 0.2) { // 向左滑动20%
            offsetWidth = -window.innerWidth
            this.currentDotShow = 'lyric'
            opacity = 0
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.8) { // 向右滑动20%，距离屏幕左侧80%
            offsetWidth = 0
            opacity = 1
            this.currentDotShow = 'cd'
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        this._lyricDomOperate(offsetWidth, 300, opacity)
      },
      _lyricDomOperate(offsetWidth, duration, opacity) {
        this.lyricEl.style[transitionDuration] = `${duration}ms`
        this.lyricEl.style[transform] = `translateX(${offsetWidth}px)`
        this.$refs.middleL.style.opacity = `${opacity}`
        this.$refs.middleL.style[transitionDuration] = `${duration}ms`
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
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll
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
        white-space: nowrap

        .middle-l {
          position: relative
          display: inline-block
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

          .playing-lyric-wrapper{
            width: 80%
            margin: 30px auto
            overflow: hidden
            text-align: center

            .playing-lyric{
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
            }
          }
        }

        .middle-r {
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden

          .lyric-wrapper {
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center

            .text{
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium

              &.current{
                color: $color-text
              }
            }
          }
        }
      }

      .bottom {
        position: absolute
        bottom: 50px
        width: 100%

        .dot-wrapper {
          text-align: center
          font-size: 0

          .dot{
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background-color: $color-text-l

            &.active{
              width: 20px
              border-radius: 5px
              background: $color-text-ll
            }
          }
        }

        .progress-wrapper {
          display: flex
          align-items: center
          margin: 0 auto
          width: 80%
          padding: 10px 0

          .time {
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px

            &.time-l {
              text-align: left
            }

            &.time-r {
              text-align: right
            }
          }

          .progress-bar-wrapper {
            flex: 1
          }
        }

        .operators {
          display: flex
          align-items: center
          padding: 0 20px

          .icon {
            flex: 1
            text-align: center

            &.disable {
              color: $color-theme-d
            }

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
