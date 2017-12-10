<template>
  <div id="app">
    <m-header />
    <tab />
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import Header from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'

  export default {
    name: 'app',
    components: {
      'm-header': Header,
      'tab': Tab
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
