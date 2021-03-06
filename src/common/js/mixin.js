import {mapState, mapMutations, mapActions} from 'vuex'
import * as types from 'store/mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playListMixin = {
  data() {
    return {
      playBottom: '60px'
    }
  },
  computed: {
    ...mapState(['playList'])
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList() { // mixin混合，同名的被组件的覆盖
      throw new Error('component must implement handlePlayList method')
    },
    changeScrollList(playList, list, scroll) {
      list.style.bottom = playList.length > 0 ? this.playBottom : 0
      scroll.refresh()
    },
  }
}

export const playerMixin = {
  computed: {
    ...mapState(['sequenceList', 'currentSong', 'playMode', 'playList', 'favoriteList']),
    iconMode() {
      let mode
      switch (this.playMode) {
        case playMode.sequence:
          mode = 'icon-sequence'
          break
        case playMode.loop:
          mode = 'icon-loop'
          break
        case playMode.random:
          mode = 'icon-random'
          break
      }
      return mode
    },
  },
  methods: {
    ...mapMutations({
      setCurrentIndex: types.SET_CURRENT_INDEX,
      setPlayMode: types.SET_PLAY_MODE,
      setPlayList: types.SET_PLAY_LIST,
    }),
    ...mapActions([
      'setCurrentSong',
      'saveFavoriteList',
      'deleteFavoriteList'
    ]),
    changeMode() {
      const mode = (this.playMode + 1) % 3 // 获取下一种模式
      this.setPlayMode(mode)
      let list = []
      switch (mode) {
        case playMode.random:
          list = shuffle(this.sequenceList)
          break
        case playMode.sequence:
          list = this.sequenceList
          break
        case playMode.loop: // 单曲循环不用改变播放列表
          return
      }
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      } else {
        return 'icon-not-favorite'
      }
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex(item => {
        return item.id === song.id
      })
      return index > -1
    }
  }
}

export const searchMixin = {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    ...mapState(['searchHistory']),
  },
  methods: {
    ...mapActions(['saveSearchHistory', 'deleteSearchHistory']),
    onQueryChange(query) {
      this.query = query
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    blurInput() {
      this.$refs.searchBox.blur()
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
  }
}

/**
 * 预渲染
 * @type {{mounted: (function())}}
 */
export const prRenderMixin = {
  mounted() {
    document.dispatchEvent(new Event('sketelon-render-event'))
  }
}
