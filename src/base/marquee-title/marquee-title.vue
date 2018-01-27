<template>
  <div class="marquee-title" ref="marqueeTitle">
    <h1 v-for="item in titleList" class="title" :class="activeTitle" ref="title" v-html="item"></h1>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        animation: false,
        titleList: []
      }
    },
    computed: {
      activeTitle() {
        return this.animation ? 'slide' : ''
      }
    },
    created() {
      this.initTitleList()
    },
    mounted() {
      this.slideTitle()
    },
    watch: {
      title() {
        this.initTitleList()
        setTimeout(() => {
          this.slideTitle()
        }, 2000)
      }
    },
    methods: {
      initTitleList() {
        this.titleList = [this.title]
        this.animation = false
      },
      slideTitle() {
        if (!this.titleList.length) {
          return
        }
        let wrapperWidth = this.$refs.marqueeTitle.clientWidth
        let titleWidth = this.$refs.title[0].clientWidth
        if (wrapperWidth < titleWidth) {
          this.titleList.push(this.title)
          this.animation = true
        } else {
          this.initTitleList()
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  @keyframes slide {
    0% {
      transform: translateX(0)
    }
    100% {
      transform: translateX(-100%)
    }
  }

  .marquee-title {
    position: absolute
    z-index: 40
    top: 0
    left: 10%
    width: 80%
    height: 42px
    overflow: hidden
    white-space: nowrap
    font-size: 0
    text-align: center

    .title {
      display: inline-block
      text-align: center
      line-height: 42px
      white-space: nowrap
      font-size: $font-size-large
      color: $color-text

      &.slide{
        padding-right: 30px
        animation: slide 10s linear infinite
      }
    }
  }
</style>
