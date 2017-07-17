import Vue from 'vue'
import cardDB from '@/components/SDWCardDB.json'
import deck1 from '@/components/deckplayer1.js'

import _ from 'lodash'
import R from 'ramda'
import mutil from '@/mutil'

// import firstAgent from '@/components/agent-first'

export default {
  // BATTLE/TURN -------------------------------------------------
  // TURN
  TURN_SET(state, payload) {
    console.warn('commit TURN_SET no impelement', state.turn)
  },
  // BATTLE
  BATTLE_START(state, payload) {
    state.battle = mutil.battleInit()
    // state.battle = R.merge(state.battle,mutil.battleInit())
    // test data move use TEST_SET
    state.battle.attacker.player = state.currentPlayer
    state.battle.defenser.player = state.opponentPlayer
    console.log('commit BATTLE_START finish')
  },
  BATTLE_SET(state, payload) {

    state.battle.attacker = R.merge(state.battle.attacker)(payload.attacker)
    state.battle.defenser = R.merge(state.battle.defenser)(payload.defenser)
    state.battle.score = R.merge(state.battle.score)(payload.score)

    state.battle.attacker.player = state.currentPlayer
    state.battle.defenser.player = state.opponentPlayer

    // console.log( 'commit BATTLE_SET', state.battle )
  },
  // BATTLE_EXSUPPORT(state) {
  //   if (!state.placeholder) {
  //     console.log('commit BATTLE_EXSUPPORT ERROR no placeholder card')
  //     return
  //   }
  //   const card = state.placeholder
  //   const owner = state.placeholder.owner
  //   let place
  //
  //   if(state.battle.attacker.player.id === owner.id) {
  //     place = 'attacker'
  //   } else if(state.battle.attacker.player.id === owner.id) {
  //     place = 'defenser'
  //   } else {
  //     throw new Error('BATTLE_EXSUPPORT error place')
  //     return
  //   }
  //   state.battle[place].exsupport.push(card)
  //
  //   console.log(`BATTLE_EXSUPPORT add ex-support ${place}`, card)
  //   console.dir(state.battle)
  // },
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
    battle.chain = battle.chain.concat(battle.attacker.exsupport, battle.defenser.exsupport)

    // console.log(`BATTLE_CALC chain `, state.battle.chain);

    R.forEach(x => {
      x.chain = [x.main, x.support]
      x.chain = x.chain.concat(x.exsupport)
    })([battle.attacker, battle.defenser])

    // console.log('battle',battle)
    // attacker
    let powerlist = []
    R.forEach(x => {
      if (x) {
        let anti = mutil.checkAnti(x.antipro, battle.defenser.main.antipro)
        let power = anti ? x.power2 : x.power1
        // FIXME:
        // card.power => is final power / isAntipro?
        // card.buffs = [] is buff list
        // fix this
        // basic power
        // powerlist.push(mutil.makepower(x, power, 'BASIC', anti ? '克制 power up' : '基本攻击'))
        // x.power.push(mutil.makepower(x, power, 'BASIC', anti ? '克制 power up' : '基本攻击'))
        powerlist.push(power)
        // plus buff power
        R.forEach(s => {
          powerlist.push(s.power)
        })(x.buffs)
      } else {
        console.warn('BATTLE_CALC attacker calc power object null')
      }
    })(battle.attacker.chain)

    //  make power list = basic power + buff power
    // battle.attacker.power = mutil.makeflat(battle.attacker.chain)
    // clone new list
    battle.attacker.power = powerlist
    console.log('attacker power ', battle.attacker.power)

    let totalAttacker = R.reduce(R.add, 0)(battle.attacker.power)
    battle.attacker = R.assoc('total', totalAttacker)(battle.attacker)

    console.log(`BATTLE_CALC totalAttacker ${battle.attacker.total}`)

    // defenser
    powerlist = []
    R.forEach(x => {
      if (x) {
        let anti = mutil.checkAnti(x.antipro, battle.attacker.main.antipro)
        let power = anti ? x.power2 : x.power1
        // x.power.push(mutil.makepower(x, power, 'BASIC', anti ? '克制 power up' : '基本攻击'))
        powerlist.push(power)
        R.forEach(s => {
          powerlist.push(s.power)
        })(x.buffs)
      } else {
        console.warn('BATTLE_CALC default calc power object null')
      }
    })(battle.defenser.chain)

    // battle.defenser.power = mutil.makeflat(battle.defenser.chain)
    battle.defenser.power = powerlist
    console.log('defenser power ', battle.defenser.power)

    let totalDefenser = R.reduce(R.add, 0)(battle.defenser.power)
    battle.defenser = R.assoc('total', totalDefenser)(battle.defenser)

    console.log(`BATTLE_CALC totalDefenser ${battle.defenser.total}`)
  },
  BATTLE_CALC2(state, {
    battle = state.battle,
    score = state.battle.score,
  } = {}) {
    console.log('BATTLE_CALC2 phase 2')

    // ------- attacker

    // battle.attacker.power = mutil.makeflat(battle.attacker.chain)
    console.log('attacker power ', battle.attacker.power)

    let totalAttacker = R.reduce(R.add, 0)(battle.attacker.power)
    // let totalAttacker = mutil.reducepower(battle.attacker.chain)
    battle.attacker = R.assoc('total', totalAttacker)(battle.attacker)

    console.log(`BATTLE_CALC2 totalAttacker ${battle.attacker.total}`)

    // ------- defenser

    // battle.defenser.power = mutil.makeflat(battle.defenser.chain)
    console.log('defenser power ', battle.defenser.power)

    let totalDefenser = R.reduce(R.add, 0)(battle.defenser.power)
    // let totalDefenser = mutil.reducepower(battle.defenser.chain)
    battle.defenser = R.assoc('total', totalDefenser)(battle.defenser)

    console.log(`BATTLE_CALC2 totalDefenser ${battle.defenser.total}`)
  },
  BATTLE_SCORE(state, {
    battle = state.battle,
    score = state.battle.score,
  } = {}) {

    console.log('commit BATTTLE_SCORE')
    let totalAttacker = battle.attacker.total
    let totalDefenser = battle.defenser.total
    // let totalAttacker = R.reduce(R.add, 0)(battle.attacker.power)
    // let totalDefenser = R.reduce(R.add, 0)(battle.defenser.power)

    // result & score
    if (totalAttacker == totalDefenser) {
      score.draw = true
      score.winside = 'draw'
      // TODO: add mark isWin/Lose/Draw mark
      mutil.addTag('isDraw',battle.attacker.main)
      mutil.addTag('isDraw',battle.attacker.support)
      mutil.addTag('isDraw',battle.defenser.main)
      mutil.addTag('isDraw',battle.defenser.support)
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
      // TODO: add mark isWin/Lose/Draw mark
      mutil.addTag('isWin',score.win.main)
      mutil.addTag('isWin',score.win.support)
      mutil.addTag('isLose',score.lose.main)
      mutil.addTag('isLose',score.lose.support)
      // console.log('tag check', score.win.main.play)
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
