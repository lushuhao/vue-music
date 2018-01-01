<template>
  <div class="singerDetail">

  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'

  export default {
    computed: {
      ...mapGetters([
        'singer'
      ])
    },
    created() {
      this.singerId = this.$route.params.id
      this._getSinger()
    },
    methods: {
      _getSinger() {
        getSingerDetail(this.singerId).then((res) => {
          if (res.code === ERR_OK) {
            console.log(res.data)
          }
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singerDetail {
    position: fixed
    z-index: 100
    top: 0
    bottom: 0
    left: 0
    right: 0
    background: $color-background
  }

</style>
