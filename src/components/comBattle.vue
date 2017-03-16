<template>
  <div class="comBattle">
    <el-dialog ref="battleDialog" title="精灵战争开战！" v-model="battleVisible" v-on:open="_afterOpen" size="large">
      <div class="row gameboard">
        <div class="col-md-6 gameboard flex-container-right">
          <comCard :card="$store.state.battle.attacker.main"></comCard>
          <comCard :card="$store.state.battle.attacker.support"></comCard>
    		</div>
        <div class="col-md-6 gameboard flex-container">
          <comCard :card="$store.state.battle.defenser.main"></comCard>
          <comCard :card="$store.state.battle.defenser.support"></comCard>
    		</div>
      </div>
      <span v-if="autoClose==0" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="battleVisible = false">>关 闭</el-button>
      </span>
    </el-dialog>
    <!-- <el-button @click="battleVisible = true">点击打开 Battle</el-button> -->
    <!-- <h3>battle mode props {{value}}</h3> -->
  </div>
</template>

<script>
import comCard from './comCard.vue'

export default {
  name: 'comBattle',
  data () {
    return {
      msg: 'comBattle',
      battleVisible: false,
      autoClose: 0,
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
      default: {},
    },
  },
  watch: {
    value(val,oldval) {
      console.log( 'v-model vaule changed :', val, oldval )
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
  created () {
  },
  mounted () {
  },
  beforeDestroy () {
  },
  computed: {
  },
  methods: {
    _afterOpen () {
      console.log('open battle dialog autoclose:', this.autoClose)
      // console.log(`test v-model : ${this.value}`)
      if( this.autoClose > 0) {
        setTimeout( () => {
          console.log('battle dialog timeout auto close')
          this.battleVisible = false
          this.autoClose = 0
        }, this.autoClose )
      }
    },
    open(auto=0) {
      // console.log(this.$refs.battleDialog)
      this.autoClose = auto
      // call method by ref id
      this.$refs.battleDialog.open()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: bold;
}

.gameboard {
  border: thin solid #0000ff;
  background-color: lightblue;
  padding: 15px;
}

.flex-container {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    /*height: 250px;*/
    /*background-color: lightgrey;*/
}

.flex-container-right {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    flex-wrap: wrap;
    justify-content: flex-end;
    /*height: 250px;*/
    /*background-color: lightgrey;*/
}

</style>
