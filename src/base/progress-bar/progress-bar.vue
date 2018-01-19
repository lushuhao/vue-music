<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn">
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
        if (newPercent >= 0) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = barWidth * newPercent
          this.$refs.progress.style.width = `${offsetWidth}px`
          this.$refs.progressBtn.style[transform] = `translateX(${offsetWidth}px)`
        }
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