<template>
  <div id="app">
    <m-header />
    <tab />
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
  import Header from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player'

  export default {
    name: 'app',
    components: {
      'm-header': Header,
      'tab': Tab,
      'player': Player
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "common/stylus/variable"
  #app {
    height: 100%;
    color: $color-theme;
  }
</style>
