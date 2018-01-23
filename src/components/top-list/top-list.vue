<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapState} from 'vuex'
  import {getSongList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'

  export default {
    data() {
      return {
        songs: []
      }
    },
    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        return this.topList.picUrl
      },
      ...mapState(['topList'])
    },
    created() {
      // this._getSongList()
    },
    methods: {
      _getSongList() {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getSongList(this.topList.id).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist)
          }
        })
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
      MusicList
    }
  }
</script>

<style scoped lang="stylus">
  .slide-enter-active, .slide-leave-active {
    transition: translate .3s ease
  }

  .slide-enter, .slide-leave-to {
    transform: translateY(100%)
  }
</style>
