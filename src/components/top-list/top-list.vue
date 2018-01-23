<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapState} from 'vuex'
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'

  export default {
    data() {
      return {
        songs: [],
        bgImage: ''
      }
    },
    computed: {
      title() {
        return this.topList.topTitle
      },
      ...mapState(['topList'])
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then(res => {
          if (res.code === ERR_OK) {
            this.bgImage = res.topinfo.pic_album
            this.songs = this._normalizeSongs(res.songlist)
          }
        })
      },
      _normalizeSongs(list) {
        return list.map(music => {
          let musicData = music.data
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
