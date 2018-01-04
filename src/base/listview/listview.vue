<template>
  <scroll class="listview"
          :data="data"
          ref="listView"
          :listenScroll="listenScroll"
          :probeType="probeType"
          @scroll="scroll">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar"/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" :key="item" class="item" :class="{current: currentIndex === index}"
            :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18 // font-size + padding * 2 = 12 + 3 * 2 = 18
  const TITLE_HEIGHT = 30 // 标题高度

  export default {
    props: {
      data: {
        type: Array
      }
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    created() {
      this.touch = {} // 变量放在data会被vue添加getter,setter。监听值的变化
      this.listenScroll = true
      this.probeType = 3
      this.listHeight = []
    },
    computed: {
      shortcutList() {
        return this.data.map(group => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) return ''
        let current = this.data[this.currentIndex]
        return current && current.title
      }
    },
    watch: {
      data() {
        this.$nextTick(() => {
          this._calculateHeight() // dom渲染是延时的，在nextTick完成
        })
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        // 滚动到顶部
        if (newY >= 0) {
          this.currentIndex = 0
          return
        }
        // 在中间滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (height1 <= -newY && height2 > -newY) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 滚动到底部，-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        const fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (fixedTop === this.fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translateY(${fixedTop}px)`
      }
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item)
      },
      onShortcutTouchStart(e) {
        let anchorIndex = parseInt(getData(e.target, 'index'))
        this.touch.y1 = e.touches[0].pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        this.touch.y2 = e.touches[0].pageY
        let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
        let anchorIndex = this.touch.anchorIndex + delta
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _scrollTo(anchorIndex) {
        if (isNaN(anchorIndex) || anchorIndex < 0 || anchorIndex > this.data.length - 1) {
          return
        }
        console.log(anchorIndex)
        this.$refs.listView.scrolltoElement(this.$refs.listGroup[anchorIndex])
        this.currentIndex = anchorIndex
      },
      _calculateHeight() {
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight = [0]
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      }
    },
    components: {
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview {
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background

    .list-group {
      padding-bottom: 30px

      &-title {
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      }

      &-item {
        display: flex
        align-items: center
        padding: 20px 0 0 30px

        .avatar {
          width: 50px
          height: 50px
          border-radius: 50%
        }

        .name {
          padding-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
        }
      }
    }

    .list-shortcut {
      position: absolute
      z-index: 30
      top: 50%
      right: 0
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica

      .item {
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small

        &.current {
          color: $color-theme
        }
      }
    }
    .list-fixed {
      position: absolute
      top: 0
      width: 100%
      .fixed-title {
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      }
    }
  }
</style>
