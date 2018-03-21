<template>
  <div class="m-header">
    <router-link tag="div" class="mine" to="/user">
      <i class="icon-mine"></i>
    </router-link>
    <div>
      <div class="icon"></div>
      <h1 class="text">Vue Music</h1>
    </div>
    <div class="music" @click="showMusic">
      <i class="icon-music" v-show="playList.length"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapState, mapMutations} from 'vuex'
  import * as types from 'store/mutation-types'

  export default {
    computed: {
      ...mapState(['playList'])
    },
    methods: {
      ...mapMutations({
        setFullScreen: types.SET_FULL_SCREEN,
        setPlayingState: types.SET_PLAYING_STATE,
      }),
      showMusic() {
        this.setFullScreen(true)
        this.setPlayingState(true)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between
    padding: 0 20px
    height: 44px;
    text-align: center;
    color: $color-theme;
    font-size: 0;

    .icon {
      display: inline-block;
      width: 30px;
      height: 32px;
      margin-right:9px;
      vertical-align: middle;
      bg-image('logo')
      background-size 30px 32px
    }

    .text {
      display: inline-block;
      vertical-align middle
      font-size: $font-size-large
      line-height: 44px;
    }

    .mine{
      extend-click()
      .icon-mine{
        font-size 20px
        color: $color-theme
      }
    }

    .music {
      extend-click()
      .icon-music{
        font-size 20px
        color: $color-theme
      }
    }

  }
</style>
