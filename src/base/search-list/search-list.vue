<template>
  <div class="search-list">
    <ul>
      <li class="search-item" v-for="item in searches">
        <span class="text">{{item}}</span>
        <span class="icon">
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      searches: {
        type: Array,
        default: []
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search-list {
    .search-item{
      display: flex
      align-items: center
      height: 40px

      .text{
        flex: 1
        color: $color-text-l
      }

      .icon{
        extext-click()
        .icon-delete{
          font-size: $font-size-small
          color: $color-text-d
        }
      }
    }
  }
</style>
