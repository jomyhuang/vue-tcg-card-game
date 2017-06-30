<template>
<div class="comEffect">
  <el-dialog ref="dialog" v-model="show" size="large" :close-on-click-modal="closemodal">
    <!-- <el-dialog ref="effectDialog" v-model="show" size="large" @open="opendialog"> -->
    <div v-if="context.card">
      <div slot="header" style="text-align:center">
        <h3>效果发动 {{context.card.name}} 发动{{context.type}}效果</h3>
      </div>
      <div v-show="stage ==='showbuff'">
        <Row class="gameboard">
          <transition name="bounceDown">
            <div v-if="buffshow">
              <h2>SHOW BUFF EFFECT</h2>
              <h4>{{buffshow.source.name}} +POWER {{buffshow.power}}</h4>
              <h5>{{buffshow.tag}}</h5>
            </div>
          </transition>
        </Row>
      </div>
    </div>
    <div v-else>
      <div slot="header" style="text-align:center">
        NO CONTEXT
      </div>
    </div>
    <span slot="footer" class="dialog-footer" v-if="closeable">
      <b>waiting click to continue</b>
      <el-button type="primary" @click="show = false">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import mu from '@/mutil'

export default {
  name: 'comEffect',
  data() {
    return {
      msg: 'comEffect',
      show: false,
      autoClose: 0,
      onClose: null,
      onActFinish: null,
      context: {},
      buffshow: null,
      closemodal: false,
      closeable: false,
      stage: 'none',
    }
  },
  props: {
    //   // v-model 必须要有 vaule prop
    // value: {
    //   type: Object,
    //   default: () => {},
    // },
  },
  watch: {
    // show(val, oldval) {
    //   // console.log( 'v-model vaule changed :', val, oldval )
    //   if(!val) {
    //     if(this.onClose) {
    //       console.log('callback on close')
    //       this.onClose.call(this)
    //       this.onClose = null
    //     }
    //   }
    // },
  },
  components: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  computed: {
    score() {
      return this.$store.state.game.score
    },
    gameover() {
      return this.$store.state.game.over
    },
  },
  methods: {
    ok() {},
    cancel() {},
    _opendialog() {
      console.log('open dialog event special')
    },
    _closedialog() {
      console.log('close dialog event')
      this.closeable = false
      if (this.onClose) {
        console.log('emit callback onclose')
        this.onClose.call(this)
        this.onClose = null
      }
    },
    _setstage(stage = 'none') {
      this.stage = stage
    },
    open(auto = 0, onclose) {
      this.autoClose = mu.isTestmode ? 1 : auto
      this.onClose = onclose
      this.closemodal = false
      // this.closeable = true

      // <el-xxx ... @open="func">
      // bind "open" event by code
      this.$refs.dialog.$on('open', this._opendialog)
      this.$refs.dialog.$on('close', this._closedialog)
      // this.$refs.dialog.$on('close', this.onClose)

      this.show = true

      if (this.autoClose) {
        setTimeout(() => {
          this.show = false
        }, this.autoClose)
      }
    },
    close() {
      this.show = false
    },
    waitclose(onclose) {
      this.closemodal = true
      this.onClose = onclose
      this.closeable = true

      if (!this.show || mu.isTestmode) {
        onclose.call(this)
        return
      }
      // if (mu.isTestmode) {
      //   setTimeout(() => {
      //     this.show = false
      //   }, 100)
      // }
    },
    showstage(stage, onfinish, duration=1500) {
      this._setstage(stage)

      if (!this.show || mu.isTestmode) {
        onfinish.call(this)
        return
      }
      // IDEA: RxJS?
      if (onfinish) {
        setTimeout(() => {
          this._setstage()
          onfinish.call(this)
        }, duration)
      }
    },
    showbuff(buff, onfinish) {
      this.buffshow = buff
      this.showstage('showbuff',onfinish)
    },
    // showbuff(buff, onfinish) {
    //   const duration = 1500
    //   this.buffshow = buff
    //   this._setstage('showbuff')
    //
    //   if (!this.show || mu.isTestmode) {
    //     onfinish.call(this)
    //     return
    //   }
    //   // IDEA: RxJS?
    //   if (onfinish) {
    //     setTimeout(() => {
    //       this.buffshow = null
    //       this._setstage()
    //       onfinish.call(this)
    //     }, duration)
    //   }
    // },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
