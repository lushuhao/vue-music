<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <header class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </header>
      <div class="search-box-wrapper">
        <search-box placeholder="搜索歌曲" @query="onQueryChange"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <tab-bar :tabs="tabs"
                 :currentIndex="currentIndex"
                 @selectItem="tabChange">
        </tab-bar>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query"
                 :showSinger="false"
                 @listScroll="blurInput"
                 @select="saveSearch"></suggest>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import TabBar from 'base/tab-bar/tab-bar'
  import {searchMixin} from 'common/js/mixin'

  export default {
    mixins: [searchMixin],
    data() {
      return {
        showFlag: false,
        currentIndex: 0,
        tabs: [
          {name: '最近播放'},
          {name: '搜索历史'}
        ]
      }
    },
    methods: {
      show() {
        this.showFlag = true
      },
      hide() {
        this.showFlag = false
      },
      tabChange(index) {
        this.currentIndex = index
      }
    },
    components: {
      TabBar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song {
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 200
    background-color: $color-background

    &.slide-enter-active, &.slide-leave-active {
      transition: all .3s
    }

    &.slide-enter, &.slide-leave-to {
      transform: translateX(100%)
    }

    .header {
      position: relative
      height: 44px
      text-align: center

      .title {
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      }

      .close {
        position: absolute
        right: 12px
        top: 0

        .icon-close {
          display: block;
          padding: 12px;
          font-size: $font-size-large-x
          color: $color-theme
        }
      }
    }

    .search-box-wrapper {
      margin: 20px
    }

    .shortcut {

    }

    .search-result {
      position: fixed
      top: 124px
      bottom: 0
      left: 0
      right: 0
    }
  }
</style>
