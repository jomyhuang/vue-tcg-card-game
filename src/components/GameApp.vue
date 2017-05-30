<template>
<div class="gameapp">
  <Row class="gameboard">
    <div>
      <h3>{{ msg }} $ {{ $store.state.storemsg }}</h3>
      <Button @click="gameTest()">GAME TEST</Button>
      <Button @click="battleshow(0)">Battle Show</Button>
    </div>
  </Row>
  <Row class="gameboard">
    <Col span="4" class="gameboard">
      <h3>player 2 deck</h3>
      <comDeck :player="$store.state.player2"></comDeck>
    </Col>
    <Col span="20" class="gameboard">
      <div class="gameboard">
        <comHand :player="$store.state.player2"></comHand>
      </div>
      <div class="gameboard">
        <comZone :player="$store.state.player2"></comZone>
      </div>
    </Col>
  </Row>
  <Row class="gameboard">
    <Col span="20">
      <div class="gameboard">
        <comZone :player="$store.state.player1"></comZone>
      </div>
      <div class="gameboard">
        <comHand :player="$store.state.player1"></comHand>
      </div>
    </Col>
    <Col span="4" class="gameboard">
      <h3>deck1</h3>
      <comDeck :player="$store.state.player1"></comDeck>
      <Button @click="$store.dispatch('DRAW',1)">DRAW</Button>
      <Button @click="playcard()">PLAY</Button>
    </Col>
  </Row>
  <Row class="gameboard">
    <div>
      <h3>{{ msg }} : Turn#{{ this.turnCount }} $ {{ $store.state.storemsg }}</h3>
      <!-- <Button @click="gameloop_temp()">TEST LOOP</Button> -->
      <Button @click="gameloop()" shape="circle">GAME LOOP</Button>
      <Button @click="gameloop(true)" shape="circle">GAME LOOP UI</Button>
      <Button @click="run_gameloop()">RUN</Button>
      <Button @click="run_gameloop(1)">RUN ONE TURN</Button>
      <Button @click="gameTestBattle()">BATTLE TEST CARD</Button>
      <BR/>
      <Button @click="gameTest()">TEST</Button>
      <Button @click="battleshow(0)">Battle Show</Button>
      <Button @click="gameReset()">RESET</Button>
      <Button @click="gameNewdeck()">NewDeck</Button>
      <Button @click="gameNewdeck(true)">NewDeck UI</Button>
      <comBattle ref="battle" v-model="$store.state.battle"></comBattle>
      <comMessage ref="info"></comMessage>
    </div>
  </Row>
</div>
</template>

