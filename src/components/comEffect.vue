<template>
<div class="comEffect">
  <Modal ref="scoreDialog" v-model="show" width="800" @on-ok="ok" @on-cancel="cancel">
  <div v-if="context.card">
    <div slot="header" style="text-align:center">
    <h3>效果发动 {{context.card.name}}</h3>
    </div>
    <Row class="gameboard">
    </Row>
  </div>
  <div v-else>
    <div slot="header" style="text-align:center">
    NO CONTEXT
    </div>
  </div>
  </Modal>
</div>
</template>

<script>

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
  },
  methods: {
    ok() {
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
