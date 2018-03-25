<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="clear"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll ref="listContent"
                class="list-content"
                :hasLoading="false"
                :data="sequenceList">
          <transition-group ref="list" name="list" tag="ul">
            <li class="item" v-for="(item, index) in sequenceList" :key="item.id" @click="selectItem(item, index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="toggleFavorite(item)">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm"
               text="是否要清空播放列表"
               confirmBtnText="清空"
               @confirm="clearConfirm">
      </confirm>
      <add-song ref="addSong" @addSongToList="scrollToCurrent"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'
  import AddSong from 'components/add-song/add-song'
  import {mapActions} from 'vuex'
  import {playMode} from 'common/js/config'
  import {playerMixin} from 'common/js/mixin'

  export default {
    mixins: [playerMixin],
    data() {
      return {
        showFlag: false
      }
    },
    computed: {
      modeText() {
        let text
        switch (this.playMode) {
          case playMode.sequence:
            text = '顺序播放'
            break
          case playMode.loop:
            text = '单曲循环'
            break
          case playMode.random:
            text = '随机播放'
            break
        }
        return text
      }
    },
    watch: {
      sequenceList(list) {
        if (list.length <= 0) {
          this.hide()
        }
      }
    },
    methods: {
      ...mapActions(['deleteSong', 'clearSong']),
      show() {
        this.showFlag = true
        this.$nextTick(() => {
          this.$refs.listContent.refresh()
          this.scrollToCurrent(this.currentSong)
        })
      },
      hide() {
        this.showFlag = false
      },
      getCurrentIcon(song) {
        if (this.currentSong.id === song.id) {
          return 'icon-play'
        }
        return ''
      },
      selectItem(item, index) {
        if (this.playMode === playMode.random) {
          index = this.playList.findIndex(song => {
            return song.id === item.id
          })
        }
        this.setCurrentIndex(index)
        this.setCurrentSong() // 可以根据currentIndex来获取currentSong，不需要传递item
      },
      scrollToCurrent(current) {
        let index = this.sequenceList.findIndex(song => {
          return song.id === current.id
        })
        this.$refs.listContent.scrolltoElement(this.$refs.list.$el.children[index], 300)
      },
      deleteOne(item) {
        this.deleteSong(item)
      },
      clear() {
        this.$refs.confirm.show()
      },
      clearConfirm() {
        this.clearSong()
      },
      addSong() {
        this.$refs.addSong.show()
      }
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    }
  }
</script>

<style scoped lang="stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist {
    position: fixed
    top: 0
    bottom: 0
    left: 0
    right: 0
    z-index: 200
    background-color: $color-background-d

    &.list-fade-enter-active, &.list-fade-leave-active {
      transition: opacity .3s

      .list-wrapper {
        transition: all .3s
      }
    }

    &.list-fade-enter, &.list-fade-leave-to {
      opacity: 0

      .list-wrapper {
        transform: translateY(100%)
      }
    }

    .list-wrapper {
      position: absolute
      left: 0
      right: 0
      bottom: 0
      background-color: $color-highlight-background

      .list-header {
        position: relative
        padding: 20px 30px 10px 20px

        .title {
          display: flex
          align-items: center

          .icon {
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          }

          .text {
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          }

          .clear {
            extend-click()
            .icon-clear {
              font-size: $font-size-medium
              color: $color-text-d
            }
          }
        }
      }

      .list-content {
        max-height: 240px
        overflow: hidden

        .item {
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden

          &.list-enter-active, &.list-leave-active {
            transition: all .1s
          }

          &.list-enter, &.list-leave-to {
            height: 0
          }

          .current {
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          }

          .text {
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          }

          .like {
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme

            .icon-favorite {
              color: $color-sub-theme
            }
          }

          .delete {
            extend-click()
            font-size: $font-size-small
            color: $color-theme
          }
        }
      }

      .list-operate {
        width: 140px
        margin: 20px auto 30px

        .add {
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l

          .icon-add {
            margin-right: 5px
            font-size: $font-size-small-s
          }

          .text {
            font-size: $font-size-small
          }
        }
      }

      .list-close {
        text-align: center
        line-height: 50px
        background-color: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
      }
    }
  }
</style>
