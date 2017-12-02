<template>
  <div class="recommend">
    <div v-if="slider.length" class="silder-wrapper">
      <slider>
        <a v-for="item in slider" :key="item.id" :href="item.linkUrl">
          <img :src="item.picUrl"/>
        </a>
      </slider>
    </div>
    <div class="recommend-list">
      <h1 class="list-title">热门歌单推荐</h1>
      <ul></ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slider from 'base/slider/slider'
  import {getRecommend} from 'api/recommend'
  import {ERR_OK} from 'api/config'

  export default {
    data() {
      return {
        slider: []
      }
    },
    created() {
      this._getRecommend()
    },
    methods: {
      _getRecommend() {
        getRecommend().then(res => {
          if (res.code === ERR_OK) {
            this.slider = res.data.slider
          }
        })
      }
    },
    components: {
      'slider': Slider
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend {
    height: 100%;
    .slider-wrapper {
      position: relative
      width: 100%
      overflow: hidden
    }
    .recommend-list {
      .list-title {
        height: 65px
        line-height: 65px
        text-align: center
        font-size: $font-size-medium
        color: $color-theme
      }
      .item {
        display: flex
        box-sizing: border-box
        align-items: center
        padding: 0 20px 20px 20px
        .icon {
          flex: 0 0 60px
          width: 60px
          padding-right: 20px
        }
        .text {
          display: flex
          flex-direction: column
          justify-content: center
          flex: 1
          line-height: 20px
          overflow: hidden
          font-size: $font-size-medium
        }
        .name {
          margin-bottom: 10px
          color: $color-text
        }
        .desc {
          color: $color-text-d
        }
      }
    }

    .loading-container {
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
    }
  }
</style>
