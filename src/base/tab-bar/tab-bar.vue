<template>
  <ul class="tab-bar">
    <li class="tab-item"
        v-for="(item, index) in tabs"
        :key="index"
        :class="{'active': currentIndex === index}"
        @click="selectItem(index)">
      <span>{{item.name}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      tabs: {
        type: Array,
        default: []
      },
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
      selectItem(index) {
        this.$emit('selectItem', index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .tab-bar {
    display: flex
    align-items: center
    width: 240px
    margin: 0 auto
    border: 1px solid $color-highlight-background
    border-radius: 5px
    overflow: hidden

    .tab-item {
      flex: 1
      padding: 8px
      text-align: center
      font-size: $font-size-medium
      color: $color-text-d

      &.active {
        background: $color-highlight-background
        color: $color-text
      }
    }
  }
</style>
