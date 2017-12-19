<template>
  <scroll class="listview" :data="data">
    <ul>
      <li v-for="group in data" class="list-group">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
           <li v-for="item in group.items" class="list-group-item">
             <img class="avatar" v-lazy="item.avatar"/>
             <span class="name">{{item.name}}</span>
           </li>
        </ul>
      </li>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'

  export default {
    props: {
      data: {
        type: Array
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview {
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background

    .list-group{
      padding-bottom: 30px

      &-title{
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      }

      &-item{
        display: flex
        align-items: center
        padding: 20px 0 0 30px

        .avatar{
          width: 50px
          height: 50px
          border-radius: 50%
        }

        .name{
          padding-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
        }
      }
    }
  }
</style>
