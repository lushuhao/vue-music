import {mapState} from 'vuex'

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
      list.style.bottom = playList.length > 0 ? this.playBottom : ''
      scroll.refresh()
    },
  }
}
