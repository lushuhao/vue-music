<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>

      </slot>
    </div>
    <div class="dots">

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
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
        children: ''
      }
    },
    mounted() { // better-scroll需要在DOM构建完成初始化
      setTimeout(() => {
        this._setSliderWidth()
        this._initSlider()
      }, 20) // 浏览器刷新是60FPS, 1000/60 = 17ms, 才会进行下一次渲染
    },
    methods: {
      _setSliderWidth() {
        this.children = this.$refs.sliderGroup.children // children 获取 VNode 子节点的数组

        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth // 父元素被图片撑开的宽度
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')

          child.style.width = sliderWidth + 'px'
          width += sliderWidth

          if (this.loop) {
            width += 2 * sliderWidth // 左右各生成一个img, 宽度需要加2个
          }
          this.$refs.sliderGroup.style.width = width + 'px '
        }
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, { // BScroll(el, options)
          scrollX: true,
          momentum: false, // 惯性
          snap: { // 配合slide
            loop: this.loop,
            threshold: 0.3, // 拖动到30%时，展示下一个
            speed: 400
          },
          click: true  // 默认会阻止浏览器的原生 click 事件
        })
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
  }

</style>
