<template>
<div class="comBattle">
  <Modal ref="battleDialog" v-model="battleVisible" width="800" @on-ok="ok" @on-cancel="cancel">
    <div slot="header" style="text-align:center">
    精灵战争开战！
    </div>
    <Row class="gameboard">
      <Col span="12">
      <div class="gameboard flex-container-right">
        <h4>攻击方</h4>
        <comCard :card="$store.state.battle.attacker.main"></comCard>
        <comCard :card="$store.state.battle.attacker.support"></comCard>
        <!-- <comCard :card="$store.state.battle.attacker.main" v-if="$store.state.battle.attacker.main"></comCard>
        <comCard :card="$store.state.battle.attacker.support" v-if="$store.state.battle.attacker.support"></comCard> -->
      </div>
      </Col>
      <Col span="12">
      <div class="gameboard flex-container">
        <h4>防守方</h4>
        <comCard :card="$store.state.battle.defenser.main"></comCard>
        <comCard :card="$store.state.battle.defenser.support"></comCard>
      </div>
      </Col>
      <!-- <span v-if="autoClose==0" slot="footer" class="dialog-footer">
          <el-button type="primary" @click="battleVisible = false">>关 闭</el-button>
      </span> -->
    </Row>
  </Modal>
<!-- <el-button @click="battleVisible = true">点击打开 Battle</el-button> -->
<!-- <h3>battle mode props {{value}}</h3> -->
</div>
</template>

<script>
import comCard from './comCard.vue'

export default {
  name: 'comBattle',
  data() {
    return {
      msg: 'comBattle',
      battleVisible: false,
      autoClose: 0,
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
    value(val, oldval) {
      // console.log( 'v-model vaule changed :', val, oldval )
      // if(val=='on') {
      //   this.battleVisible = true
      // }
      // if(val=='on1000') {
      //   this.autoClose = 1000
      //   this.battleVisible = true
      // }
    },
    // mode: function (val,oldval) {
    //   console.log( 'compoent model changed :', val, oldval )
    //   if(val=='on') {
    //     this.battleVisible = true
    //   }
    //   if(val=='on1000') {
    //     this.autoClose = 1000
    //     this.battleVisible = true
    //   }
    // },
  },
  components: {
    comCard,
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  computed: {},
  methods: {
    ok() {
    },
    cancel() {
    },
    open(auto = 0) {
      this.autoClose = auto
      this.battleVisible = true

      if(this.autoClose) {
        setTimeout(() => {
          this.battleVisible = false
        },this.autoClose)
      }
    }
  }
}
</script>

<style>
/*@import '../style/base.scss';*/
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
