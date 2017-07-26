<template>
<div class="gameapp">
  <!-- <el-row type="flex" class="gameboard">
    <h2>{{ msg }} : Turn#{{ this.turnCount }} $ {{ $store.state.storemsg }}</h2>
  </el-row> -->
  <el-row type="flex" class="gameboard">
    <el-col :span="4">
      <div class="gameboard">
        <h3>deck2</h3>
        <comDeck :player="$store.state.player2"></comDeck>
        <!-- <span v-if="isTestmode" style="color:red">【测试中】</span> -->
      </div>
    </el-col>
    <el-col :span="20">
      <div class="gameboard" style="min-height:200px">
        <comHand :player="$store.state.player2"></comHand>
      </div>
      <div class="gameboard" style="min-height:200px">
        <comZone :player="$store.state.player2"></comZone>
      </div>
    </el-col>
  </el-row>
  <el-row type="flex" class="gameboard">
    <el-col :span="20">
    <div class="gameboard" style="min-height:200px">
      <comZone :player="$store.state.player1"></comZone>
    </div>
    <div class="gameboard" style="min-height:200px">
      <comHand :player="$store.state.player1"></comHand>
    </div>
    </el-col>
    <el-col :span="4">
    <div class="gameboard">
      <h3>deck1</h3>
      <comDeck :player="$store.state.player1"></comDeck>
      <!-- <span v-if="isTestmode" style="color:red">【测试中】</span> -->
      <BR/>
      <el-button @click="$store.dispatch('DRAW',1)">DRAW</el-button>
      <el-button @click="playcard()">PLAY</el-button>
    </div>
    </el-col>
  </el-row>
  <el-row class="gameboard">
    <div>
      <h2>{{ msg }} : Turn#{{ this.turnCount }} $ {{ $store.state.storemsg }}</h2>
      <!-- <Button @click="gameloop_temp()">TEST LOOP</Button> -->
      <el-button type="primary" @click="gameloop()">GAME LOOP</el-button>
      <el-button type="primary" @click="gameloop(true)">GAME LOOP UI</el-button>
      <el-button type="primary" @click="run_gameloop()">QUICK RUN</el-button>
      <el-button type="primary" @click="run_gameloop(1)">QUICK RUN ONE TURN</el-button>
      <el-button @click="gameTestBattle()">BATTLE TEST CARD</el-button>
      <BR/> 显示讯息 Message LV{{$store.state.message.level}}
      <el-switch v-model="isMessage" /> 同步讯息
      <!-- <el-switch v-model="mu.AsyncUI" /> -->
      <el-switch v-model="isAsyncMssage" />
      <el-button @click="gameTest()">TEST</el-button>
      <el-button @click="gameReset()">RESET</el-button>
      <el-button @click="gameNewdeck()">NewDeck</el-button>
      <el-button @click="gameNewdeck(true)">NewDeck UI</el-button>
      <BR/> 模拟测试模式
      <el-switch v-model="isTest" />
      <el-button @click="battleshow(0)">Battle Show</el-button>
      <el-button @click="scoreshow()">Score Show</el-button>
      <el-button @click="effectshow()">Effect Show</el-button>
      <el-button @click="effectchoiceshow()">Effect Choice Show</el-button>
      <el-button @click="messageshow()">Message</el-button>
    </div>
  </el-row>
  <comMessage ref="messageUI"></comMessage>
  <comBattle ref="battle" v-model="$store.state.battle"></comBattle>
  <comScore ref="score" v-model="$store.state.score"></comScore>
  <comEffect ref="effectUI" v-model="$store.state.battle"></comEffect>
  <comEffectChoice ref="effectChoiceUI" v-model="$store.state.battle" :player="$store.state.player1"></comEffectChoice>
</div>
</template>

