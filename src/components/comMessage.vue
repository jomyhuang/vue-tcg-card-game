<template>
<div class="comMessage">
  <el-dialog ref="dialog" :visible.sync="show" size="small" :close-on-click-modal="closemodal" @open="_opendialog" @close="_closedialog">
    <!-- <el-dialog ref="effectDialog" v-model="show" size="large" @open="opendialog"> -->
    <div v-if="context">
      <div slot="header" style="text-align:center">
        <!-- <h3>效果发动 {{context.card.name}} 发动{{context.type}}效果</h3> -->
      </div>
      <!-- <div v-show="stage"> -->
      <transition name="el-zoom-in-center">
        <div v-if="isstage('info')">
            <h1>{{msg}}</h1>
        </div>
        <div v-else-if="isstage('showbuff')">
          <h2>SHOW BUFF EFFECT</h2>
          <h4>{{stagedata.source.name}} +POWER {{stagedata.power}}</h4>
          <h5>{{stagedata.tag}}</h5>
        </div>
      </transition>

    </div>
    <div v-else>
      <div slot="header" style="text-align:center">
        NO CONTEXT MESSAGE
      </div>
    </div>
    <span slot="footer" class="dialog-footer" v-if="closebutton">
      <el-button type="primary" @click="show = false">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import mu from '@/mutil'

export default {
  name: 'comMessage',
  data() {
    return {
      msg: 'comMessage',
      show: false,
      // autoClose: 0,
      onClose: null,
      context: {},
      closemodal: false,
      closebutton: false,

      stage: null,
      stagedata: null,
    }
  },
  props: {
    //  v-model 必须要有 vaule prop
    value: {
      type: Object,
      default: () => {},
    },
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
  components: {

  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  computed: {
    // gameover() {
    //   return this.$store.state.game.over
    // },
    config: function() {
      return this.$store.state.game.config
    },
  },
  methods: {
    ok() {},
    cancel() {},
    isstage(val) {
      return this.stage === val
    },
    _opendialog() {
      // console.log('message open dialog event')
    },
    _closedialog() {
      // console.log('message close dialog event')
      this.closebutton = false
      this._setstage()
      this.stagedata = null
      this.msg = null

      if (this.onClose) {
        // console.log('emit callback onclose')
        this.onClose.call(this)
        this.onClose = null
      }
    },
    _setstage(stage = null) {
      this.stage = stage
    },
    open(auto = 0, onclose) {
      // this.autoClose = mu.isTestmode ? 1 : auto
      auto = mu.UIduration(auto)
      this.onClose = onclose
      // this.autoClose = auto
      this.closemodal = auto ? false : true
      this.closebutton = auto ? false : true

      // <el-xxx ... @open="func">
      // bind "open" event by code
      // this.$refs.dialog.$once('open', this._opendialog)
      // this.$refs.dialog.$once('close', this._closedialog)
      // this.$refs.dialog.$on('close', this.onClose)

      this.show = true

      if (auto) {
        setTimeout(() => {
          this.show = false
        }, auto)
      }
    },
    close() {
      this.show = false
    },
    // waitclose(onclose) {
    //   this.closemodal = true
    //   this.onClose = onclose
    //   this.closeable = true
    //
    //   if (!this.show || mu.isTestmode) {
    //     onclose.call(this)
    //     return
    //   }
    // },
    showstage(stage, data, onfinish, duration = 1500) {

      return new Promise((resolve, reject) => {

        this.msg = data
        this.stagedata = data
        this._setstage(stage)
        console.info(`%cMessage stage ${stage}`,'color:green', this.stagedata)

        if(mu.styleUI)
          this.open(duration, resolve)
        else
          resolve()
      })
    },
    showinfo(msg, onfinish) {
      return this.showstage('info', msg, onfinish)
    },
    showbuff(buff, onfinish) {
      return this.showstage('showbuff', buff, onfinish)
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
