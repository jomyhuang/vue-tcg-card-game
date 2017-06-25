<template>
<div class="comEffect">
  <el-dialog ref="dialog" v-model="show" size="large">
  <!-- <el-dialog ref="effectDialog" v-model="show" size="large" @open="opendialog"> -->
  <div v-if="context.card">
    <div slot="header" style="text-align:center">
    <h3>效果发动 {{context.card.name}} 发动{{context.type}}效果</h3>
    </div>
    <Row class="gameboard">
    </Row>
  </div>
  <div v-else>
    <div slot="header" style="text-align:center">
    NO CONTEXT
    </div>
  </div>
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
      context: {},
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
  components: {
  },
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
    ok() {
    },
    cancel() {
    },
    _opendialog() {
      console.log('open dialog event special')
    },
    _closedialog() {
      console.log('close dialog event')
      if(this.onClose) {
        console.log('emit callback onclose')
        this.onClose.call(this)
        this.onClose = null
      }
    },
    open(auto=0, onclose) {
      this.autoClose = mu.isTestmode ? 1 : auto
      this.onClose = onclose
      this.show = true

      // <el-xxx ... @open="func">
      // bind "open" event by code
      this.$refs.dialog.$on('open', this._opendialog)
      this.$refs.dialog.$on('close', this._closedialog)
      // this.$refs.dialog.$on('close', this.onClose)

      if(this.autoClose) {
        setTimeout(() => {
          this.show = false
        }, this.autoClose)
      }
    },
    close() {
      this.show = false
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
