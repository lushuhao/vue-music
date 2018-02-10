<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="addQuery(item.k)" class="item" v-for="item in hotKey">{{item.k}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query" @listScroll="blurInput" @select="saveSearch"></suggest>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import {getHotKey} from 'api/search'
  import Suggest from 'components/suggest/suggest'
  import {mapState, mapActions} from 'vuex'
  import * as types from 'store/mutation-types'

  export default {
    data() {
      return {
        hotKey: [],
        query: ''
      }
    },
    computed: {
      ...mapState(['searchHistory'])
    },
    created() {
      this._getHotKey()
    },
    methods: {
      ...mapActions(['saveSearchHistory']),
      addQuery(query) {
        this.$refs.searchBox.setQuery(query)
      },
      onQueryChange(query) {
        this.query = query
      },
      blurInput() {
        this.$refs.searchBox.blur()
      },
      saveSearch() {
        this.saveSearchHistory(this.query)
      },
      _getHotKey() {
        getHotKey().then(res => {
          this.hotKey = res.hotkey.slice(0, 10)
        })
      },
    },
    components: {
      SearchBox,
      Suggest
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

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
    }

    .search-result {
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
    }
  }
</style>
