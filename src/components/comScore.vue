<template>
<div class="comScore">
  <Modal ref="scoreDialog" v-model="show" width="800" @on-ok="ok" @on-cancel="cancel">
    <div slot="header" style="text-align:center">
    精灵战争战绩
    </div>
    <Row class="gameboard">
      <div v-if="gameover">
        <div v-if="score.draw">
          <h2>战斗平手</h2>
        </div>
        <div v-else>
          <h2>获胜 #{{score.win.id}} {{score.win.name}}</h2>
          <h3>回合数 {{this.$store.state.game.turnCount}}</h3>
        </div>
      </div>
      <div v-else>
        <h1>战斗进行中</h1>
      </div>
    </Row>
  </Modal>
</div>
</template>

<script>
export default {
  name: 'comScore',
  data() {
    return {
      msg: 'comScore',
      show: false,
      autoClose: 0,
      onClose: null,
    }
  },
  // props: ['value'],
  props: {
    //   // v-model 必须要有 vaule prop
    value: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    show(val, oldval) {
      // console.log( 'v-model vaule changed :', val, oldval )
      if(!val) {
        if(this.onClose) {
          console.log('callback on close')
          this.onClose.call(this)
          this.onClose = null
        }
      }
    },
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
    test() {
      return "TEST VAL"
    }
  },
  methods: {
    ok() {
      // console.log('comBattle OK press')
    },
    cancel() {
    },
    open(auto = 0, onclose) {
      this.autoClose = auto
      this.show = true
      this.onClose = onclose

      if(this.autoClose) {
        setTimeout(() => {
          this.show = false
        },this.autoClose)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