<script>
import comDeck from './comDeck.vue'
import comHand from './comHand.vue'
import comZone from './comZone.vue'
import comBattle from './comBattle.vue'
import comMessage from './comMessage.vue'

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
    // console.log('gameapp.vue mixinEffect effect');
    // mutil.mixinEffect()
    console.log('gameapp.vue GAME initial')
    this.$store.dispatch('GAME_INIT_STORE', this.$store)
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
        this.run_command('GAME_SET_AGENT', { player: this.$store.state.player1, agent: null})
      }
    },
    gameTestBattle() {
      this.gameReset()
      this.gameNewdeck()

      this.run_battle( {
        BATTLE_DECALRE_ATTACKER: mutil.makecard('JW15-001',this.$store.state.player1,true),
        BATTLE_PLAY_SUPPORTER: mutil.makecard('JW15-001',this.$store.state.player1),
        BATTLE_OPP_DECLARE_DEFENSER: mutil.makecard('JW15-002',this.$store.state.player2,true),
        BATTLE_OPP_PLAY_SUPPORTER: mutil.makecard('JW15-002',this.$store.state.player2),
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
      this.msg = msg
      const duration = 500
      this.run_command('STORE_MESSAGE',msg)
      console.info('%c'+msg,'color:green')
      return this.config.message ? this.$refs.info.async_message(msg,duration) : true
      // return this.config.message ? this.$refs.info.async_message(msg) : true
    },
    run_message(msg) {
      return this.message(msg)
    },
    run_next(newphase, payload) {
      console.log(`next %c${newphase}`,'color:blue')
      return this.$store.dispatch(newphase,payload)
    },
    run_command(type, payload) {
      if(this.$store._actions[type]) {
        return this.$store.dispatch(type,payload)
      }
      else {
        return this.$store.commit(type,payload)
      }
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

      if(umi) {
        this.run_command('GAME_SET_AGENT', { player: this.$store.state.player1, agent: null})
        this.run_command('GAME_SET_CONFIG', { message: true })
      }

      let firstplayer = null
      await this.run_next('GAME_START')
      await this.message('游戏开始', 2000)
      await this.run_next('GAME_WHO_FIRST').then((who) => {
        firstplayer = who
      })
      await this.run_next('GAME_SET_FIRSTPLAYER', firstplayer)
      await this.message(`${this.firstPlayer.name} 先攻`)

      let loop = true
      do {

        await this.run_next('GAME_TURN_BEGIN')
        await this.message(`${this.currentPlayer.name} 我的回合！！ 第${this.$store.state.game.turnCount}回合`)
        await this.message('抽牌')
        await this.run_next('GAME_DRAW')
        await this.message('战斗开始')
        await this.run_next('BATTLE_START')

        await this.message(`${this.currentPlayer.name} 宣告攻击精灵`)
        await this.run_next('BATTLE_DECALRE_ATTACKER')
        await this.async_battleshow(1000)

        await this.message(`指定攻击目标`)
        await this.run_next('BATTLE_OPP_DECLARE_DEFENSER')
        await this.async_battleshow(1000)

        await this.message(`${this.currentPlayer.name} 派遣支援精灵`)
        await this.run_next('BATTLE_PLAY_SUPPORTER')

        await this.message(`${this.opponentPlayer.name} 派遣支援精灵`)
        await this.run_next('BATTLE_OPP_PLAY_SUPPORTER')

        await this.message(`效果：发动阶段`)
        await this.run_next('BATTLE_EFFECT')
        await this.message(`效果：清除阶段`)
        await this.run_next('BATTLE_EFFECT_CLEAR')

        await this.async_battleshow(0)

        await this.run_next('BATTLE_END')

        // check game over block
        await this.run_next('GAME_CHECK_GAMEOVER').catch((reason) => {
          console.log(`GAMEOVER: ${reason}`)
        })
        if (this.gameover) break
        // end check game over

        await this.run_next('GAME_NEXT_TURN')

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
    // 单回合战斗测试
    async run_battle(testbattle) {
      await this.run_message('run_battle START battle')
      await this.run_message('set test data')
      await this.run_command('TEST_SET', testbattle)

      await this.run_next('GAME_START')
      let firstplayer = this.$store.state.player1
      await this.run_next('GAME_SET_FIRSTPLAYER', firstplayer)

      await this.run_next('GAME_TURN_BEGIN')
      await this.run_next('BATTLE_START')

      await this.run_next('BATTLE_DECALRE_ATTACKER')
      await this.run_next('BATTLE_OPP_DECLARE_DEFENSER')
      await this.run_next('BATTLE_PLAY_SUPPORTER')
      await this.run_next('BATTLE_OPP_PLAY_SUPPORTER')

      await this.run_next('BATTLE_EFFECT')
      console.log('pass BATTLE_EFFECT')
      // await this.run_next('BATTLE_EFFECT_CLEAR')
      await this.run_next('BATTLE_END')
      await this.run_message('run_battle END battle')
    },
    // run gameloop + step 非同步版本／回合step步进版本
    async run_gameloop(testturn = 0) {
      this.run_message('start run gameloop test')

      if (this.$store.state.game.started) {
        this.run_message('对战已经开始')
        return
      }

      let firstplayer = null
      this.run_next('GAME_START')
      this.run_message('游戏开始')

      this.run_next('GAME_WHO_FIRST')
      firstplayer = this.$store.state.player1
      this.run_next('GAME_SET_FIRSTPLAYER', firstplayer)
      this.run_message(`${this.firstPlayer.name} 先攻`)

      let maxturn = testturn > 0 ? testturn : this.config.maxturn
      // maxturn = 1
      let loop = true
      do {

        await this.run_step()

        loop = await this.run_step_nextturn()
        if (this.gameover)
          break

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
    async run_step() {

      this.run_next('GAME_TURN_BEGIN')
      this.run_message(`${this.currentPlayer.name} 我的回合！！ 第${this.$store.state.game.turnCount}回合`)
      this.run_message('抽牌')
      this.run_next('GAME_DRAW')

      // promise then 非阻塞问题
      // this.$store.dispatch('GAME_TURN_BEGIN').then(() => {
      //   this.run_message(`${this.currentPlayer.name} 我的回合！！ 第${this.$store.state.game.turnCount}回合`)
      // }).then(() => {
      //   this.run_message('抽牌')
      //   this.$store.dispatch('GAME_DRAW')
      // })

      this.run_message('战斗开始')
      this.run_next('BATTLE_START')

      this.run_message(`${this.currentPlayer.name} 宣告攻击精灵`)
      this.run_next('BATTLE_DECALRE_ATTACKER')
      //await this.async_battleshow(1000)

      this.run_message(`指定攻击目标`)
      this.run_next('BATTLE_OPP_DECLARE_DEFENSER')
      // this.async_battleshow(1000)

      this.run_message(`${this.currentPlayer.name} 派遣支援精灵`)
      this.run_next('BATTLE_PLAY_SUPPORTER')

      this.run_message(`${this.opponentPlayer.name} 派遣支援精灵`)
      this.run_next('BATTLE_OPP_PLAY_SUPPORTER')

      this.run_message(`效果：发动阶段`)
      await this.run_next('BATTLE_EFFECT')
      this.run_message(`效果：清除阶段`)
      await this.run_next('BATTLE_EFFECT_CLEAR')

      // await this.async_battleshow(0)
      await this.run_next('BATTLE_END')

      // check game over block
      // this.$store.dispatch('GAME_CHECK_GAMEOVER')
      // if (this.gameover) {
      //   break
      // }
    },
    run_step_nextturn() {
      let result = true

      this.run_next('GAME_CHECK_GAMEOVER').catch((reason) => {
        // this.run_message(`GAMEOVER: ${reason}`)
        result = false
      })
      if (!this.gameover)
        this.run_next('GAME_NEXT_TURN')

      return result
    },

    gameTest() {
      // this.$store.commit('GAME_SET_CURRENTPLAYER', this.$store.state.player1)
      // this.$store.commit('GAME_NEXT_PLAYER')
      // this.$store.commit('GAME_NEXT_PLAYER')
      // this.$refs.info.message('讯息测试～')
      console.log('gameTest call')

      this.$store.dispatch('M2', {
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
