<template>
  <div class="gameapp">
  	<div class="row gameboard">
  		<div class="col-md-12">
  			<h3>{{ msg }} $ {{ $store.state.storemsg }}</h3>
        <el-button @click="gameInit()">GAME INIT</el-button>
        <el-button @click="gameStart()">GAME START</el-button>
  		</div>
  	</div>
    <div class="row gameboard">
  		<div class="col-md-4 gameboard">
          <h3>player 2 deck</h3>
          <comDeck :player="$store.state.player2"></comDeck>
          <!-- <el-button @click="handleFilter(9)">STAR 9</el-button> -->
          <!-- <el-button @click="$store.dispatch('PAGE_FILTER')">ALL</el-button> -->
  		</div>
  		<div class="col-md-8 gameboard">
        <div class="row gameboard">
          <comZone :player="$store.state.player2"></comZone>
        </div>
  		</div>
  	</div>
  	<div class="row gameboard">
  		<div class="col-md-8">
        <div class="row gameboard">
          <comZone :player="$store.state.player1"></comZone>
        </div>
        <div class="row gameboard">
          <comHand :player="$store.state.player1"></comHand>
        </div>
  		</div>
      <div class="col-md-4 gameboard">
          <h3>deck1</h3>
          <comDeck :player="$store.state.player1"></comDeck>
          <el-button @click="$store.dispatch('DRAW',1)">DRAW</el-button>
          <el-button @click="playcard()">PLAY</el-button>
          <el-button @click="battle()">BATTLE</el-button>
          <el-button @click="gameloop()">GEN</el-button>
          <!-- <el-button @click="handleFilter(9)">STAR 9</el-button> -->
          <!-- <el-button @click="$store.dispatch('PAGE_FILTER')">ALL</el-button> -->
  		</div>
  	</div>
    <div class="row">
    </div>
  </div>
</template>

<script>
// import cardDB from './cardDB.json'
// import deckControl from './deckControl.vue'
import comDeck from './comDeck.vue'
import comHand from './comHand.vue'
import comZone from './comZone.vue'
// import 'babel-polyfill'
// import _ from 'underscore'


export default {
  name: 'GameApp',
  data () {
    return {
      msg: 'SDW GAME APP'
    }
  },
  components: {
    comDeck,
    comHand,
    comZone,
  },
  created () {
  },
  mounted () {
    this.$store.dispatch( 'GAME_INIT' )
  },
  beforeDestroy () {
  },
  computed: {
  },
  methods: {
    gameInit () {
      this.$store.dispatch( 'GAME_INIT' )
      console.log('game Init')
    },
    gameStart () {
      console.log('game Start')
      this.$store.dispatch( 'SELECT_PLAYER', this.$store.state.player2 )
      this.$store.dispatch( 'DRAW', 5 )
      this.$store.dispatch( 'DRAW_TO_ZONE', 5 )

      this.$store.dispatch( 'SELECT_PLAYER', this.$store.state.player1 )
      this.$store.dispatch( 'DRAW', 5 )
      this.$store.dispatch( 'DRAW_TO_ZONE', 5 )
    },
    playcard () {
      // this.$store.dispatch( 'SELECT_PLAYER', this.$store.state.player1 )
      // this.$store.dispatch( 'SELECT_CARDLIST', this.$store.state.currentPlayer.hand )
      // this.$store.dispatch( 'ACT_SELECT_CARD_START', { list: 'hand', action: 'test_action' } )
      this.$store.dispatch( 'ACT_SELECT_CARD_START', {
        list: 'hand',
        many: 1,
        selectedMuation: (state,card) => {
            state.storemsg = `call back select ${card.name}`
            card.name = card.name + '**'
            console.log(`callback test check ${card.name} / ${state.storemsg}`)
        },
        selectedAction: (state,card) => {
          this.$store.commit('PICK_CARD',card)
          this.$store.commit('TO_BASE')
        },
        thenAction: (state) => {
            console.log('this is then action end of selection')
        },
      })
        // } ).then( () => {
        //   console.log('hello promise')
        // })
    },
    battle() {
      // this.$store.commit( 'BATTLE_SET', {
      //   attacker: {
      //     player: 'jomy',
      //     main: 'main',
      //   },
      //   defenser: {
      //     support: ['hello','hello2'],
      //   }
      // })
      //
      // console.log( 'after ', this.$store.state.battle )

      this.$store.dispatch( 'ACT_SELECT_CARD_START', {
        list: 'zone',
        many: 1,
        selectedMuation: (state,card) => {
            state.storemsg = `select ${card.name}`
            card.name = card.name + '**'
        },
        selectedAction: (state,card) => {
          this.$store.commit('BATTLE_SET', {
            attacker: {
              main: card,
            }
          } )
          this.$store.commit('SET_FACEUP')
        },
        thenAction: (state) => {
            console.log('battle 1 finish')
            this.battle2()
        },
      } )
    },
    battle2 () {
      this.$store.dispatch( 'ACT_SELECT_CARD_START', {
        list: 'hand',
        many: 1,
        selectedMuation: (state,card) => {
            state.storemsg = `select ${card.name}`
            card.name = card.name + '**'
        },
        selectedAction: (state,card) => {
          this.$store.commit('BATTLE_SET', {
            attacker: {
              support: card,
            }
          } )
        },
        thenAction: (state) => {
            console.log('battle 2 finish')
            console.log(`battle main ${state.battle.attacker.main.name} support ${state.battle.attacker.support.name}`)
        },
      } )
    },
    async gameloop () {
      console.log('start gameloop')
      // 重构使用 promise async selection
      // await dispatch('PHASE1').then((value) => {})
      // await dispatch('PHASE2').then((value) => {})
      console.log('call game start')
      this.gameStart()

      await this.$store.dispatch( 'ASYNC_ACT_SELECT_CARD_START', {
        list: 'zone',
        many: 1,
        selectedMuation: (state,card) => {
            state.storemsg = `select ${card.name}`
            card.name = card.name + '**'
        },
        selectedAction: (state,card) => {
          this.$store.commit('BATTLE_SET', {
            attacker: {
              main: card,
            }
          } )
          this.$store.commit('SET_FACEUP')
        },
        thenAction: (state) => {
            console.log('battle 1 finish')
        },
      } ).then( () => {
        // note!
        console.log('phase 1 dispatch promise.then finish')
        }
      )

      await this.$store.dispatch( 'ASYNC_ACT_SELECT_CARD_START', {
        list: 'hand',
        many: 1,
        selectedMuation: (state,card) => {
            state.storemsg = `select ${card.name}`
            card.name = card.name + '**'
        },
        selectedAction: (state,card) => {
          this.$store.commit('BATTLE_SET', {
            attacker: {
              support: card,
            }
          } )
        },
        thenAction: (state) => {
            console.log('battle 2 finish')
        },
      } ).then( () => {
        // note!
        console.log('phase 2 dispatch promise.then finish')
        }
      )

      console.log(`battle main ${this.$store.state.battle.attacker.main.name} support ${this.$store.state.battle.attacker.support.name}`)
      console.log( 'end of gameloop')
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

.flex-item {
    background-color: lightgrey;
    width: 150px;
    height: 200px;
    margin: 10px;
    border: none 5px #000000;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
}
</style>
