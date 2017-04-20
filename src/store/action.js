// import {
// 	getUser,
// 	getAddressList
// } from '../service/getData'
// import {
// 	GET_USERINFO,
// 	SAVE_ADDRESS
// } from './mutation-types.js'

import _ from 'underscore'
import R from 'ramda'
import mutil from '@/mutil'

export default {
  RAMDA_TEST({
    commit,
    state
  }, payload) {
    // commit('RAMDA_TEST', payload)
    console.log('RAMDA_TEST action result')
    // let card = state.player1.deck[0]
    // console.log(`test result ${card.name} ${card.play.info} ${card.play.tag}`)
    console.log(mutil.convertPower('1亿2000万'));
    // console.log(mutil.convertPower('2000万'));
    // console.log(mutil.convertPower('2亿'));
    // console.log(mutil.convertPower('2'));
    // console.log(mutil.convertPower('万'));

  },
  INIT_DB({
    commit,
    state
  }) {
    commit('INIT_DB')
    commit('FETCH_REFRESH')
    console.log('action INIT_DB')
  },
  // paging APP ------------------------------------------------
  FETCH_REFRESH({
    commit,
    state
  }, pagePerItems = 10) {
    commit('FETCH_REFRESH', {
      pagePerItems: pagePerItems,
      filter: state.pageFilter
    })
    commit('FETCH_PAGE', 1)
    console.log('action FETCH_REFRESH')
  },
  FETCH_PAGE({
    commit,
    state
  }, pageno = 1) {
    commit('FETCH_PAGE', pageno)
    console.log('action FETCH_PAGE finish key count:', state.pageKeyList.length, 'fetech page:', pageno)
  },
  PAGE_NEXT({
    commit,
    state
  }, step = 1) {
    commit('FETCH_PAGE', state.pageCurrent + step)
    console.log('action page_next', state.pageCurrent)
  },
  PAGE_FILTER({
    commit,
    state
  }, val = 0) {
    let filter = val > 0 ? 'cost' : 'all'
    // let func = eval( `(n) => n.cost == ${val}` )
    // condition string makes condition
    let condition = `n.star == ${val}`
    commit('FETCH_REFRESH', {
      pagePerItems: state.pagePerItems,
      filter: filter,
      // filterfunc: func } ) // OK!
      filterfunc: (n) => eval(condition)
    }) // OK!
    // filterfunc: (n) => n.cost == val } )
    commit('FETCH_PAGE', 1)
    console.log('action PAGE_FILTER', filter)
    // console.log( 'val2', val2 )
  },
  FETCH_SCROLL_NEXT({
    commit,
    state
  }) {
    commit('FETCH_SCROLL_NEXT')
    console.log('action FETCH_SCROLL_NEXT')
  },
  // end of paging APP ------------------------------------------------
  GAME_INIT({
    commit,
    state
  }, payload = undefined) {
    commit('GAME_INIT', payload)
    console.log('action GAME_INIT', payload)
  },
  GAME_RESET({
    commit,
    state
  }) {
    commit('GAME_RESET')
    console.log('action GAME_RESET')
  },
  // SELECT_PLAYER( { commit, state }, player ) {
  //   commit( 'SELECT_PLAYER', player )
  //   console.log( 'action SELECT_PLAYER' )
  // },
  // SELECT_CARDLIST( { commit, state }, list ) {
  //   commit( 'SELECT_CARDLIST', list )
  //   console.log( 'action SELECT_CARDLIST' )
  // },
  DRAW({
    commit,
    state
  }, many = 1) {
    for (let i = 0; i < many; i++) {
      commit('DRAW')
      commit('TO_HAND')
    }
    console.log('action DRAW CARDS', many)
  },
  DRAW_TO_ZONE({
    commit,
    state
  }, many = 1) {
    for (let i = 0; i < many; i++) {
      commit('DRAW')
      commit('SET_FACEDOWN')
      commit('TO_ZONE')
    }
    console.log('action DRAW CARDS TO zone', many)
  },
  SET_FACEUP({
    commit,
    state
  }, card) {
    commit('SELECT_CARD', card)
    commit('SET_FACEUP')
    commit('SELECT_CARD', null)
    console.log('action SET_FACEUP')
  },
  // async ACT_SELECT_CARD_START({
  //   dispatch,
  //   commit,
  //   state
  // }, payload) {
  //
  //   commit('ACT_SELECTION', payload)
  //
  //   let waiting = true
  //   while (waiting) {
  //     await dispatch('_ACT_SYNC_SELECT_CHECK').then((resolve) => {
  //       // console.log('resolve')
  //       waiting = false
  //     }, (err) => {
  //       // console.log('reject')
  //     })
  //   }
  //   console.log('ACT_SELECT_CARD_START AWAIT SYNC finish')
  //
  //   // return dispatch('_ACT_SELECT_CARD_END')
  //   dispatch('_ACT_SELECT_CARD_END')
  // },
  // 带入 dispatch
  ACT_SELECTED_CARD({
    dispatch,
    commit,
    state
  }, card) {

    console.log(`action ACT_SELECTED_CARD ${card.name}`)

    commit('SELECT_CARD', card)
    commit('ACT_SET_SELECTED')

    // dispatch selected action
    if (state.act_selection.selectedAction) {
      // console.log( `ACT_SELECTED_CARD dispatch ${state.act_selection.action}` )
      // dispatch(state.act_selection.action,card)
      // console.log( `ACT_SELECTED_CARD selectedAction call` )
      state.act_selection.selectedAction(state, card)
    }
  },
  // async _ACT_SYNC_SELECT_CHECK({
  //   commit,
  //   state,
  //   dispatch
  // }, checkfunc = () => true) {
  //
  //   // console.log( '_ACT_SYNC_SELECT_CHECK' )
  //   return new Promise(function (resolve, reject) {
  //     setTimeout(() => {
  //       // console.log('hello promise check')
  //       // console.log(checkfunc())
  //       // if( !checkfunc(state) ) {
  //       //     commit('ACT_SET_SELECTED',false)
  //       //     reject()
  //       // }
  //       // if (state.act_selection.selectedList.length >= state.act_selection.many) {
  //       if (R.length(state.act_selection.selectedList) >= state.act_selection.many) {
  //         resolve()
  //       } else {
  //         reject()
  //       }
  //     }, 1000)
  //   })
  // },
  async _WAIT_ACT_SYNC_SELECT_UI({
    commit,
    state,
    dispatch
  }, checkfunc = () => true) {

    const waitfunc = () => {
      return new Promise(function (resolve, reject) {
        setTimeout(() => {
          if (R.length(state.act_selection.selectedList) >= state.act_selection.many) {
            resolve()
          } else {
            reject()
          }
        }, 1000)
      })
    }

    console.log('_WAIT_ACT_SYNC_SELECT_UI')
    let waiting = true
    while (waiting) {
      // let checkfunc = () => state.placeholder ? state.placeholder.star >= 4 : true
      await waitfunc().then((resolve) => {
        waiting = false
      }, (err) => {
        // run again
      })
      // await dispatch('_ACT_SYNC_SELECT_CHECK').then((resolve) => {
      //   // console.log('resolve')
      //   waiting = false
      // }, (err) => {
      //   // console.log('reject')
      //   // run again
      // })
    }
  },
  ASYNC_ACT_SELECT_CARD_START({
    commit,
    state,
    dispatch
  }, payload) {

    console.log('ASYNC_ACT_SELECT_CARD_START', R.prop('finish',state.act_selection))

    // if(R.F(R.propEq('finish',true),state.act_selection)) {
    // 防止重复选择
    if(R.has('finish',state.act_selection)) {
      if(!state.act_selection['finish']) {
        console.error('ASYNC_ACT_SELECT_CARD_START not finish yet!!')
        return false
      }
    }

    return new Promise(async function (resolve, reject) {
      // return new Promise( (resolve, reject) => {
      // 注意：使用箭头函数不能是 async
      commit('ACT_SELECTION', payload)

      let xLens = R.lensProp('init')
      let xSel = R.view(xLens)(state.act_selection)

      // OK 1 for test
      if (xSel) {
        const card = xSel
        dispatch('ACT_SELECTED_CARD', card)
        console.log('ASYNC_ACT_SELECT_CARD_START from [INIT]')
      } else {
        const agent = state.act_selection.agent

        if (agent) {
          console.log('ASYNC_ACT_SELECT_CARD_START from [AGENT]')
          const card = agent.SELECT_CARD(state, payload)
          dispatch('ACT_SELECTED_CARD', card)
        } else {
          console.log('ASYNC_ACT_SELECT_CARD_START from [UI]')
          await dispatch('_WAIT_ACT_SYNC_SELECT_UI')
          console.log('ASYNC_ACT_SELECT_CARD_START from [UI] OK')
        }
      }

      // OK 2
      // let waiting = true
      // while( waiting ) {
      //   await dispatch('_ACT_SYNC_SELECT_CHECK').then( (resolve) => {
      //     // console.log('resolve')
      //     waiting = false
      //   }, (err) => {
      //     // console.log('reject')
      //   } )
      // }
      dispatch('_ACT_SELECT_CARD_END')
      resolve()
    })
  },
  _ACT_SELECT_CARD_END({
    commit,
    state
  }) {

    commit('ACT_UNSELECTION')
    if (state.act_selection.thenAction) {
      // console.log( `ACT_SELECT_CARD_END thenAction call` )
      state.act_selection.thenAction(state)
    }
    commit('ACT_FINISH')
  },
  TIGGER_EFFECT({
    commit,
    state,
    dispatch
  }, payload) {
    return new Promise(function (resolve, reject) {

      let effect = payload
      let card = state.placeholder
      let player = card.owner
      let opponent = mutil.opponent(player)
      // console.warn(`[TIGGER_EFFECT] ${effect}`);

      // 处理效果目标对象 owner, card...
      // select card owner
      if( card !== state.placeholder ) {
        commit('SELECT_CARD',card)
        commit('SELECT_PLAYER',player)
        console.error(`TIGGER_EFFECT ${card.name} owner not equal currentPlayer`);
      }

      let effectbuff = (power=0, tag) => {
        if (!R.isNil(effect) && R.isNil(tag) && power > 0) {
          tag = `${effect} UP +${power}`
        }
        let buff = {
          power: power,
          effect: effect,
          tag: tag,
          card: card,
        }
        card.power.push( buff )
        return buff
      }

      let effectpayload = {
        effect: effect,
        card: card,
        player: player,
        opponent: opponent,
        commit: commit,
        state: state,
        dispatch: dispatch,
        // buff: R.bind(mutil.addbuff, card),
        buff: effectbuff,
      }

      let condition
      // without condition check effect
      const checklist = ['main']

      if (R.contains(effect)(checklist)) {
        condition = x => true
      }

      let result = mutil.callEffect(effect, effectpayload, condition)

      // restore card
      commit('SELECT_CARD',card)

      resolve(result)
    })
  },
  EFFECT_ACT_SELECTION({
    commit,
    state,
    dispatch
  },payload) {

    console.log('EFFECT_ACT_SELECTION phase')

    let selectfunc = payload
    return dispatch('ASYNC_ACT_SELECT_CARD_START', selectfunc)
  },
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
      commit('BATTLE_INIT', payload)
      resolve()
    })
  },
  BATTLE_DECALRE_ATTACKER({
    commit,
    state,
    dispatch
  }) {
    let xLens = R.lensPath(['battle', 'attacker', 'main'])
    let xSel = R.view(xLens)(state.test)

    const selectfunc = {
      phase: 'BATTLE_DECALRE_ATTACKER',
      list: state.currentPlayer.zone,
      player: state.currentPlayer,
      many: 1,
      // agent: state.currentPlayer.agent,
      init: xSel,
      selectedMuation: (state, card) => {
        state.storemsg = `select ${card.name}`
        card.name = card.name + '[A]'
        card.play = R.assoc('isAttacker', true)(card.play)
      },
      selectedAction: (state, card) => {
        commit('BATTLE_SET', {
          attacker: {
            main: card,
          }
        })
        commit('SET_FACEUP')
      },
      thenAction: (state) => {
        commit('SELECT_PLAYER', state.currentPlayer)
        commit('SELECT_CARD', state.battle.attacker.main)
        dispatch('TIGGER_EFFECT', 'faceup')
        // dispatch('BATTLE_EFFECT_DECALRE_ATTACKER')
        // console.log('BATTLE_EFFECT_DECALRE_ATTACKER finish')
      },
    }
    // const agent = state.currentPlayer.agent
    // if (agent) {
    //   agent.TALK(state, 'agent talk TEST!!')
    // }

    // return new Promise(async function (resolve, reject) {
    return dispatch('ASYNC_ACT_SELECT_CARD_START', selectfunc)
    //     .then(() => {
    //       // note!
    //       // console.log('BATTLE_DECALRE_ATTACKER promise.then finish')
    //     })
    //   resolve()
    // })
  },
  // BATTLE_EFFECT_DECALRE_ATTACKER({
  //   commit,
  //   state,
  //   dispatch
  // }) {
  //   return new Promise(function (resolve, reject) {
  //     // commit('SET_FACEUP')
  //     console.warn('BATTLE_EFFECT_DECALRE_ATTACKER phase to do')
  //     resolve()
  //   })
  // },
  BATTLE_OPP_DECLARE_DEFENSER({
    commit,
    state,
    dispatch
  }) {
    // return new Promise(async function (resolve, reject) {
      let xLens = R.lensPath(['battle', 'defenser', 'main'])
      let xSel = R.view(xLens)(state.test)

      return dispatch('ASYNC_ACT_SELECT_CARD_START', {
        list: state.opponentPlayer.zone,
        player: state.currentPlayer,
        many: 1,
        phase: 'BATTLE_OPP_DECLARE_DEFENSER',
        // agent: state.currentPlayer.agent,
        init: xSel,
        selectedMuation: (state, card) => {
          state.storemsg = `select ${card.name}`
          card.name = card.name + '[D]'
          card.play = R.assoc('isDefenser', true)(card.play)
        },
        selectedAction: (state, card) => {
          commit('BATTLE_SET', {
            defenser: {
              main: card,
            }
          })
          commit('SET_FACEUP')
        },
        thenAction: (state) => {
          commit('SELECT_PLAYER', state.opponentPlayer)
          commit('SELECT_CARD', state.battle.defenser.main)
          dispatch('TIGGER_EFFECT', 'faceup')
          commit('SELECT_PLAYER', state.currentPlayer)
          // console.log('BATTLE_OPP_DECLARE_DEFENSER finish')
        },
      })
    //   }).then(() => {
    //     // note!
    //     // console.log('BATTLE_OPP_DECLARE_DEFENSER promise.then finish')
    //   })
    //
    //   resolve()
    // })
  },
  BATTLE_PLAY_SUPPORTER({
    commit,
    state,
    dispatch
  }) {
    let xLens = R.lensPath(['battle', 'attacker', 'support'])
    let xSel = R.view(xLens)(state.test)

    // return new Promise(async function (resolve, reject) {
      return dispatch('ASYNC_ACT_SELECT_CARD_START', {
        list: state.currentPlayer.hand,
        player: state.currentPlayer,
        many: 1,
        phase: 'BATTLE_PLAY_SUPPORTER',
        // agent: state.currentPlayer.agent,
        init: xSel,
        selectedMuation: (state, card) => {
          state.storemsg = `select ${card.name}`
          card.name = card.name + '[S]'
          card.play = R.assoc('isSupporter', true)(card.play)
        },
        selectedAction: (state, card) => {
          commit('BATTLE_SET', {
            attacker: {
              support: card,
            }
          })
        },
        thenAction: (state) => {
          // console.log('BATTLE_PLAY_SUPPORTER finish')
        },
      })
      // }).then(() => {
      //   // note!
      //   // console.log('BATTLE_PLAY_SUPPORTER promise.then finish')
      // })
      //
      // resolve()
  },
  BATTLE_OPP_PLAY_SUPPORTER({
    commit,
    state,
    dispatch
  }) {
    let xLens = R.lensPath(['battle', 'defenser', 'support'])
    let xSel = R.view(xLens)(state.test)

    // return new Promise(async function (resolve, reject) {
      return dispatch('ASYNC_ACT_SELECT_CARD_START', {
        list: state.opponentPlayer.hand,
        player: state.opponentPlayer,
        many: 1,
        phase: 'BATTLE_OPP_PLAY_SUPPORTER',
        // agent: state.opponentPlayer.agent,
        init: xSel,
        selectedMuation: (state, card) => {
          state.storemsg = `select ${card.name}`
          card.name = card.name + '[S]'
          card.play = R.assoc('isSupporter', true)(card.play)
        },
        selectedAction: (state, card) => {
          commit('BATTLE_SET', {
            defenser: {
              support: card,
            }
          })
        },
        thenAction: (state) => {
          // console.log('BATTLE_OPP_PLAY_SUPPORTER finish')
        },
      // }).then(() => {
        // note!
        // console.log(`BATTLE_OPP_PLAY_SUPPORTER dispatch promise.then finish')
      })
      // resolve()
    // })
  },
  BATTLE_EFFECT({
    commit,
    state,
    dispatch
  }) {
    return new Promise(async function (resolve, reject) {
      console.log(`BATTLE_EFFECT begin`)
      commit('BATTLE_CALC')

      commit('SELECT_PLAYER', state.currentPlayer)
      commit('SELECT_CARD', state.battle.attacker.main)
      await dispatch('TIGGER_EFFECT', 'isAttacker')
      dispatch('TIGGER_EFFECT', 'main')
      commit('SELECT_CARD', state.battle.attacker.support)
      dispatch('TIGGER_EFFECT', 'isSupporter')
      dispatch('TIGGER_EFFECT', 'main')

      commit('SELECT_PLAYER', state.opponentPlayer)
      commit('SELECT_CARD', state.battle.defenser.main)
      dispatch('TIGGER_EFFECT', 'isDefenser')
      dispatch('TIGGER_EFFECT', 'main')
      commit('SELECT_CARD', state.battle.defenser.support)
      dispatch('TIGGER_EFFECT', 'isSupporter')
      dispatch('TIGGER_EFFECT', 'main')

      commit('BATTLE_CALC2')

      commit('BATTLE_SCORE')
      console.log(`BATTLE_EFFECT end`)
      resolve()
    })
  },
  BATTLE_EFFECT_CLEAR({
    commit,
    state,
    dispatch
  }) {
    return new Promise(function (resolve, reject) {
      console.log(`BATTLE_EFFECT_CLEAR start`)
      let battle = state.battle
      let score = state.battle.score
      if (score.draw) {
        console.log('battle draw clear');
        R.forEach(x => {
          commit('SELECT_PLAYER', x.player)
          commit('PICK_CARD', x.main)
          commit('TO_GRAVEYARD')
          commit('PICK_CARD', x.support)
          commit('TO_GRAVEYARD')
        })([battle.attacker, battle.defenser])
      } else {
        console.log('battle win clear');
        let win = battle.score.win
        commit('SELECT_PLAYER', win.player)
        commit('PICK_CARD', win.main)
        let index = state.pickindex
        commit('TO_BASE')
        commit('PICK_CARD', win.support)
        commit('TO_ZONE', index)

        console.log('battle lose clear');
        let lose = battle.score.lose
        commit('SELECT_PLAYER', lose.player)
        commit('PICK_CARD', lose.main)
        commit('TO_GRAVEYARD')
        commit('PICK_CARD', lose.support)
        commit('TO_GRAVEYARD')
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
      commit('GAME_NEXT_PLAYER')
      resolve()
    })
  },
  GAME_CHECK_GAMEOVER({
    commit,
    state,
    dispatch
  }, payload) {
    return new Promise(function (resolve, reject) {
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
      resolve()
    })
  },
  GAME_END({
    commit,
    state,
    dispatch
  }) {
    return new Promise(function (resolve, reject) {
      resolve()
    })
  },
}
