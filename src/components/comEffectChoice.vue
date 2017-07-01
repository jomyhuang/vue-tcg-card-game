<template>
<div class="comEffectChoice">
  <el-dialog ref="dialog" v-model="show" size="small" :close-on-click-modal="closemodal">
    <div>
      <div slot="header" style="text-align:center" v-if="context.card">
        <h3>选择 {{context.card.name}} 发动{{context.type}}效果</h3>
      </div>
      <div v-if="stage=='start'">
        <transition name="bounceDown">
          <div>
            <h1>选择启动</h1>
          </div>
        </transition>
      </div>
      <div v-else-if="stage=='choice'">
        <Row class="gameboard">
          <h2>CHOICE</h2>
          <el-carousel :interval="4000" type="card" height="200px" :autoplay="false" @change="change">
            <el-carousel-item v-for="item in player.deck" :key="item" style="align: center">
              <div @click="testclick(item)">
                <comCard :card="item"></comCard>
              </div>
            </el-carousel-item>
          </el-carousel>
        </Row>
      </div>
    </div>
    <!-- <div v-else>
      <div slot="header" style="text-align:center">
        NO CONTEXT
      </div>
    </div> -->
    <span slot="footer" class="dialog-footer" v-if="closeable">
      <b>waiting click to continue</b>
      <el-button type="primary" @click="show = false">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import mu from '@/mutil'
import comCard from './comCard.vue'


export default {
  name: 'comEffectChoice',
  data() {
    return {
      msg: 'comEffectChoice',
      show: false,
      autoClose: 0,
      onClose: null,
      closemodal: false,
      closeable: false,

      context: {},
      stage: 'choice',
      stagedata: null,
    }
  },
  props: {
    // v-model 必须要有 vaule prop
    value: {
      type: Object,
      default: () => {},
    },
    player: {
      type: Object,
      default: () => [],
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
    comCard,
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
    ok() {},
    cancel() {},
    testclick(item) {
      console.log('click', item);
    },
    change(index) {
      console.log('change', index);
    },
    _opendialog() {
      // console.log('open dialog event special')
    },
    _closedialog() {
      // console.log('close dialog event')
      this.closeable = false
      this._setstage()
      this.stagedata = null

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
      this.autoClose = mu.isTestmode ? 1 : auto
      this.onClose = onclose
      this.closemodal = false
      this.closeable = auto ? false : true

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
    },
    showstage(stage, data, onfinish, duration = 1500) {
      this.stagedata = data
      this._setstage(stage)

      if (mu.isTestmode) {
        onfinish.call(this)
        return
      }
      const fnclose = () => {
        this._setstage()
        // clear data
        this.stagedata = null
        if (onfinish)
          onfinish.call(this)
      }

      return this.open(duration, fnclose)
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
