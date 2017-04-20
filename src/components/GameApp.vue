<template>
<div class="gameapp">
  <div class="row gameboard">
    <div class="col-md-12">
      <h3>{{ msg }} $ {{ $store.state.storemsg }}</h3>
      <el-button @click="gameTest()">GAME TEST</el-button>
      <!-- <el-button @click="gameStart()">GAME START</el-button> -->
      <el-button @click="battleshow(0)">Battle Show</el-button>
    </div>
  </div>
  <div class="row gameboard">
    <div class="col-md-3 gameboard">
      <h3>player 2 deck</h3>
      <comDeck :player="$store.state.player2"></comDeck>
    </div>
    <div class="col-md-9 gameboard">
      <div class="row gameboard">
        <comHand :player="$store.state.player2"></comHand>
      </div>
      <div class="row gameboard">
        <comZone :player="$store.state.player2"></comZone>
      </div>
    </div>
  </div>
  <div class="row gameboard">
    <div class="col-md-9">
      <div class="row gameboard">
        <comZone :player="$store.state.player1"></comZone>
      </div>
      <div class="row gameboard">
        <comHand :player="$store.state.player1"></comHand>
      </div>
    </div>
    <div class="col-md-3 gameboard">
      <h3>deck1</h3>
      <comDeck :player="$store.state.player1"></comDeck>
      <el-button @click="$store.dispatch('DRAW',1)">DRAW</el-button>
      <el-button @click="playcard()">PLAY</el-button>
    </div>
  </div>
  <div class="row gameboard">
    <div class="col-md-12">
      <h3>{{ msg }} $ {{ $store.state.storemsg }} Turn {{ $store.state.game.turnCount }}</h3>
      <!-- <el-button @click="gameloop_temp()">TEST LOOP</el-button> -->
      <el-button @click="gameloop()">GAME LOOP</el-button>
      <el-button @click="gameloop(true)">GAME LOOP UI</el-button>
      <el-button @click="run_gameloop()">RUN</el-button>
      <el-button @click="run_gameloop(1)">RUN ONE TURN</el-button>
      <el-button @click="gameTestBattle()">Battle test</el-button>
      <BR/>
      <el-button @click="gameTest()">TEST</el-button>
      <el-button @click="battleshow(0)">Battle Show</el-button>
      <el-button @click="gameReset()">RESET</el-button>
      <el-button @click="gameNewdeck()">NewDeck</el-button>
      <el-button @click="gameNewdeck(true)">NewDeck UI</el-button>
      <comBattle ref="battle" v-model="$store.state.battle"></comBattle>
      <comMessage ref="info"></comMessage>
    </div>
  </div>
</div>
</template>

<script>
import comDeck from './comDeck.vue'
import comHand from './comHand.vue'
import comZone from './comZone.vue'
import comBattle from './comBattle.vue'
import comMessage from './comMessage.vue'

// import _ from 'underscore'
import testdeck1 from '@/components/decktest1.js'
import testdeck2 from '@/components/decktest2.js'

import mutil from '@/mutil'


