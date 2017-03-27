<template>
  <div class="comMessage">
  </div>
</template>

<script>
// import comCard from './comCard.vue'

export default {
  name: 'comMessage',
  data () {
    return {
      msg: 'comMessage',
    }
  },
  props: {
    // autoClose: {
    //   type: Number,
    //   default: 0,
    // },
    // mode: {
    //   type: String,
    //   default: 'off',
    // },
    // v-model 必须要有 vaule prop
    value: {
      type: Object,
      default: () => {},
    },
  },
  // watch: {
  //   value(val,oldval) {
  //     // console.log( 'comMessage v-model vaule changed :', val, oldval )
  //   },
  // },
  components: {
    // comCard,
  },
  created () {
  },
  mounted () {
  },
  beforeDestroy () {
  },
  computed: {
  },
  methods: {
    async_message (msg, duration=1500) {
      return new Promise((resolve, reject) => {
        this.$message({
          message: msg,
          duration: duration,
          onClose: () => {
            // console.log('message onclose')
            resolve()
          },
        })
      })
    },
    message (msg='游戏消息提示',duration=1500) {
      this.$message({
        message: msg,
        duration: duration,
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
