<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box></search-box>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import {getHotKey} from 'api/search'

  export default {
    created() {
      this._getHotKey()
    },
    methods: {
      _getHotKey() {
        getHotKey().then(res => {
          console.log(res)
        })
      }
    },
    components: {
      SearchBox
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search {

    .search-box-wrapper {
      margin: 20px
    }

  }
</style>