export default {
  name: 'GameApp',
  data() {
    return {
      msg: 'SDW GAME APP',
      initial: false,
    }
  },
  components: {
    comDeck,
    comHand,
    comZone,
    comBattle,
    comMessage,
  },
  created() {},
  mounted() {
    console.log('gameapp.vue mounted');
    console.log('gameapp.vue mixinEffect effect');
    mutil.mixinEffect()
    console.log('gameapp.vue GAME_INIT');
    this.$store.dispatch('GAME_INIT')
  },
  beforeDestroy() {},
  computed: {
    currentPlayer: function() {
      return this.$store.state.currentPlayer
    },
    firstPlayer: function() {
      return this.$store.state.firstPlayer
    },
    opponentPlayer: function() {
      return this.$store.state.opponentPlayer
    },
    turnCount: function() {
      return this.$store.state.game.turnCount
    },
    score: function() {
      return this.$store.state.game.score
    },
    gameover: function() {
      return this.$store.state.game.over
    },
    config: function() {
      return this.$store.state.game.config
    },
  },
  methods: {
    gameNewdeck(umi=false) {
      this.gameReset({
        decklist: [testdeck1, testdeck2],
        shuffle: false,
      })
      if(umi) {
        this.$store.commit('GAME_SET_AGENT', { player: this.$store.state.player1, agent: null})
      }
    },
    gameTestBattle() {
      this.gameReset()
      this.gameNewdeck()

      this.run_battle( {
        attacker: {
          // main facedown is true
          main: mutil.makecard('JW15-001',this.$store.state.player1,true),
          support: mutil.makecard('JW15-001',this.$store.state.player1),
        },
        defenser: {
          // main facedown is true
          main: mutil.makecard('JW15-002',this.$store.state.player2,true),
          support: mutil.makecard('JW15-002',this.$store.state.player2),
        }
      })
    },
    gameReset(init) {
      console.log('game reset');
      this.$store.dispatch('GAME_RESET')
      console.log(init);
      this.$store.dispatch('GAME_INIT', init)
    },
    gameStart() {
      // console.log('game Start')
      // this.$store.commit('SELECT_PLAYER', this.$store.state.player2)
      // this.$store.dispatch('DRAW', 5)
      // this.$store.dispatch('DRAW_TO_ZONE', 5)
      //
      // this.$store.commit('SELECT_PLAYER', this.$store.state.player1)
      // this.$store.dispatch('DRAW', 5)
      // this.$store.dispatch('DRAW_TO_ZONE', 5)
    },
    battleshow(value = 1000) {
      // console.log('battle test click')
      // console.log(this.$refs.battle)
      this.$refs.battle.open(value)
      // console.log('check data',this.$refs.battle.battleVisible);
    },
    playcard() {
      // this.$store.dispatch( 'SELECT_PLAYER', this.$store.state.player1 )
      // this.$store.dispatch( 'SELECT_CARDLIST', this.$store.state.currentPlayer.hand )
      // this.$store.dispatch( 'ACT_SELECT_CARD_START', { list: 'hand', action: 'test_action' } )
      this.$store.dispatch('ACT_SELECT_CARD_START', {
        list: 'hand',
        many: 1,
        selectedMuation: (state, card) => {
          state.storemsg = `call back select ${card.name}`
          card.name = card.name + '**'
          console.log(`callback test check ${card.name} / ${state.storemsg}`)
        },
        selectedAction: (state, card) => {
          this.$store.commit('PICK_CARD', card)
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
    message(msg) {
      // return promise from component
      // return this.$refs.info.async_message(msg)
      return this.config.message ? this.$refs.info.async_message(msg) : true
    },
    async async_battleshow(value = 1000) {
      if (!this.config.battelshow &&
        !(value == 0 && this.config.battleshow_pauseonly))
        return

      this.battleshow(value)

      if (value == 0) {
        await this.__waiting_click(() => !this.$refs.battle.battleVisible)
      } else {
        await new Promise(function(resolve, reject) {
          setTimeout(function() {
            // console.log('async_battleshow delay out');
            resolve()
          }, value)
        })
      }
    },
    async __waiting_click(checkfunc = () => true) {
      let waiting = true
      while (waiting) {
        await new Promise(function(resolve, reject) {
          setTimeout(function() {
            resolve()
          }, 1000)
        })
        if (checkfunc()) {
          console.log('waiting_click pass, exit loop');
          waiting = false
        }
      }
    },
    async gameloop(umi=false) {
      console.log('start gameloop')

      if (this.$store.state.game.started) {
        await this.message('对战已经开始')
        return
      }

      // 重构使用 promise async selection
      // await dispatch('PHASE1').then((value) => {})
      // await dispatch('PHASE2').then((value) => {})
      // if( !this.initial ) {
      if(umi) {
        this.$store.commit('GAME_SET_AGENT', { player: this.$store.state.player1, agent: null})
      }

      let firstplayer = null
      await this.$store.dispatch('GAME_START').then(async() => {
        await this.message('游戏开始', 2000)
      }).then(async() => {
        await this.$store.dispatch('GAME_WHO_FIRST').then((who) => {
          firstplayer = who
        })
        await this.$store.dispatch('GAME_SET_FIRSTPLAYER', firstplayer)
        await this.message(`${this.firstPlayer.name} 先攻`)
      })

      // console.log(`gameloop first ${this.$store.state.firstPlayer.id} current ${this.$store.state.currentPlayer.id}`)
      // this.initial = true
      // }

      let loop = true
      do {
        // await this.$store.dispatch('GAME_TURN_BEGIN').then(async() => {
        //   await this.message(`${this.currentPlayer.name} 我的回合！！ 第${this.$store.state.game.turnCount}回合`)
        // }).then(async() => {
        //   await this.message('抽牌')
        //   await this.$store.dispatch('GAME_DRAW')
        // })
        await this.$store.dispatch('GAME_TURN_BEGIN')
        await this.message(`${this.currentPlayer.name} 我的回合！！ 第${this.$store.state.game.turnCount}回合`)
        await this.message('抽牌')
        await this.$store.dispatch('GAME_DRAW')
        await this.message('战斗开始')
        await this.$store.dispatch('BATTLE_START')

        await this.message(`${this.currentPlayer.name} 宣告攻击精灵`)
        await this.$store.dispatch('BATTLE_DECALRE_ATTACKER')
        await this.async_battleshow(1000)

        await this.message(`指定攻击目标`)
        await this.$store.dispatch('BATTLE_OPP_DECLARE_DEFENSER')
        await this.async_battleshow(1000)

        await this.message(`${this.currentPlayer.name} 派遣支援精灵`)
        await this.$store.dispatch('BATTLE_PLAY_SUPPORTER')

        await this.message(`${this.opponentPlayer.name} 派遣支援精灵`)
        await this.$store.dispatch('BATTLE_OPP_PLAY_SUPPORTER')

        await this.message(`效果：发动阶段`)
        this.$store.dispatch('BATTLE_EFFECT')
        await this.message(`效果：清除阶段`)
        await this.$store.dispatch('BATTLE_EFFECT_CLEAR')

        await this.async_battleshow(0)

        await this.$store.dispatch('BATTLE_END')

        // check game over block
        await this.$store.dispatch('GAME_CHECK_GAMEOVER').catch((reason) => {
          console.log(`GAMEOVER: ${reason}`)
        })
        if (this.gameover) break
        // end check game over

        await this.$store.dispatch('GAME_NEXT_TURN')

        if (this.turnCount >= this.config.maxturn)
          loop = false

      } while (!this.gameover && loop)

      if (!loop)
        console.log(`end of gameloop, turn ${this.turnCount}`)

      if (this.gameover) {
        console.log(`game over, turn ${this.turnCount}`)
        if (this.score.draw) {
          console.log(`game draw is true`)
        } else {
          console.log(`game win ${this.score.win.id} ${this.score.win.name}`)
          console.log(`game lose ${this.score.lose.id} ${this.score.lose.name}`)
        }
      }
    },
    run_message(msg) {
      console.log(msg)
    },
    // 单回合战斗测试
    run_battle(battle) {
      this.run_message('run_battle start battle')
      this.$store.dispatch('GAME_START')
      let firstplayer = this.$store.state.player1
      this.$store.dispatch('GAME_SET_FIRSTPLAYER', firstplayer)

      this.$store.dispatch('GAME_TURN_BEGIN')
      this.$store.dispatch('BATTLE_START', battle)

      this.$store.dispatch('BATTLE_DECALRE_ATTACKER')
      this.$store.dispatch('BATTLE_OPP_DECLARE_DEFENSER')
      this.$store.dispatch('BATTLE_PLAY_SUPPORTER')
      this.$store.dispatch('BATTLE_OPP_PLAY_SUPPORTER')

      this.$store.dispatch('BATTLE_EFFECT')
      // this.$store.dispatch('BATTLE_EFFECT_CLEAR')
      this.$store.dispatch('BATTLE_END')
      this.run_message('run_battle end battle')
    },
    // run gameloop + step 非同步版本／回合step步进版本
    run_gameloop(testturn = 0) {
      this.run_message('start run gameloop test')

      if (this.$store.state.game.started) {
        this.run_message('对战已经开始')
        return
      }

      let firstplayer = null
      this.$store.dispatch('GAME_START')
      this.run_message('游戏开始')

      this.$store.dispatch('GAME_WHO_FIRST')
      firstplayer = this.$store.state.player1
      this.$store.dispatch('GAME_SET_FIRSTPLAYER', firstplayer)
      this.run_message(`${this.firstPlayer.name} 先攻`)

      let maxturn = testturn > 0 ? testturn : this.config.maxturn
      // maxturn = 1
      let loop = true
      do {

        this.run_step()

        loop = this.run_step_nextturn()
        if (this.gameover) break

        if (this.turnCount >= this.config.maxturn)
          loop = false
        if (this.turnCount >= maxturn)
          loop = false

      } while (!this.gameover && loop)

      if (!loop)
        console.log(`end of gameloop, turn ${this.turnCount}`)

      if (this.gameover) {
        this.run_message(`GAMEOVER: ${this.score.reason}`)
        this.run_message(`game over, turn ${this.turnCount}`)
        if (this.score.draw) {
          this.run_message(`game draw is true`)
        } else {
          this.run_message(`game win ${this.score.win.id} ${this.score.win.name}`)
          this.run_message(`game lose ${this.score.lose.id} ${this.score.lose.name}`)
        }
      }
    },
    run_step(battle) {

      this.$store.dispatch('GAME_TURN_BEGIN')
      this.run_message(`${this.currentPlayer.name} 我的回合！！ 第${this.$store.state.game.turnCount}回合`)
      this.run_message('抽牌')
      this.$store.dispatch('GAME_DRAW')

      // promise then 非阻塞问题
      // this.$store.dispatch('GAME_TURN_BEGIN').then(() => {
      //   this.run_message(`${this.currentPlayer.name} 我的回合！！ 第${this.$store.state.game.turnCount}回合`)
      // }).then(() => {
      //   this.run_message('抽牌')
      //   this.$store.dispatch('GAME_DRAW')
      // })

      this.run_message('战斗开始')
      this.$store.dispatch('BATTLE_START', battle)

      this.run_message(`${this.currentPlayer.name} 宣告攻击精灵`)
      this.$store.dispatch('BATTLE_DECALRE_ATTACKER')
      //await this.async_battleshow(1000)

      this.run_message(`指定攻击目标`)
      this.$store.dispatch('BATTLE_OPP_DECLARE_DEFENSER')
      // this.async_battleshow(1000)

      this.run_message(`${this.currentPlayer.name} 派遣支援精灵`)
      this.$store.dispatch('BATTLE_PLAY_SUPPORTER')

      this.run_message(`${this.opponentPlayer.name} 派遣支援精灵`)
      this.$store.dispatch('BATTLE_OPP_PLAY_SUPPORTER')

      this.run_message(`效果：发动阶段`)
      this.$store.dispatch('BATTLE_EFFECT')
      this.run_message(`效果：清除阶段`)
      this.$store.dispatch('BATTLE_EFFECT_CLEAR')

      // await this.async_battleshow(0)
      this.$store.dispatch('BATTLE_END')

      // check game over block
      // this.$store.dispatch('GAME_CHECK_GAMEOVER')
      // if (this.gameover) {
      //   break
      // }
    },
    run_step_nextturn() {
      let result = true

      this.$store.dispatch('GAME_CHECK_GAMEOVER').catch((reason) => {
        // this.run_message(`GAMEOVER: ${reason}`)
        result = false
      })
      if (!this.gameover)
        this.$store.dispatch('GAME_NEXT_TURN')

      return result
    },

    /// =========================== OLD GAMELOOP
    async gameloop_temp() {

      this.gameStart()
      this.$store.dispatch('GAME_SET_FIRSTPLAYER', this.$store.state.player1)
      this.$store.commit('BATTLE_INIT')

      await this.$store.dispatch('ASYNC_ACT_SELECT_CARD_START', {
        list: 'zone',
        many: 1,
        selectedMuation: (state, card) => {
          state.storemsg = `select ${card.name}`
          card.name = card.name + '**'
        },
        selectedAction: (state, card) => {
          this.$store.commit('BATTLE_SET', {
            attacker: {
              main: card,
            }
          })
          this.$store.commit('SET_FACEUP')
        },
        thenAction: (state) => {
          // console.log('battle 1 finish')
        },
      }).then(() => {
        // note!
        console.log('phase 1 dispatch promise.then finish')
      })
      this.battleshow()

      await this.$store.dispatch('ASYNC_ACT_SELECT_CARD_START', {
        list: this.$store.state.opponentPlayer.zone,
        many: 1,
        selectedMuation: (state, card) => {
          state.storemsg = `select ${card.name}`
          card.name = card.name + '**'
        },
        selectedAction: (state, card) => {
          this.$store.commit('BATTLE_SET', {
            defenser: {
              main: card,
            }
          })
          this.$store.commit('SET_FACEUP')
        },
        thenAction: (state) => {
          // console.log('battle 1 declare opponent main')
        },
      }).then(() => {
        // note!
        console.log('phase 1 declare opponent main dispatch promise.then finish')
      })
      this.battleshow()

      await this.$store.dispatch('ASYNC_ACT_SELECT_CARD_START', {
        list: 'hand',
        many: 1,
        selectedMuation: (state, card) => {
          state.storemsg = `select ${card.name}`
          card.name = card.name + '**'
        },
        selectedAction: (state, card) => {
          this.$store.commit('BATTLE_SET', {
            attacker: {
              support: card,
            }
          })
        },
        thenAction: (state) => {
          // console.log('battle 2 finish')
        },
      }).then(() => {
        // note!
        console.log('phase 2 dispatch promise.then finish')
      })
      // this.battleshow()

      console.log('Random/first defenser from hand')
      this.$store.commit('BATTLE_SET', {
        defenser: {
          // main: this.$store.state.opponentPlayer.zone[0],
          support: this.$store.state.opponentPlayer.hand[0],
        }
      })
      this.battleshow(0)

      console.log(`battle main ${this.$store.state.battle.attacker.main.name} support ${this.$store.state.battle.attacker.support.name}`)
      console.log(`battle defenser ${this.$store.state.battle.defenser.main.name} support ${this.$store.state.battle.defenser.support.name}`)
    },
    /// =========================== OLD GAMELOOP
    asyncTestFunc() {
      console.log('Hello this is asyncTestFunc run 2')
      return new Promise(async function(resolve, reject) {
        setTimeout(() => {
          [1, 2, 3].map((x) => console.log(x))
          resolve()
        }, 2000)
        await new Promise(function(resolve, reject) {
          // setTimeout( () => {
          //   [11,12,13].map((x)=>console.log(x))
          //   resolve()
          // }, 2000 )
          [11, 12, 13].map((x) => console.log(x))
          resolve()
        });
        console.log('after await');
      });
    },
    async asyncRun() {
      console.log('run 1')
      await this.asyncTestFunc()
      console.log('run 3');
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

      this.$store.dispatch('ACT_SELECT_CARD_START', {
        list: 'zone',
        many: 1,
        selectedMuation: (state, card) => {
          state.storemsg = `select ${card.name}`
          card.name = card.name + '**'
        },
        selectedAction: (state, card) => {
          this.$store.commit('BATTLE_SET', {
            attacker: {
              main: card,
            }
          })
          this.$store.commit('SET_FACEUP')
        },
        thenAction: (state) => {
          console.log('battle 1 finish')
          this.battle2()
        },
      })
    },
    battle2() {
      this.$store.dispatch('ACT_SELECT_CARD_START', {
        list: 'hand',
        many: 1,
        selectedMuation: (state, card) => {
          state.storemsg = `select ${card.name}`
          card.name = card.name + '**'
        },
        selectedAction: (state, card) => {
          this.$store.commit('BATTLE_SET', {
            attacker: {
              support: card,
            }
          })
        },
        thenAction: (state) => {
          console.log('battle 2 finish')
          console.log(`battle main ${state.battle.attacker.main.name} support ${state.battle.attacker.support.name}`)
        },
      })
    },

    gameTest() {
      // this.$store.commit('GAME_SET_CURRENTPLAYER', this.$store.state.player1)
      // this.$store.commit('GAME_NEXT_PLAYER')
      // this.$store.commit('GAME_NEXT_PLAYER')
      // this.$refs.info.message('讯息测试～')
      console.log('gameTest call')
      this.$store.dispatch('RAMDA_TEST', {
        name: 'test name',
        age: 10
      })
      // this.asyncRun()
    },
    // end of methods
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
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
