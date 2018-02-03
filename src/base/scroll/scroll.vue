<template>
  <div ref="wrapper">
    <slot></slot>
    <div class="loading-container" v-show="hasLoading && data && !data.length">
      <loading></loading>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Loading from 'base/loading/loading'
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array
      },
      listenScroll: {
        type: Boolean,
        default: false
      },
      pullUp: {
        type: Boolean,
        default: false
      },
      hasLoading: {
        type: Boolean,
        default: true
      }
    },
    mounted() {
      requestAnimationFrame(() => {
        this._initScroll()
      })
    },
    watch: {
      data() {
        requestAnimationFrame(() => {
          this.refresh()
        })
      }
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })

        if (this.listenScroll) {
          const vue = this // 保存this指向vue
          this.scroll.on('scroll', pos => {
            vue.$emit('scroll', pos)
          })
        }

        if (this.pullUp) {
          this.scroll.on('scrollEnd', () => { // 滚动结束触发一次
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollto() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrolltoElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    components: {
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .loading-container {
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
  }

</style>
