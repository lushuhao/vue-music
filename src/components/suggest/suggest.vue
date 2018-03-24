<template>
  <scroll class="suggest"
          :data="result"
          :pullUp="true"
          :beforeScroll="true"
          :hasLoading="false"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
          ref="suggest"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item.type)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore && result.length" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result :title="noResult"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'
  import NoResult from 'base/no-result/no-result'

  const TYPE_SINGER = 'singer'
  const PER_PAGE = 20

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        page: 1,
        result: [],
        hasMore: true,
        noResult: '抱歉，暂无搜索结果'
      }
    },
    watch: {
      query() {
        this.search()
      }
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions(['insertSong']),
      refresh() {
        this.$refs.suggest.refresh()
      },
      search() {
        this.hasMore = true
        this.page = 1
        this.$refs.suggest.scrollto(0, 0)
        this._search(true)
      },
      getIconCls(type) {
        if (type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        this._search(false)
      },
      selectItem(item) {
        if (item.type === 'singer') {
          const singer = new Singer({
            id: item.singerid,
            mid: item.singermid,
            name: item.singername
          })
          this.setSinger(singer)
          this.$router.push({
            path: `/search/${singer.id}`
          })
        } else {
          this.insertSong(item)
        }
        this.$emit('select', item)
      },
      listScroll() {
        this.$emit('listScroll')
      },
      _search(first) {
        search(this.query, this.page, this.showSinger, PER_PAGE).then(res => {
          if (first) {
            this.result = this._genResult(res, first)
          } else {
            this.result.push(...this._genResult(res, first))
          }
          this._checkMore(res)
        })
      },
      _checkMore(data) {
        const {list, curnum, curpage, totalnum} = data.song
        if (!list.length || (curnum + curpage * PER_PAGE) > totalnum) {
          this.hasMore = false
        }
      },
      _genResult(data, first) {
        let ret = []
        if (data.zhida && data.zhida.singerid && first) {
          ret.push({
            ...data.zhida,
            type: TYPE_SINGER
          })
        }
        if (data.song && data.song.list.length) {
          ret = [...ret, ...this._normalizeSongs(data.song.list)]
        }
        return ret
      },
      _normalizeSongs(list) {
        return list.map(musicData => {
          if (musicData.songid && musicData.albummid) {
            return createSong(musicData)
          }
        })
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest {
    height: 100%
    overflow: hidden

    &-list {
      padding: 0 30px

      .suggest-item {
        display: flex
        align-items: center
        padding-bottom: 20px

        .icon {
          flex: 0 0 30px
          width: 30px

          [class^='icon-'] {
            font-size: 14px
            color: $color-text-d
          }
        }

        .name {
          flex: 1
          font-size: $font-size-medium
          color: $color-text-d
          overflow: hidden

          .text {
            no-wrap()
          }
        }
      }
    }

    .no-result-wrapper{
      position: absolute
      top: 40%
      width: 100%
      transform: translateY(-50%)
    }
  }
</style>
