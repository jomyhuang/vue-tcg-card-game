// import {
// 	getUser,
// 	getAddressList
// } from '../service/getData'
// import {
// 	GET_USERINFO,
// 	SAVE_ADDRESS
// } from './mutation-types.js'

import _ from 'lodash'
import R from 'ramda'
import mutil from '@/mutil'

export default {
  // game loop
  // GAME_START
  // GAME_WHO_FIRST
  // GAME_SET_FIRST_PLAYER
  // GAME_TURN_BEGIN
  // ...GAME_CHECK_GAMEOVER
  // GAME_DRAW
  // BATTLE_START
  // ...BATTLE_DECALRE_ATTACKER
  // ......BATTLE_EFFECT_DECALRE_ATTACKER
  // ...BATTLE_OPP_DECLARE_DEFENSER
  // ...BATTLE_PLAY_SUPPORTER
  // ...BATTLE_OPP_PLAY_SUPPORTER
  // ...BATTLE_EFFECT
  // ...BATTLE_EFFECT_CLEAR
  // BATTLE_END
  // ...GAME_CHECK_GAMEOVER
  // GAME_NEXT_TURN
  // GAME_SCOREBOARD
  // GAME_END
  GAME_TEMPLATE({
    commit,
    state,
    dispatch
  }) {
    return new Promise(function (resolve, reject) {
      console.log('GAME_TEMPLATE phase')
      resolve()
    })
  },
  GAME_PHASE({
    commit,
    state,
    dispatch
  },payload) {
    const phase = payload
    commit('GAME_PHASE',phase)
  },
  GAME_RESET({
    commit,
    state,
    dispatch
  }) {
    return new Promise(function (resolve, reject) {
      commit('GAME_RESET')
      resolve()
    })
  },
  GAME_WHO_FIRST({
    commit,
    state,
    dispatch
  }) {
    return new Promise(function (resolve, reject) {
      resolve(state.player1)
    })
  },
  GAME_SET_FIRSTPLAYER({
    commit,
    state,
    dispatch
  }, player) {
    return new Promise(function (resolve, reject) {
      commit('GAME_SET_FIRSTPLAYER', player)
      commit('GAME_SET_CURRENTPLAYER', player)
      resolve()
    })
  },
  GAME_START({
    commit,
    state,
    dispatch
  }) {
    // TODO: joining game, set deck, shuffle

    return new Promise(function (resolve, reject) {
      dispatch('GAME_PHASE','GAME_START')
      commit('GAME_SET', {
        started: true
      })
      commit('SELECT_PLAYER', state.player2)
      dispatch('DRAW', 5)
      dispatch('DRAW_TO_ZONE', 5)

      commit('SELECT_PLAYER', state.player1)
      dispatch('DRAW', 5)
      dispatch('DRAW_TO_ZONE', 5)
      resolve()
    })
  },
  GAME_TURN_BEGIN({
    commit,
    state,
    dispatch
  }) {
    return new Promise(function (resolve, reject) {
      dispatch('GAME_PHASE','GAME_TURN_BEGIN')
      commit('GAME_SET', {
        turnCount: state.game.turnCount + 1
      })
      commit('SELECT_PLAYER', state.currentPlayer)
      resolve()
    })
  },
  GAME_DRAW({
    commit,
    state,
    dispatch
  }) {
    return new Promise(function (resolve, reject) {
      dispatch('GAME_PHASE','GAME_DRAW')
      dispatch('DRAW', 1)
      resolve()
    })
  },
  BATTLE_START({
    commit,
    state,
    dispatch
  }, payload) {
    return new Promise(function (resolve, reject) {
      dispatch('GAME_PHASE','BATTLE_START')
      commit('BATTLE_START')
      resolve()
    })
  },
  BATTLE_DECALRE_ATTACKER({
    commit,
    state,
    dispatch
  }) {

    dispatch('GAME_PHASE','BATTLE_DECALRE_ATTACKER')

    return dispatch('PLAY_CARD', {
      phase: 'BATTLE_DECALRE_ATTACKER',
      selector: 'zone',
      // player: state.currentPlayer,
      // many: 1,
      selectedMuation: (state, card) => {
        state.storemsg = `select ${card.name}`
        card.name = card.name + '[A]'
        // card.play = R.assoc('isAttacker', true)(card.play)
      },
      // selectedAction: (state, card) => {
      //   commit('BATTLE_SET', {
      //     attacker: {
      //       main: card,
      //     }
      //   })
      //   commit('ADD_TAG', 'isAttacker')
      //   commit('SET_FACEUP')
      // },
      // thenAction: (state) => {
      //   commit('SELECT_PLAYER', state.currentPlayer)
      //   commit('SELECT_CARD', state.battle.attacker.main)
      //   dispatch('TIGGER_EFFECT', 'faceup')
      //   // dispatch('BATTLE_EFFECT_DECALRE_ATTACKER')
      //   // console.log('BATTLE_EFFECT_DECALRE_ATTACKER finish')
      // },
    }).then( async function(card) {
      commit('BATTLE_SET', {
        attacker: {
          main: card,
        }
      })
      commit('ADD_TAG', 'isAttacker')
      commit('ADD_TAG', 'faceup')
      commit('SET_FACEUP')

      // NEWEFFECT
      commit('ACTIVE_CARD', card)

      // FIXME: await effect
      // dispatch('EFFECT_SOURCE', state.battle.attacker.main)
      // dispatch('TIGGER_EFFECT', 'faceup')
      await mutil.tiggerEffect('faceup', state.battle.attacker.main)
    })
  },
  BATTLE_OPP_DECLARE_DEFENSER({
    commit,
    state,
    dispatch
  }) {

    dispatch('GAME_PHASE','BATTLE_OPP_DECLARE_DEFENSER')

    return dispatch('PLAY_CARD', {
      phase: 'BATTLE_OPP_DECLARE_DEFENSER',
      selector: 'opp_zone',
      // player: state.currentPlayer,
      selectedMuation: (state, card) => {
        state.storemsg = `select ${card.name}`
        card.name = card.name + '[D]'
        // card.play = R.assoc('isDefenser', true)(card.play)
      },
      // selectedAction: (state, card) => {
      //   commit('BATTLE_SET', {
      //     defenser: {
      //       main: card,
      //     }
      //   })
      //   commit('ADD_TAG', 'isDefenser')
      //   commit('SET_FACEUP')
      // },
      // thenAction: (state) => {
      //   commit('SELECT_PLAYER', state.opponentPlayer)
      //   commit('SELECT_CARD', state.battle.defenser.main)
      //   dispatch('TIGGER_EFFECT', 'faceup')
      //   commit('SELECT_PLAYER', state.currentPlayer)
      //   // console.log('BATTLE_OPP_DECLARE_DEFENSER finish')
      // },
    }).then( async function(card) {
      commit('BATTLE_SET', {
        defenser: {
          main: card,
        }
      })
      commit('ADD_TAG', 'isDefenser')
      commit('ADD_TAG', 'faceup')
      commit('SET_FACEUP')

      // NEWEFFECT
      commit('ACTIVE_CARD', card)

      // FIXME: await effect
      // dispatch('EFFECT_SOURCE', state.battle.defenser.main)
      // dispatch('TIGGER_EFFECT', 'faceup')
      await mutil.tiggerEffect('faceup', state.battle.defenser.main)

      commit('SELECT_PLAYER', state.currentPlayer)
      // console.log('BATTLE_OPP_DECLARE_DEFENSER finish')
    })
  },
  BATTLE_PLAY_SUPPORTER({
    commit,
    state,
    dispatch
  }) {
    dispatch('GAME_PHASE','BATTLE_PLAY_SUPPORTER')

    return dispatch('PLAY_CARD', {
      phase: 'BATTLE_PLAY_SUPPORTER',
      selector: 'hand',
      // player: state.currentPlayer,
      selectedMuation: (state, card) => {
        state.storemsg = `select ${card.name}`
        card.name = card.name + '[S]'
        // card.play = R.assoc('isSupporter', true)(card.play)
      },
      // selectedAction: (state, card) => {
      //   commit('BATTLE_SET', {
      //     attacker: {
      //       support: card,
      //     }
      //   })
      //   commit('ADD_TAG', 'isSupporter')
      // },
      // thenAction: (state, card) => {
      //   commit('PICK_CARD', state.battle.attacker.support)
      //   commit('TO_SUPPORTER')
      // },
    }).then( (card) => {
      commit('BATTLE_SET', {
        attacker: {
          support: card,
        }
      })
      commit('ADD_TAG', 'isSupporter')

      // NEWEFFECT
      commit('ACTIVE_CARD', card)

      commit('PICK_CARD', state.battle.attacker.support)
      commit('TO_SUPPORTER')
    })
  },
  BATTLE_OPP_PLAY_SUPPORTER({
    commit,
    state,
    dispatch
  }) {
    dispatch('GAME_PHASE','BATTLE_OPP_PLAY_SUPPORTER')

    return dispatch('OPP_PLAY_CARD', {
      phase: 'BATTLE_OPP_PLAY_SUPPORTER',
      selector: 'hand',
      selectedMuation: (state, card) => {
        state.storemsg = `select ${card.name}`
        card.name = card.name + '[S]'
        // card.play = R.assoc('isSupporter', true)(card.play)
      },
      // selectedAction: (state, card) => {
      //   commit('BATTLE_SET', {
      //     defenser: {
      //       support: card,
      //     }
      //   })
      //   commit('ADD_TAG', 'isSupporter')
      // },
      // thenAction: (state, card) => {
      //   commit('PICK_CARD', state.battle.defenser.support)
      //   commit('TO_SUPPORTER')
      // },
    }).then( (card) => {
      commit('BATTLE_SET', {
        defenser: {
          support: card,
        }
      })
      commit('ADD_TAG', 'isSupporter')

      // NEWEFFECT
      commit('ACTIVE_CARD', card)

      commit('PICK_CARD', state.battle.defenser.support)
      commit('TO_SUPPORTER')
    })
  },
  BATTLE_EFFECT({
    commit,
    state,
    dispatch
  }) {

    return new Promise(async (resolve, reject) => {

      dispatch('GAME_PHASE','BATTLE_EFFECT')
      console.info(`BATTLE_EFFECT begin----------------------`)
      // calc phase 1
      commit('BATTLE_CALC')

      // currentPlayer
      // dispatch('EFFECT_SOURCE', state.battle.attacker.main)
      // await dispatch('TIGGER_EFFECT', 'isAttacker')
      // dispatch('EFFECT_SOURCE', state.battle.attacker.main)
      // await dispatch('TIGGER_EFFECT', 'main')
      // dispatch('EFFECT_SOURCE', state.battle.attacker.support)
      // await dispatch('TIGGER_EFFECT', 'isSupporter')
      // dispatch('EFFECT_SOURCE', state.battle.attacker.support)
      // await dispatch('TIGGER_EFFECT', 'main')
      await mutil.tiggerEffect('isAttacker', state.battle.attacker.main)
      await mutil.tiggerEffect('main', state.battle.attacker.main)
      await mutil.tiggerEffect('isAttacker', state.battle.attacker.support)
      await mutil.tiggerEffect('main', state.battle.attacker.support)

      // finish then process ex-support

      // opponentPlayer
      // dispatch('EFFECT_SOURCE', state.battle.defenser.main)
      // await dispatch('TIGGER_EFFECT', 'isDefenser')
      // dispatch('EFFECT_SOURCE', state.battle.defenser.main)
      // await dispatch('TIGGER_EFFECT', 'main')
      // dispatch('EFFECT_SOURCE', state.battle.defenser.support)
      // await dispatch('TIGGER_EFFECT', 'isSupporter')
      // dispatch('EFFECT_SOURCE', state.battle.defenser.support)
      // await dispatch('TIGGER_EFFECT', 'main')
      await mutil.tiggerEffect('isDefenser', state.battle.defenser.main)
      await mutil.tiggerEffect('main', state.battle.defenser.main)
      await mutil.tiggerEffect('isSupporter', state.battle.defenser.support)
      await mutil.tiggerEffect('main', state.battle.defenser.support)

      // calc phase 2
      commit('BATTLE_CALC')
      // commit('BATTLE_CALC2')
      commit('BATTLE_SCORE')

      console.info(`BATTLE_EFFECT end------------`)
      resolve()
    })
  },
  BATTLE_EFFECT_CLEAR({
    commit,
    state,
    dispatch
  }) {

    return new Promise(function (resolve, reject) {
      dispatch('GAME_PHASE','BATTLE_EFFECT_CLEAR')

      console.log(`BATTLE_EFFECT_CLEAR start`)
      let battle = state.battle
      let score = state.battle.score
      if (score.draw) {
        console.log('battle draw clear');
        R.forEach(x => {
          // commit('SELECT_PLAYER', x.player)
          commit('PICK_CARD', x.main)
          commit('TO_GRAVEYARD')
          commit('PICK_CARD', x.support)
          commit('TO_GRAVEYARD')
        })([battle.attacker, battle.defenser])

        R.forEach( x => {
          commit('PICK_CARD',x)
          commit('TO_GRAVEYARD')
        })(battle.attacker.exsupport)

        R.forEach( x => {
          commit('PICK_CARD',x)
          commit('TO_GRAVEYARD')
        })(battle.defenser.exsupport)

      } else {
        let win = battle.score.win
        console.log('battle win clear',win)

        commit('PICK_CARD', win.main)
        let index = state.pickindex
        commit('TO_BASE')
        commit('PICK_CARD', win.support)
        commit('TO_ZONE', index)

        R.forEach( x => {
          // console.log('win exsupport pick')
          commit('PICK_CARD',x)
          commit('TO_BASE')
        })(win.exsupport)

        let lose = battle.score.lose
        console.log('battle lose clear',lose)

        commit('PICK_CARD', lose.main)
        commit('TO_GRAVEYARD')
        commit('PICK_CARD', lose.support)
        commit('TO_GRAVEYARD')

        R.forEach( x => {
          // console.log('lose exsupport pick')
          commit('PICK_CARD',x)
          commit('TO_GRAVEYARD')
        })(lose.exsupport)

        // clear scoreboard
        if(win.main.cardno===battle.attacker.main.cardno) {
          //  进攻方获胜
          console.log('进攻方获胜')
          commit('BATTLE_SET', {
            defenser: {
              main: null,
              support: null,
              exsupport: [],
            },
          })
        }
        else {
          //  防守方获胜
          console.log('防守方获胜')
          commit('BATTLE_SET', {
            attacker: {
              main: null,
              support: null,
              exsupport: [],
            }
          })
        }
      }

      console.log(`BATTLE_EFFECT_CLEAR clear play tag & buffs`)
      console.log('battle.chian',battle.chain)
      R.map((x) => {
        commit('CLEAR_TAG',x)
      })(battle.chain)

      if(state.player1.supporter.length >0 || state.player2.supporter.length >0) {
        throw new Error('player1/player2 supporter is not empty')
        return reject()
      }

      console.log(`BATTLE_EFFECT_CLEAR end`)
      resolve()
    })
  },
  BATTLE_END({
    commit,
    state,
    dispatch
  }) {

    return new Promise(function (resolve, reject) {
      dispatch('GAME_PHASE','BATTLE_END')
      console.log(`BATTLE_END`)
      resolve()
    })
  },
  GAME_NEXT_TURN({
    commit,
    state,
    dispatch
  }) {

    return new Promise(function (resolve, reject) {
      dispatch('GAME_PHASE','GAME_NEXT_TURN')
      commit('GAME_NEXT_PLAYER')
      // check slot
      if( mutil.checkslot() )
        resolve()
      else
        reject()
    })
  },
  GAME_CHECK_GAMEOVER({
    commit,
    state,
    dispatch
  }, payload) {

    return new Promise(function (resolve, reject) {
      dispatch('GAME_PHASE','GAME_CHECK_GAMEOVER')
      commit('GAME_CHECK_GAMEOVER')
      let gameover = state.game.over

      console.log(`GAME_CHECK_GAMEOVER ${gameover}`)
      if (gameover)
        reject(state.game.score.reason)
      else {
        resolve()
      }
    })
  },
  GAME_SCOREBOARD({
    commit,
    state,
    dispatch
  }) {

    return new Promise(function (resolve, reject) {
      dispatch('GAME_PHASE','GAME_SCOREBOARD')
      resolve()
    })
  },
  GAME_END({
    commit,
    state,
    dispatch
  }) {

    return new Promise(function (resolve, reject) {
      dispatch('GAME_PHASE','GAME_END')
      resolve()
    })
  },
}
