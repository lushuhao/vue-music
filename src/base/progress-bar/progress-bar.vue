<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
           ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {perfixStyle} from 'common/js/dom'

  const progressBtnWidth = 16 // 进度条按钮的宽度
  const transform = perfixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    watch: {
      percent(newPercent) {
        if (newPercent >= 0 && !this.touch.initiated) { // 不在拖动中
          const offsetWidth = this._barWidth() * newPercent
          this._offset(offsetWidth)
        }
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      progressTouchStart(e) {
        this.touch.initiated = true // 标志开始触摸
        this.touch.startX = e.touches[0].pageX // 触摸点横向坐标
        this.touch.left = this._progressWidth() // 当前触摸点距离初始位置的距离 = 当前 进度条的长度
      },
      progressTouchMove(e) {
        if (!this.touch.initiated) { // 没有进入start事件
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this._barWidth(), Math.max(0, this.touch.left + deltaX)) // 当前进度条偏移量，不小于0，不大于bar的宽度
        this._offset(offsetWidth)
      },
      progressTouchEnd(e) {
        this.touch.initiated = false
        this._triggerPercent()
      },
      progressClick(e) {
        this._offset(e.offsetX)
        this._triggerPercent()
      },
      _triggerPercent() {
        const percent = this._progressWidth() / this._barWidth()
        this.$emit('percentChange', percent)
      },
      _offset(width) {
        this.$refs.progress.style.width = `${width}px`
        this.$refs.progressBtn.style[transform] = `translateX(${width}px)`
      },
      _barWidth() {
        return this.$refs.progressBar.clientWidth - progressBtnWidth // 进度条实际能走的宽度
      },
      _progressWidth() {
        return this.$refs.progress.clientWidth // 进度条当前的宽度
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar {
    height: 30px

    .bar-inner {
      position: relative
      top: 13px
      height: 4px
      border-radius: 2px
      background: rgba(0, 0, 0, .3)

      .progress {
        position: absolute
        height: 100%
        border-radius: 2px 0 0 2px
        background: $color-theme
      }

      .progress-btn-wrapper {
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px

        .progress-btn {
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
        }
      }
    }
  }
</style>
