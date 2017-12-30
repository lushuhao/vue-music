<template>
  <scroll class="listview" :data="data" ref="listView">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar"/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" :key="item" class="item" :data-index="index">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18 // font-size + padding * 2 = 12 + 3 * 2 = 18

  export default {
    props: {
      data: {
        type: Array
      }
    },
    created() {
      this.touch = {} // 变量放在data会被vue添加getter,setter。监听值的变化
    },
    computed: {
      shortcutList() {
        return this.data.map(group => {
          return group.title.substr(0, 1)
        })
      }
    },
    methods: {
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
      _scrollTo(anchorIndex) {
        this.$refs.listView.scrolltoElement(this.$refs.listGroup[anchorIndex])
      }
    },
    components: {
      Scroll
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
      }
    }
  }
</style>
