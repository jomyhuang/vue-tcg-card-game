<template>
<div class="comBattle">
  <el-dialog ref="battleDialog" v-model="show" size="large" @on-ok="ok" @on-cancel="cancel">
    <!-- <Modal ref="battleDialog" v-model="battleVisible" width="800" @on-ok="ok" @on-cancel="cancel"> -->
    <div slot="title" style="text-align:center">
      第{{this.$store.state.game.turnCount}}回合 {{msg}}
    </div>
    <el-row type="flex" class="gameboard">
      <el-col :span="12">
        <div class="gameboard flex-container-right">
          <h4>攻击方</h4>
          <comCard :card="battle.attacker.main"></comCard>
          <comCard :card="battle.attacker.support"></comCard>
          <!-- <comCard :card="$store.state.battle.attacker.main" v-if="$store.state.battle.attacker.main"></comCard>
        <comCard :card="$store.state.battle.attacker.support" v-if="$store.state.battle.attacker.support"></comCard> -->
          <h4 v-if="battle.attacker.exsupport.length >0">特别战斗</h4>
          <comCard :card="card" v-for="(card,key,index) in battle.attacker.exsupport" key="key"></comCard>
        </div>
        <p>
        总攻击力：{{battle.attacker.total}}
        </p>
      </el-col>
      <el-col :span="12">
        <div class="gameboard flex-container">
          <h4>防守方</h4>
          <comCard :card="battle.defenser.main"></comCard>
          <comCard :card="battle.defenser.support"></comCard>
          <span v-if="battle.defenser.exsupport.length >0">特别战斗</span>
          <comCard :card="card" v-for="(card,key,index) in battle.defenser.exsupport" key="key"></comCard>
        </div>
        <p>
        总攻击力：{{battle.defenser.total}}
        </p>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="show = false">确 定</el-button>
    </span>
  </el-dialog>
  <!-- <el-button @click="battleVisible = true">点击打开 Battle</el-button> -->
  <!-- <h3>battle mode props {{value}}</h3> -->
</div>
</template>

<script>
import comCard from './comCard.vue'
import mu from '@/mutil'

export default {
  name: 'comBattle',
  data() {
    return {
      msg: 'comBattle',
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
      if (!val) {
        if (this.onClose) {
          // console.log('callback on close/resolve promise');
          this.onClose.call(this)
          this.onClose = null
        }
      }
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
  computed: {
    battle() {
      return this.$store.state.battle
    },
  },
  methods: {
    ok() {
      // console.log('comBattle OK press')
    },
    cancel() {},
    open(auto = 0, onclose, msg = null) {
      if (mu.isTestmode) {
        auto = 1
      }

      this.autoClose = auto
      this.show = true
      this.onClose = onclose
      this.msg = msg ? msg : '精灵战争开战！'

      if (this.autoClose) {
        setTimeout(() => {
          this.show = false
        }, this.autoClose)
        console.log(`battleshow open auto close ${this.autoClose}`)
      } else {
        console.log('battleshow open waiting close')
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
