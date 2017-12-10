<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span v-for="(item, index) in dots" class="dot" :class="{active: index === currentPage}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    name: 'slider',
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    data() {
      return {
        children: '', // 父组件插入的VNode
        slider: '', // better-scroll生成的对象
        dots: [],
        currentPage: 0,
        timer: '' // 定时器编号
      }
    },
    mounted() { // better-scroll需要在DOM构建完成初始化
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()

        this.autoPlay && this._play()
      }, 20) // 浏览器刷新是60FPS, 1000/60 = 17ms, 才会进行下一次渲染

      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSliderWidth(true)
      })
    },
    activated() {
      this.autoPlay && this._play()
    },
    deactivated() { // 切换路由清除定时器
      clearTimeout(this.timer)
    },
    destroyed() { // 销毁组件清除定时器
      clearTimeout(this.timer)
    },
    methods: {
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children // children 获取 VNode 子节点的数组

        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth // 父元素被图片撑开的宽度
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')

          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) {
          width += 2 * sliderWidth // 左右各生成一个img, 宽度需要加2个，注意只需要加一次，后续不能再加宽度
        }
        this.$refs.sliderGroup.style.width = width + 'px '
      },
      _initDots() {
        // 生成一个空数组，长度和this.children一致，要注意better-scroll前后各复制一份
        this.dots = new Array(this.children.length)
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, { // BScroll(el, options)
          scrollX: true,
          momentum: false, // 惯性
          snap: { // 配合slide
            loop: this.loop,
            threshold: 0.3, // 拖动到30%时，展示下一个
            speed: 400
          }
        })

        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX // 滚动结束，获取当前页面横轴方向的页面数
          this.loop && pageIndex--      // 循环滚动需要减去BScroll增加的一个dom
          this.currentPage = pageIndex

          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _play() {
        let pageIndex = this.currentPage + 1  // goToPage从1开始计数，需要加1
        this.loop && pageIndex++              // 循环播放跳转下一页
        this.timer = setTimeout(() => {       // 返回定时器编号
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider {
    min-height: 1px // 设置一个最小高度、padding或者border，子元素为空时，以防止宽度塌陷

    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap

      .slider-item {
        float: left
        box-sizing: border-box
        overflow: hidden;
        text-align: center
        a {
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        }
        img {
          display: block
          width: 100%
        }
      }
    }

    .dots {
      position: absolute;
      left: 0
      right: 0
      bottom: 12px
      text-align: center

      .dot {
        display: inline-block
        width: 8px
        height: 8px
        margin: 0 4px
        border-radius: 50%
        background-color: $color-text-l

        &.active {
          width: 20px
          border-radius: 4px
          background-color: $color-text-ll
        }
      }
    }
  }

</style>
