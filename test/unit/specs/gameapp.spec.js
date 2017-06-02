import Vue from 'vue'
import {
  createComponent,
  createVM,
  destroyVM,
  fireEvent
} from '../vm'
import {
  expect
} from 'chai'

import Hello from '@/components/Hello'

import GameApp from '@/components/GameApp'
import testdeck1 from '@/components/decktest1.js'
import testdeck2 from '@/components/decktest2.js'

// 错误： export default {} 不能用解雇式
// import { mutations } from '@/store/mutations'
// 错误：
// import { SET_USER } from '@/store/mutations'
// 正确：

import store from '@/store'
import mutil from '@/mutil'

// import mutations from '@/store/mutation-game'
// 解构出函数
// const {
//   SET_USER,
//   INIT_DB,
//   GAME_INIT,
// } = mutations

describe('GameAPP', () => {
  let vm
  afterEach(() => {
    if (vm)
      destroyVM(vm)
    vm = null
  })

  it.skip('state test template', () => {
    const state = {
      user: ''
    }
    SET_USER(state, 'jomyhuang')
    expect(state.user).to.equal('jomyhuang')
  })

  it('test run_gameloop one turn', async function() {
    vm = createComponent(GameApp, true)
    // vm = createVM(GameApp, true)
    let state = vm.$store.state

    // console.log(vm.$el);
    // createVM how to call?
    // vm.gameReset({decklist:[testdeck1,testdeck2]})
    vm.gameTestmode()
    vm.gameReset()

    await vm.run_gameloop(1)
    expect(state.game.turnCount).to.equal(1)
  })

  it('test run_gameloop whole game w/testdeck1,testdeck2', async function() {
    vm = createComponent(GameApp, true)
    let state = vm.$store.state

    vm.gameTestmode()
    vm.gameReset({decklist:[testdeck1,testdeck2]})
    await vm.run_gameloop()
    expect(state.game.over).to.equal(true)
    expect(state.game.turnCount).to.equal(3)
    expect(state.game.score.win).to.equal(state.firstPlayer)
  })

  it('test main gameloop', async function() {
    vm = createComponent(GameApp, true)
    // vm = createVM(GameApp, true)
    let state = vm.$store.state

    // set timeout
    this.timeout(5000)

    vm.gameTestmode()
    vm.gameReset()

    await vm.gameloop()
    expect(state.game.over).to.equal(true)
  })

  it('test run_battle, basic battle/effect', async function() {
    vm = createComponent(GameApp, true)
    let state = vm.$store.state

    // set timeout
    this.timeout(3000)

    // vm.gameReset
    // set agent
    vm.gameTestmode()
    vm.gameNewdeck()
    await vm.run_battle( {
      // attacker: {
      //   main: mutil.makecard('JW15-001',state.player1,true),
      //   support: mutil.makecard('JW15-001',state.player1),
      // },
      // defenser: {
      //   main: mutil.makecard('JW15-002',state.player2,true),
      //   support: mutil.makecard('JW15-002',state.player2),
      // }
      BATTLE_DECALRE_ATTACKER: mutil.makecard('JW15-001',state.player1,true),
      BATTLE_PLAY_SUPPORTER: mutil.makecard('JW15-001',state.player1),
      BATTLE_OPP_DECLARE_DEFENSER: mutil.makecard('JW15-002',state.player2,true),
      BATTLE_OPP_PLAY_SUPPORTER: mutil.makecard('JW15-002',state.player2),
    })

    let battle = state.battle
    expect(state.game.turnCount).to.equal(1)

    expect(battle.attacker.main.owner).to.equal(battle.attacker.player)

    // run_battle 没有经过 select, facedown 设定
    expect(battle.attacker.main.play.isAttacker).to.equal(true)
    expect(battle.attacker.main.play.faceup).to.equal(true)
    expect(battle.attacker.support.play.isSupporter).to.equal(true)
    // test faceup effect
    // expect(battle.attacker.player.hand.length).to.equal(6)


    expect(battle.defenser.main.play.isDefenser).to.equal(true)
    expect(battle.defenser.main.play.faceup).to.equal(true)
    expect(battle.defenser.support.play.isSupporter).to.equal(true)
    // test faceup effect
    // expect(battle.defenser.player.hand.length).to.equal(5)

    expect(battle.attacker.total).to.equal(9000)
    expect(battle.defenser.total).to.equal(6000)

    expect(battle.score.finish).to.equal(true)
    expect(battle.score.win).to.equal(state.battle.attacker)
    expect(battle.score.lose).to.equal(state.battle.defenser)

  })
})
