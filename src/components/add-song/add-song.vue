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
        <search-box ref="searchBox" placeholder="搜索歌曲" @query="onQueryChange"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <tab-bar :tabs="tabs"
                 :currentIndex="currentIndex"
                 @selectItem="tabChange">
        </tab-bar>
        <div class="list-wrapper">
          <scroll ref="songList"
                  v-show="currentIndex === 0"
                  :data="playHistory"
                  class="list-scroll">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll ref="searchList"
                  v-show="currentIndex === 1 "
                  :data="searchHistory"
                  :hasLoading="false"
                  class="list-scroll">
            <div class="list-inner">
              <search-list :searches="searchHistory"
                           @select="addQuery"
                           @delete="deleteSearchHistory"></search-list>
            </div>
            <div v-if="searchHistory && !searchHistory.length" class="no-result-wrapper">
              <no-result :title="noResult"></no-result>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest :query="query"
                 :showSinger="false"
                 @listScroll="blurInput"
                 @select="selectSuggest"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">《{{topTipTitle}}》已添加到播放队列</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import TabBar from 'base/tab-bar/tab-bar'
  import SearchBox from 'base/search-box/search-box'
  import SearchList from 'base/search-list/search-list'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import Suggest from 'components/suggest/suggest'
  import NoResult from 'base/no-result/no-result'
  import TopTip from 'base/top-tip/top-tip'
  import {mapState, mapActions} from 'vuex'
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
        ],
        noResult: '暂无搜索历史记录',
        topTipTitle: ''
      }
    },
    computed: {
      ...mapState(['playHistory'])
    },
    methods: {
      ...mapActions(['insertSong']),
      show() {
        this.showFlag = true
        this.initScroll()
      },
      hide() {
        this.showFlag = false
      },
      tabChange(index) {
        this.currentIndex = index
        this.initScroll()
      },
      initScroll() {
        this.$nextTick(() => {
          const scroll = this.currentIndex === 0 ? 'songList' : 'searchList'
          this.$refs[scroll].refresh()
        })
      },
      selectSuggest(song) {
        this.saveSearch()
        this.showTip(song)
        this.addSongToList(song)
      },
      selectSong(song, index) {
        if (index !== 0) {
          this.addSongToList(song)
          this.showTip(song)
          this.insertSong(song)
        }
      },
      addSongToList(song) {
        this.$emit('addSongToList', song)
      },
      showTip(song) {
        this.topTipTitle = song.name
        this.$refs.topTip.show()
      }
    },
    components: {
      TabBar,
      SearchBox,
      SearchList,
      Scroll,
      SongList,
      Suggest,
      NoResult,
      TopTip
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

      .list-wrapper {
        position: absolute
        top: 165px
        bottom: 0
        width: 100%

        .list-scroll {
          height: 100%
          overflow: hidden

          .list-inner {
            padding: 20px 30px
          }
        }

        .no-result-wrapper {
          position: absolute
          top: 40%
          width: 100%
          transform: translateY(-50%)
        }
      }
    }

    .search-result {
      position: fixed
      top: 124px
      bottom: 0
      left: 0
      right: 0
    }

    .tip-title{
      text-align: center
      padding: 18px 0
      font-size: 0

      .icon-ok{
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      }

      .text{
        font-size: $font-size-medium
        color: $color-text
      }
    }
  }
</style>