<script>
import comDeck from './comDeck.vue'
import comHand from './comHand.vue'
import comZone from './comZone.vue'
import comBattle from './comBattle.vue'
import comScore from './comScore.vue'
import comEffect from './comEffect.vue'
import comEffectChoice from './comEffectChoice.vue'
import comMessage from './comMessage.vue'

import testdeck1 from '@/components/decktest1.js'
import testdeck2 from '@/components/decktest2.js'

import Rx from 'rxjs/Rx'
import mu from '@/mutil'
import R from 'ramda'
import $cx from '@/cardxflow'

var $store
var commit
var dispatch

function run_command(type, payload) {
  if ($store._actions[type]) {
    return $store.dispatch(type, payload)
  } else {
    return $store.commit(type, payload)
  }
}

export default {
  name: 'GameApp',
  data() {
    return {
      msg: 'SDW GAME APP',
      initial: false,
      isMessage: true,
      isAsyncMssage: false,
      isTest: false,
      messageLevel: 2,
    }
  },
  components: {
    comDeck,
    comHand,
    comZone,
    comBattle,
    comMessage,
    comScore,
    comEffect,
    comEffectChoice,
  },
  created() {},
  mounted() {
    console.log('gameapp.vue mounted');
    // console.log('gameapp.vue mixinEffect effect');
    // mu.mixinEffect()
    console.log('gameapp.vue GAME initial')
    $store = this.$store
    commit = this.$store.commit
    dispatch = this.$store.dispatch

    dispatch('GAME_INIT_STORE', {
      store: this.$store,
      mainapp: this,
      effectUI: this.$refs.effectUI,
      effectChoiceUI: this.$refs.effectChoiceUI,
      messageUI: this.$refs.messageUI,
    })
    // mu.setUI(this.battleshow)
    // mu.tapUI()

    // 打开测试模式
    // mu.settestmode
    // console.log('mu.isTestmode',mu.isTestmode)
    // mu.isTestmode
    // console.log('test mode',this.config.test)
    // console.log('NODE_ENV',process.env.NODE_ENV)
    // Vue.config.test = process.env.NODE_ENV === 'testing'
    // console.log('Vue.config.test', Vue.config.test)

    // test 自定义插件
    this.muvue()

    // init message system
    commit('MESSAGE_LEVEL', mu.isTestmode ? 1 : 2)

    dispatch('GAME_READY')
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
  watch: {
    isTest(val, oldval) {
      console.log('isTest 启动手动模拟测试模式', val)
      mu.setTestmode(val)
    },
  },
  methods: {
    testui() {
      console.log('TEST UI');
    },
    // gameTestmode() {
    //   // mu.isTestmode = true
    //   // this.$store.dispatch('GAME_TESTMODE')
    //   console.log('TURN ON TEST MODE')
    //   return setTestmode()
    // },
    gameNewdeck(umi = false) {
      this.gameReset({
        decklist: [testdeck1, testdeck2],
        shuffle: false,
      })
      if (umi) {
        this.run_command('GAME_SET_AGENT', {
          player: this.$store.state.player1,
          agent: null
        })
      }
      this.UI_message('game set new deck')
    },
    gameTestBattle() {
      this.gameReset()
      this.gameNewdeck()

      this.run_battle({
        BATTLE_DECALRE_ATTACKER: mu.makecard('JW15-001', this.$store.state.player1, true),
        BATTLE_PLAY_SUPPORTER: mu.makecard('JW15-001', this.$store.state.player1),
        BATTLE_OPP_DECLARE_DEFENSER: mu.makecard('JW15-002', this.$store.state.player2, true),
        BATTLE_OPP_PLAY_SUPPORTER: mu.makecard('JW15-002', this.$store.state.player2),
      })
    },
    gameReset(init) {
      console.log('game reset');
      this.$store.dispatch('GAME_RESET')
      this.$store.dispatch('GAME_READY', init)
      commit('MESSAGE_LEVEL', mu.isTestmode ? 1 : this.messageLevel )
      this.UI_message('game Reset')
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
    battleshow(value = 1000, onclose, msg) {
      return this.$refs.battle.open(value, onclose, msg)
    },
    messageshow(value = 0, onclose, msg) {
      return this.$refs.messageUI.open(value, onclose, msg)
    },
    scoreshow(value = 0, onclose, msg) {
      return this.$refs.score.open(value, onclose, msg)
    },
    effectshow(value = 0, onclose, msg) {
      return this.$refs.effectUI.open(value, onclose, msg)
    },
    effectchoiceshow(value = 0, onclose, msg) {
      return this.$refs.effectChoiceUI.open(0, onclose, msg)
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
    __message(msg, duration = 1500, fullmessage = false) {
      this.msg = msg
      this.run_command('STORE_MESSAGE', msg)
      // console.info('%c' + msg, 'color:blue')

      return this.$refs.messageUI.showinfo(msg)

      // if (mu.isTestmode) return

      // return new Promise((resolve, reject) => {

        // const fullmessage = false
        // if (fullmessage || this.config.message) {
        //   this.$refs.messageUI.showstart(msg, resolve)
        // } else {
          // this.$message.closeAll()
          // this.$message({
          //   type: 'info',
          //   message: msg,
          //   duration: duration,
          //   onClose: this.isAsyncMssage ? resolve : null,
          // })
          // if (!this.isAsyncMssage) {
          //   resolve()
          // }
          // resolve()
        // }
      // })
    },
    __notice(msg, duration = 1500) {
      // return promise from component
      // return this.$refs.info.async_message(msg)
      this.msg = msg
      this.run_command('STORE_MESSAGE', msg)
      console.info('%c' + msg, 'color:green')
      if (mu.isTestmode) return

      if (this.config.message) {
        return new Promise((resolve, reject) => {
          this.$notify({
            // title: msg,
            message: msg,
            duration: duration,
            type: 'info',
            onClose: this.isAsyncMssage ? resolve : null,
          })
          if (!this.isAsyncMssage) {
            resolve()
          }
        })
      }
      else {
        console.log(`%c[notice] ${msg}`,'color:green')
      }
      return true
    },
    UI_message(msg,duration) {
      return this.__message(msg,duration)
    },
    run_message(msg) {
      return this.__notice(msg)
    },
    gameloop_phaseinfo(msg) {
      return this.__message(msg)
    },
    gameloop_message(msg) {
      return this.__notice(msg)
    },
    run_next(newphase, payload) {
      console.log(`next %c${newphase}`, 'color:blue')
      // dispatch('GAME_PHASE',newphase)
      return this.$store.dispatch(newphase, payload)
    },
    run_command(type, payload) {
      if (this.$store._actions[type]) {
        return this.$store.dispatch(type, payload)
      } else {
        return this.$store.commit(type, payload)
      }
    },
    async_battleshow(value = 1000, msg = null) {
      if (!this.config.battelshow) return
      if (mu.isTestmode) return

      // TIPS: 取消使用loop check，使用传入 resolve -> watch -> callback resolve()
      return new Promise((resolve, reject) => {
        this.battleshow(value, resolve, msg)
      })

      // if (value == 0) {
      //   // return this.__waiting_check(() => !this.$refs.battle.battleVisible)
      //   return new Promise((resolve, reject) => {
      //     // test callback resolve
      //     this.battleshow(value,resolve)
      //   })
      // } else {
      //   return new Promise((resolve, reject) => {
      //     this.battleshow(value)
      //     setTimeout(()=>resolve(),value+500)
      //   })
      // }
    },
    __waiting_check(checkfunc = () => true) {
      return new Promise(async function(resolve, reject) {
        let waiting = true
        while (waiting) {
          await new Promise(function(resolve, reject) {
            setTimeout(function() {
              resolve()
            }, 1000)
          })
          if (checkfunc()) {
            waiting = false
          }
        }
        resolve()
      })
    },
    // async __waiting_check(checkfunc = () => true) {
    //   let waiting = true
    //   while (waiting) {
    //     await new Promise(function(resolve, reject) {
    //       setTimeout(function() {
    //         resolve()
    //       }, 1000)
    //     })
    //     if (checkfunc()) {
    //       // console.log('waiting_click pass, exit loop');
    //       waiting = false
    //     }
    //   }
    // },
    async gameloop(umi = false) {
      console.log('start gameloop')

      if (this.$store.state.game.started) {
        return await this.gameloop_message('对战已经开始')
      }

      if (umi) {
        this.run_command('GAME_SET_AGENT', {
          player: this.$store.state.player1,
          agent: null
        })
      }
      this.run_command('GAME_SET_CONFIG', {
        message: this.isMessage,
        battelshow: true,
        umi: umi,
        asyncmessage: this.isAsyncMssage,
      })

      let firstplayer = null
      await this.run_next('GAME_START')
      await this.gameloop_message('游戏开始', 2000)
      await this.run_next('GAME_WHO_FIRST').then((who) => {
        firstplayer = who
      })
      await this.run_next('GAME_SET_FIRSTPLAYER', firstplayer)
      await this.gameloop_message(`${this.firstPlayer.name} 先攻`)

      let loop = true
      do {

        await this.run_next('GAME_TURN_BEGIN')
        await this.gameloop_phaseinfo(`第${this.$store.state.game.turnCount}回合 准备阶段`)
        await this.gameloop_message(`${this.currentPlayer.name} 我的回合！！`)
        await this.gameloop_message('抽牌')
        await this.run_next('GAME_DRAW')
        await this.gameloop_message('战斗开始')
        await this.run_next('BATTLE_START')

        await this.gameloop_phaseinfo(`战斗阶段`)
        await this.gameloop_message(`${this.currentPlayer.name} 宣告攻击精灵`)
        await this.run_next('BATTLE_DECALRE_ATTACKER')
        await this.async_battleshow(1000)

        await this.gameloop_message(`指定攻击目标`)
        await this.run_next('BATTLE_OPP_DECLARE_DEFENSER')
        await this.async_battleshow(1000)

        await this.gameloop_message(`${this.currentPlayer.name} 派遣支援精灵`)
        await this.run_next('BATTLE_PLAY_SUPPORTER')

        await this.gameloop_message(`${this.opponentPlayer.name} 派遣支援精灵`)
        await this.run_next('BATTLE_OPP_PLAY_SUPPORTER')

        await this.gameloop_message(`双方战斗准备完成`)
        await this.async_battleshow(1000, '对战开始')

        await this.gameloop_phaseinfo(`主效果阶段`)
        await this.gameloop_message(`效果：发动阶段`)
        await this.run_next('BATTLE_EFFECT')

        await this.gameloop_phaseinfo(`回合结束阶段`)
        await this.gameloop_message(`效果：清除阶段`)
        await this.run_next('BATTLE_EFFECT_CLEAR')

        await this.run_next('BATTLE_END')
        await this.async_battleshow(umi ? 0 : 1000, '战斗结束')


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
        await this.gameloop_phaseinfo(`游戏结束`)
        await this.gameloop_message(`游戏结束`)

        if (this.score.draw) {
          console.log(`game draw is true`)
          await this.gameloop_message(`战斗平手`)
        } else {
          console.log(`game win ${this.score.win.id} ${this.score.win.name}`)
          console.log(`game lose ${this.score.lose.id} ${this.score.lose.name}`)
          await this.gameloop_message(`获胜 ${this.score.win.id} ${this.score.win.name}`)
        }
        await this.scoreshow(0)
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
      // pass BATTLE_EFFECT_CLEAR
      // await this.run_next('BATTLE_EFFECT_CLEAR')
      await this.run_next('BATTLE_END')
      await this.run_message('run_battle END battle')
    },
    // run gameloop + step 非同步版本／回合step步进版本
    async run_gameloop(testturn = 0) {
      this.run_message('start run gameloop test')

      if (R.isNil(this.$store.state.player1.agent)) {
        this.run_message('run_gameloop 无法使用UI agent')
        return
      }

      if (this.$store.state.game.started) {
        this.run_message('对战已经开始，下一回合')
        // return
      } else {
        let firstplayer = null
        await this.run_next('GAME_START')
        this.run_message('游戏开始')

        await this.run_next('GAME_WHO_FIRST')
        firstplayer = this.$store.state.player1
        await this.run_next('GAME_SET_FIRSTPLAYER', firstplayer)
        this.run_message(`${this.firstPlayer.name} 先攻`)
      }

      let maxturn = testturn > 0 ? testturn : this.config.maxturn
      // maxturn = 1
      let loop = true
      do {

        await this.run_step()

        loop = await this.run_step_nextturn()
        if (this.gameover)
          break

        if (this.turnCount >= maxturn)
          break

      } while (!this.gameover && loop)

      // if (!loop)
      //   console.log(`end of gameloop, turn ${this.turnCount}`)

      if (this.gameover) {
        this.run_message(`GAMEOVER: ${this.score.reason}`)
        this.run_message(`game over, turn ${this.turnCount}`)
        if (this.score.draw) {
          this.run_message(`game draw is true`)
        } else {
          this.run_message(`game win ${this.score.win.id} ${this.score.win.name}`)
          this.run_message(`game lose ${this.score.lose.id} ${this.score.lose.name}`)
        }
        await this.scoreshow(0)
      } else {
        console.log(`end of gameloop, turn ${this.turnCount}`)
      }
    },
    async run_step() {

      await this.run_next('GAME_TURN_BEGIN')
      this.run_message(`${this.currentPlayer.name} 我的回合！！ 第${this.$store.state.game.turnCount}回合`)
      this.run_message('抽牌')
      await this.run_next('GAME_DRAW')

      this.run_message('战斗开始')
      await this.run_next('BATTLE_START')

      this.run_message(`${this.currentPlayer.name} 宣告攻击精灵`)
      await this.run_next('BATTLE_DECALRE_ATTACKER')

      this.run_message(`指定攻击目标`)
      await this.run_next('BATTLE_OPP_DECLARE_DEFENSER')

      this.run_message(`${this.currentPlayer.name} 派遣支援精灵`)
      await this.run_next('BATTLE_PLAY_SUPPORTER')

      this.run_message(`${this.opponentPlayer.name} 派遣支援精灵`)
      await this.run_next('BATTLE_OPP_PLAY_SUPPORTER')

      this.run_message(`效果：发动阶段`)
      await this.run_next('BATTLE_EFFECT')
      this.run_message(`效果：清除阶段`)
      await this.run_next('BATTLE_EFFECT_CLEAR')

      await this.run_next('BATTLE_END')
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


      // mu.AsyncUI = false
      console.log('AsyncUI',mu.AsyncUI);

      $cx.debug()


      // console.log('call emit');
      // this.$emit('testemit', this)
      // this.$boardcast('test',this)

      // console.log('RxJS practices')
      // var observable = Rx.Observable.create((observer) => {
      //   observer.next(this.run_next('RAMDA_TEST'))
      //   observer.next(2);
      //   observer.next(3);
      //   setTimeout(() => {
      //     observer.next(4);
      //     observer.complete();
      //   }, 1000);
      // })
      //
      // console.log('just before subscribe');
      // observable.subscribe({
      //   next: x => console.log('got value ' + x),
      //   error: err => console.error('something wrong occurred: ' + err),
      //   complete: () => console.log('done'),
      // })
      // console.log('just after subscribe');
    },
    // end of methods
  }
}
</script>

<style>
/*@import '../style/base.scss';*/
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* scoped 不含向下传递 */

h2 {
  color: blue;
}

</style>
