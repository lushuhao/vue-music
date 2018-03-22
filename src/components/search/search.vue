<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query" ref="shortcut">
      <scroll class="shortcut" :data="shortcut" ref="scroll">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKey">{{item.k}}</li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">

            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="result">
      <suggest ref="suggest" :query="query" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getHotKey} from 'api/search'
  import {mapActions} from 'vuex'
  import SearchBox from 'base/search-box/search-box'
  import SearchList from 'base/search-list/search-list'
  import Confirm from 'base/confirm/confirm'
  import Scroll from 'base/scroll/scroll'
  import Suggest from 'components/suggest/suggest'
  import {playListMixin, searchMixin} from 'common/js/mixin'

  export default {
    mixins: [playListMixin, searchMixin],
    data() {
      return {
        hotKey: [],
        query: ''
      }
    },
    computed: {
      shortcut() {
        return [...this.hotKey, ...this.searchHistory]
      }
    },
    created() {
      this._getHotKey()
    },
    watch: {
      query(newQuery) {
        if (!newQuery) { // 极限情况，刚好不能滚动，搜索添加一首歌就能滚动，重新计算
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
          })
        }
      }
    },
    methods: {
      ...mapActions(['clearSearchHistory']),
      handlePlayList(playlist) {
        this.changeScrollList(playlist, this.$refs.shortcut, this.$refs.scroll)
        this.changeScrollList(playlist, this.$refs.result, this.$refs.suggest)
      },
      showConfirm() {
        this.$refs.confirm.show()
      },
      _getHotKey() {
        getHotKey().then(res => {
          this.hotKey = res.hotkey.slice(0, 10)
        })
      },
    },
    components: {
      SearchList,
      Confirm,
      Scroll,
      SearchBox,
      Suggest
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search {

    .search-box-wrapper {
      margin: 20px
    }

    .shortcut-wrapper {
      position: fixed
      top: 178px
      bottom: 0
      width: 100%

      .shortcut {
        height: 100%
        overflow: hidden

        .hot-key {
          margin: 0 20px 20px 20px

          .title {
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          }

          .item {
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
          }
        }
      }

      .search-history {
        position: relative
        margin: 0 20px
        .title {
          display: flex
          align-items: center
          justify-content: space-between
          height: 40px
          font-size: $font-size-medium
          color: $color-text-l

          .text {
            flex: 1
          }
          .clear {
            position: relative
            extend-click()

            .icon-clear {
              color: $color-text-d
            }
          }
        }
      }
    }

    .search-result {
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
    }
  }
</style>
