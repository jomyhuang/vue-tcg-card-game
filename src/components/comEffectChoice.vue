<template>
<div class="comEffectChoice">
  <el-dialog ref="dialog" v-model="show" size="small" :close-on-click-modal="closemodal" @open="_opendialog" @close="_closedialog">
    <div>
      <div slot="header" style="text-align:center" v-if="context">
        <h3 v-if="source">{{source.name}}</h3>
        <h3>发动{{context.type}}效果 {{message}}</h3>
      </div>
      <!-- <transition name="bounceDown">
        <div v-if="stage=='start'">
            <div>
              <h1>选择启动</h1>
            </div>
        </div>
      </transition> -->
      <!-- <div v-if="stage=='choice'"> -->
      <el-row class="gameboard">
        <h3>选择</h3>
        <el-carousel :interval="4000" type="card" height="200px" :autoplay="false" @change="change">
          <el-carousel-item v-for="item in list" :key="item.key">
            <div @click.stop.prevent="selectcard($event,item)">
              <comCard :card="item"></comCard>
            </div>
          </el-carousel-item>
        </el-carousel>
      </el-row>
      <!-- </div> -->
    </div>
    <!-- <div v-else>
      <div slot="header" style="text-align:center">
        NO CONTEXT
      </div>
    </div> -->
    <span slot="footer" class="dialog-footer">
      <b v-if="context">选择{{context.many}}张卡牌</b>
      <el-button type="primary" @click="clickok">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import mu from '@/mutil'
import comCard from './comCard.vue'
import $cx from '@/cardxflow'
import R from 'ramda'


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

      stage: 'choice',
      stagedata: null,
      index: null,
      context: null,
      list: [],
      message: null,
      source: null,
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
    // score() {
    //   return this.$store.state.game.score
    // },
  },
  methods: {
    ok() {},
    cancel() {},
    selectcard(event,card) {
      if (card.selectable) {
        console.log('comEffectChoice selectcard manual', card)
        this.$store.dispatch('ACT_SELECTED_CARD', card)
      } else {
        console.log('card no choice')
      }
    },
    clickok() {
      if(this.list.length == 0) {
        this.close()
        return
      }
      this.selectcard(null,this.list[this.index])
    },
    change(index) {
      // console.log('change', index);
      this.index = index
    },
    _opendialog() {
      // console.log('open dialog event special')
    },
    _closedialog() {
      // console.log('close dialog event')
      this.closeable = false
      this._setstage()
      this.stagedata = null
      this._setcontext()

      if (this.onClose) {
        // console.log('emit callback onclose')
        this.onClose.call(this)
        this.onClose = null
      }
    },
    _setstage(stage = null) {
      this.stage = stage
    },
    _setcontext(context=null) {
      if(context) {
        // context is act_selection
        // this.context = $cx.context
        this.context = context
        this.list = R.prop('list',context)
        this.message = R.prop('message',context)
        this.source = R.prop('source',context)
        // console.log('source',this.source);
      }
      else {
        this.context = null
        this.list = []
        this.source = null
        this.message = null
      }
    },
    open(context = null, onclose) {
      this.autoClose = mu.isTestmode ? 1 : 0
      this.onClose = onclose
      this.closemodal = false
      this.closeable = true

      this._setcontext(this.$store.state.act_selection)
      // console.log('$cx.context', $cx.context)

      // <el-xxx ... @open="func">
      // bind "open" event by code
      // this.$refs.dialog.$on('open', this._opendialog)
      // this.$refs.dialog.$on('close', this._closedialog)

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
    // showstage(stage, data, onfinish, duration = 1500) {
    //   this.stagedata = data
    //   this._setstage(stage)
    //
    //   if (mu.isTestmode) {
    //     onfinish.call(this)
    //     return
    //   }
    //   const fnclose = () => {
    //     this._setstage()
    //     // clear data
    //     this.stagedata = null
    //     if (onfinish)
    //       onfinish.call(this)
    //   }
    //
    //   return this.open(duration, fnclose)
    // },
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
