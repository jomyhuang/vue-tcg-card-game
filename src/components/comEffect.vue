<template>
<div class="comEffect">
  <el-dialog ref="dialog" v-model="show" size="large" :close-on-click-modal="closemodal" @open="_opendialog" @close="_closedialog">
    <!-- <el-dialog ref="effectDialog" v-model="show" size="large" @open="opendialog"> -->
    <div v-if="context.card">
      <div slot="header" style="text-align:center">
        <h3>效果发动 {{context.card.name}} 发动{{context.type}}效果</h3>
      </div>
      <!-- <div v-show="stage"> -->
      <transition name="el-zoom-in-center" mode="in-out">
        <div v-if="isstage('start')">
          <h1>效果启动</h1>
        </div>
      </transition>

      <el-row type="flex" class="gameboard">
        <transition name="el-zoom-in-center">
          <div v-if="isstage('showbuff')">
            <h2>SHOW BUFF EFFECT</h2>
            <h4 v-if="isnum(stagedata.power)">{{stagedata.source.name}} +POWER {{stagedata.power}}</h4>
            <h5>{{stagedata.tag}}</h5>
          </div>
        </transition>
      </el-row>

      <!-- <div v-if="stage=='choice'">
        <el-row type="flex" class="gameboard">
          <h2>CHOICE</h2>
          <el-carousel :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="item in 6" :key="item">
              <h3 @click="testclick(item)">{{ item }}</h3>
            </el-carousel-item>
          </el-carousel>
        </el-row>
      </div> -->
      <!-- </div> -->
    </div>
    <div v-else>
      <div slot="header" style="text-align:center">
        NO CONTEXT EFFECT
      </div>
    </div>
    <span slot="footer" class="dialog-footer" v-if="closeable">
      <el-button type="primary" @click="test">TEST</el-button>
      <b>waiting click to continue</b>
      <el-button type="primary" @click="show = false">确 定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import Vue from 'vue'
import mu from '@/mutil'
import R from 'ramda'

export default {
  name: 'comEffect',
  data() {
    return {
      msg: 'comEffect',
      show: false,
      autoClose: 0,
      onClose: null,
      context: {},
      closemodal: false,
      closeable: false,

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
    //   if(!val) {
    //     this._setstage()
    //     this.stagedata = null
    //   }
    // },
  },
  components: {

  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  computed: {
    // score() {
    //   return this.$store.state.game.score
    // },
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
    testclick(item) {
      console.log('click', item);
    },
    isstage(val) {
      return this.stage === val
    },
    isnum(val) {
      return R.is(Number,val)
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
      // this.$refs.dialog.$once('open', this._opendialog)
      // this.$refs.dialog.$once('close', this._closedialog)

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
    showstage(stage, data, onfinish = ()=>true, duration = 1500) {
      this.stagedata = data
      this._setstage(stage)

      if(!this.context) {
        console.warn(`comEffect showstage ${stage} context is null`)
      }

      if (mu.isTestmode || !this.config.message) {
        console.info(`%ccomEffect showstage ${stage}`,'color:green')
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
    showstart(data, onfinish) {
      return this.showstage('start', data, onfinish)
    },
    showbuff(buff, onfinish) {
      console.log(`showbuff ${buff.tag}`)
      return this.showstage('showbuff', buff, onfinish)
    },
    showchoice(data, onfinish) {
      return this.showstage('choice', {}, onfinish, 0)
    },
    test() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '已取消删除'
                });
              });
      this.$notify({
                  title: '提示',
                  message: '这是一条不会自动关闭的消息',
                  duration: 0
                });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
