<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {mapState} from 'vuex'

  export default {
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapState(['disc'])
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus">
  .slide-enter-active, .slide-leave-active {
    transition: translate .3s
  }

  .slide-enter, .slide-leave-to {
    transform: translateY(100%)
  }
</style>
