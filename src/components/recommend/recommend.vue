<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" :data="discList" class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <slider v-if="slider.length">
            <div v-for="item in slider" :key="item.id">
              <a :href="item.linkUrl">
                <img @load="loadImage" :src="item.picUrl"/>
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item" @click="selectDisc(item)">
              <div class="icon"><img width="60" height="60" v-lazy="item.imgurl" :alt="item.dissname"></div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Slider from 'base/slider/slider'
  import {getRecommend, getDiscList} from 'api/recommend'
  import {ERR_OK} from 'api/config'
  import {playListMixin, prRenderMixin} from 'common/js/mixin'
  import {mapMutations} from 'vuex'
  import {SET_DISC} from 'store/mutation-types'

  export default {
    mixins: [playListMixin, prRenderMixin],
    data() {
      return {
        slider: [],   // 轮播图列表
        discList: [],  // 歌单列表
        checkLoaded: false  // 检查图片加载
      }
    },
    created() {
      this._getRecommend()
      this._getDiscList()
    },
    methods: {
      ...mapMutations({
        setDisc: SET_DISC
      }),
      handlePlayList(playlist) {
        this.changeScrollList(playlist, this.$refs.recommend, this.$refs.scroll)
      },
      selectDisc(disc) {
        this.$router.push({
          path: `/recommend/${disc.dissid}`
        })
        this.setDisc(disc)
      },
      _getRecommend() {
        getRecommend().then(res => {
          if (res.code === ERR_OK) {
            this.slider = res.data.slider
          }
        })
      },
      _getDiscList() {
        getDiscList().then(res => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      loadImage() {
        if (this.checkLoaded) {
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      }
    },
    components: {
      Slider,
      Scroll,
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;


    .recommend-content{
      position: relative;
      height:100%;
      overflow: hidden;

      .slider-wrapper {
        position: relative
        width: 100%
        min-height: 150px;
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
    }
  }
</style>
