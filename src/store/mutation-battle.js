import Vue from 'vue'
import cardDB from '@/components/SDWCardDB.json'
import deck1 from '@/components/deckplayer1.js'


import _ from 'lodash'
import R from 'ramda'
import mutil from '@/mutil'

import firstAgent from '@/components/agent-first'

export default {
  // BATTLE/TURN -------------------------------------------------
  // TURN
  TURN_SET(state, payload) {
    console.warn('commit TURN_SET no impelement', state.turn)
  },
  // BATTLE
  BATTLE_START(state, payload) {
    mutil.battleInit(state)
    // test data move use TEST_SET
    state.battle.attacker.player = state.currentPlayer
    state.battle.defenser.player = state.opponentPlayer
    console.log('commit BATTLE_START finish')
  },
  BATTLE_SET(state, payload) {

    // const settingAttacker = (value,key) => {
    //   const data = state.battle.attacker
    //   if(R.has(key)(data)) {
    //     // console.log(`R attacker set ${key} ${value}`)
    //     data[key] = value
    //   }
    //   else {
    //     console.warn(`BATTLE_SET attacker no key ${key}`)
    //   }
    // }
    // const settingDefenser = (value,key) => {
    //   const data = state.battle.defenser
    //   if(R.has(key)(data)) {
    //     // console.log(`R attacker set ${key} ${value}`)
    //     data[key] = value
    //   }
    //   else {
    //     console.warn(`BATTLE_SET defenser no key ${key}`)
    //   }
    // }

    // 不行，因为无法clone state
    // state.battle = R.merge(state.battle)(payload)

    // if(R.has('attacker')(payload)) {
    //   // R.forEachObjIndexed(settingAttacker,payload.attacker)
    //   // R.forEachObjIndexed(settingAttacker)(payload.attacker)
    //
    state.battle.attacker = R.merge(state.battle.attacker)(payload.attacker)
    // }
    // if(R.has('defenser')(payload)) {
    //   R.forEachObjIndexed(settingDefenser)(payload.defenser)
    state.battle.defenser = R.merge(state.battle.defenser)(payload.defenser)
    // }

    state.battle.attacker.player = state.currentPlayer
    state.battle.defenser.player = state.opponentPlayer

    // console.log(payload)
    // console.log( 'commit BATTLE_SET', state.battle )

  },
  BATTLE_CALC(state, {
    battle = state.battle,
    score = state.battle.score,
  } = {}) {

    // battle precheck
    battle.chain = []
    battle.chain.push(battle.attacker.main)
    battle.chain.push(battle.defenser.main)
    battle.chain.push(battle.attacker.support)
    battle.chain.push(battle.defenser.support)

    // console.log(`BATTLE_CALC chain `, state.battle.chain);

    R.forEach(x => {
      x.chain = [x.main, x.support]
    })([battle.attacker, battle.defenser])

    // console.log(`BATTLE_CALC attacker chain`, state.battle.attacker.chain);

    // attacker
    // calc power1/power2
    R.forEach(x => {
      if (x) {
        let anti = mutil.checkAnti(x.antipro, battle.defenser.main.antipro)
        let power = anti ? x.power2 : x.power1
        // mutil.makepower(x, power, 'BASIC', anti ? '克制 power up' : '基本攻击')
        x.power.push(mutil.makepower(x, power, 'BASIC', anti ? '克制 power up' : '基本攻击'))
        // x.power.push(mutil.makepower(x, power *2, 'BASIC', anti ? '克制 power up' : ''))
        // battle.attacker.power.push(power)
      } else {
        console.warn('BATTLE_CALC attacker calc power object null')
      }
    })(battle.attacker.chain)

    battle.attacker.power = mutil.makeflat(battle.attacker.chain)
    console.log('attacker power ', battle.attacker.power)

    let totalAttacker = R.reduce(R.add, 0)(battle.attacker.power)
    battle.attacker = R.assoc('total', totalAttacker)(battle.attacker)

    console.log(`basic totalAttacker ${battle.attacker.total}`)

    // defenser
    // calc power1/power2
    R.forEach(x => {
      if (x) {
        let anti = mutil.checkAnti(x.antipro, battle.attacker.main.antipro)
        let power = anti ? x.power2 : x.power1
        // mutil.makepower(x, power, 'BASIC', anti ? '克制 power up' : '基本攻击')
        x.power.push(mutil.makepower(x, power, 'BASIC', anti ? '克制 power up' : '基本攻击'))
        // battle.defenser.power.push(power)
      } else {
        console.warn('BATTLE_CALC default calc power object null')
      }
    })(battle.defenser.chain)

    battle.defenser.power = mutil.makeflat(battle.defenser.chain)
    console.log('defenser power ', battle.defenser.power)

    let totalDefenser = R.reduce(R.add, 0)(battle.defenser.power)
    battle.defenser = R.assoc('total', totalDefenser)(battle.defenser)

    console.log(`basic totalDefenser ${battle.defenser.total}`)

    // // result & score
    // if (totalAttacker == totalDefenser) {
    //   score.draw = true
    //   score.winside = 'draw'
    //   console.log(`battle is DRAW`)
    // } else {
    //   if (totalAttacker > totalDefenser) {
    //     score.win = battle.attacker
    //     score.lose = battle.defenser
    //     score.winside = 'attacker'
    //     // console.log(`battle result [attacker] WIN ${score.win.player.id} ${score.win.player.name}`)
    //   } else {
    //     score.win = battle.defenser
    //     score.lose = battle.attacker
    //     score.winside = 'defenser'
    //     // console.log(`battle result [defenser] WIN ${score.win.player.id} ${score.win.player.name}`)
    //   }
    //   console.log(`battle result [${score.winside}] WIN ${score.win.player.id} ${score.win.player.name}`)
    // }
    // score.finish = true
  },
  BATTLE_CALC2(state, {
    battle = state.battle,
    score = state.battle.score,
  } = {}) {
    console.log('BATTLE_CALC2 phase 2');

    // ------- attacker

    battle.attacker.power = mutil.makeflat(battle.attacker.chain)
    console.log('attacker power ', battle.attacker.power)

    // let totalAttacker = R.reduce(R.add, 0)(battle.attacker.power)
    let totalAttacker = mutil.reducepower(battle.attacker.chain)
    battle.attacker = R.assoc('total', totalAttacker)(battle.attacker)

    console.log(`FINAL totalAttacker ${battle.attacker.total}`)

    // ------- defenser

    battle.defenser.power = mutil.makeflat(battle.defenser.chain)
    console.log('defenser power ', battle.defenser.power)

    // let totalDefenser = R.reduce(R.add, 0)(battle.defenser.power)
    let totalDefenser = mutil.reducepower(battle.defenser.chain)
    battle.defenser = R.assoc('total', totalDefenser)(battle.defenser)

    console.log(`FINAL totalDefenser ${battle.defenser.total}`)

  },
  BATTLE_SCORE(state, {
    battle = state.battle,
    score = state.battle.score,
  } = {}) {

    console.log('commit BATTTLE_SCORE')
    let totalAttacker = R.reduce(R.add, 0)(battle.attacker.power)
    let totalDefenser = R.reduce(R.add, 0)(battle.defenser.power)

    // result & score
    if (totalAttacker == totalDefenser) {
      score.draw = true
      score.winside = 'draw'
      console.log(`battle is DRAW`)
    } else {
      if (totalAttacker > totalDefenser) {
        score.win = battle.attacker
        score.lose = battle.defenser
        score.winside = 'attacker'
        // console.log(`battle result [attacker] WIN ${score.win.player.id} ${score.win.player.name}`)
      } else {
        score.win = battle.defenser
        score.lose = battle.attacker
        score.winside = 'defenser'
        // console.log(`battle result [defenser] WIN ${score.win.player.id} ${score.win.player.name}`)
      }
      console.log(`battle result [${score.winside}] WIN ${score.win.player.id} ${score.win.player.name}`)
    }
    score.finish = true

  },
  GAME_CHECK_GAMEOVER(state, payload) {
    // console.log('commit GAME_CHECK_GAMEOVER check begin')
    state.game.over = false
    state.game.score.reason = ''

    // out of deck
    // zone check
    R.forEach(x => {
      if (!state.game.over) {
        if (x.deck.length <= 0) {
          state.game.score.lose = x
          state.game.over = true
          state.game.score.reason = `${x.id} lose: out of deck`
        }
      }
      if (!state.game.over) {
        if (x.zone.length <= 0) {
          state.game.score.lose = x
          state.game.over = true
          state.game.score.reason = `${x.id} lose: be defect`
        }
      }
    })([state.currentPlayer, state.opponentPlayer])

    // check draw
    if (state.currentPlayer.zone.length <= 0 &&
      state.opponentPlayer.zone.length <= 0) {
      state.game.score.draw = true
      state.game.over = true
      state.game.score.reason = `game is draw`
    }

    // for test
    // state.game.over = true
    // state.game.score.win = state.player1
    // state.game.score.reason = 'for test'

    // make score
    if (state.game.over) {
      if (state.game.score.draw) {
        state.game.score.win = null
        state.game.score.lose = null
      } else {
        if (state.game.score.win) {
          state.game.score.lose = mutil.opponent(state.players, state.game.score.win)
        } else {
          state.game.score.win = mutil.opponent(state.players, state.game.score.lose)
        }
      }
    }
  },
}
