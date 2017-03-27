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

export default {
  RAMDA_TEST({
    commit,
    state
  }, payload) {
    commit('RAMDA_TEST', payload)
    console.log('RAMDA_TEST action result')
    let card = state.player1.deck[0]
    console.log(`test result ${card.name} ${card.play.info} ${card.play.tag}`)

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
  }) {
    commit('GAME_INIT')
    console.log('action GAME_INIT')
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
  async ACT_SELECT_CARD_START({
    dispatch,
    commit,
    state
  }, payload) {

    commit('ACT_SELECTION', payload)

    let waiting = true
    while (waiting) {
      await dispatch('_ACT_SYNC_SELECT_CHECK').then((resolve) => {
        // console.log('resolve')
        waiting = false
      }, (err) => {
        // console.log('reject')
      })
    }
    console.log('ACT_SELECT_CARD_START AWAIT SYNC finish')

    // return dispatch('_ACT_SELECT_CARD_END')
    dispatch('_ACT_SELECT_CARD_END')
  },
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
  _ACT_SELECT_CARD_END({
    commit,
    state
  }) {

    commit('ACT_UNSELECTION')
    if (state.act_selection.thenAction) {
      // console.log( `ACT_SELECT_CARD_END thenAction call` )
      return state.act_selection.thenAction(state)
    }
  },
  async _ACT_SYNC_SELECT_CHECK({
    commit,
    state,
    dispatch
  }, checkfunc = () => true) {

    // console.log( '_ACT_SYNC_SELECT_CHECK' )
    return new Promise(function (resolve, reject) {
      setTimeout(() => {
        // console.log('hello promise check')
        // console.log(checkfunc())
        // if( !checkfunc(state) ) {
        //     commit('ACT_SET_SELECTED',false)
        //     reject()
        // }
        if (state.act_selection.selectedList.length >= state.act_selection.many) {
          resolve()
        } else {
          reject()
        }
      }, 1000)
    })
  },
  async _WAIT_ACT_SYNC_SELECT_CHECK({
    commit,
    state,
    dispatch
  }, checkfunc = () => true) {

    // console.log('_WAIT_ACT_SYNC_SELECT_CHECK')
    let waiting = true
    while (waiting) {
      // let checkfunc = () => state.placeholder ? state.placeholder.star >= 4 : true
      await dispatch('_ACT_SYNC_SELECT_CHECK').then((resolve) => {
        // console.log('resolve')
        waiting = false
      }, (err) => {
        // console.log('reject')
      })
    }
  },
  ASYNC_ACT_SELECT_CARD_START({
    commit,
    state,
    dispatch
  }, payload) {

    // console.log('ASYNC_ACT_SELECT_CARD_START')
    return new Promise(async function (resolve, reject) {
      // return new Promise( (resolve, reject) => {
      // 注意：使用箭头函数不能是 async
      commit('ACT_SELECTION', payload)

      // OK 1
      // const agent = payload.agent ? payload.agent : state.currentPlayer.agent
      const agent = state.act_selection.agent

      if (agent) {
        const card = agent.SELECT_CARD(state, payload)
        dispatch('ACT_SELECTED_CARD', card)
      } else {
        await dispatch('_WAIT_ACT_SYNC_SELECT_CHECK')
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
  // ...BATTLE_BATTLE_EFFECT
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
  GAME_CHECK_GAMEOVER({
    commit,
    state,
    dispatch
  }) {
    return new Promise(function (resolve, reject) {
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
  }) {
    return new Promise(function (resolve, reject) {
      commit('BATTLE_INIT')
      resolve()
    })
  },
  BATTLE_DECALRE_ATTACKER({
    commit,
    state,
    dispatch
  }) {
    const selectfunc = {
      phase: 'BATTLE_DECALRE_ATTACKER',
      list: 'zone',
      many: 1,
      agent: state.currentPlayer.agent,
      selectedMuation: (state, card) => {
        state.storemsg = `select ${card.name}`
        card.name = card.name + '**'
      },
      selectedAction: (state, card) => {
        commit('BATTLE_SET', {
          attacker: {
            main: card,
          }
        })
        // commit('SET_FACEUP')
        dispatch('BATTLE_EFFECT_DECALRE_ATTACKER')
      },
      thenAction: (state) => {
        // console.log('BATTLE_EFFECT_DECALRE_ATTACKER finish')
      },
    }
    const agent = state.currentPlayer.agent

    if (agent) {
      agent.TALK(state, 'agent talk TEST!!')
    }

    return new Promise(async function (resolve, reject) {
      await dispatch('ASYNC_ACT_SELECT_CARD_START', selectfunc)
        .then(() => {
          // note!
          // console.log('BATTLE_DECALRE_ATTACKER promise.then finish')
        })
      resolve()
    })
  },
  BATTLE_EFFECT_DECALRE_ATTACKER({
    commit,
    state,
    dispatch
  }) {
    return new Promise(function (resolve, reject) {
      commit('SET_FACEUP')
      console.log('BATTLE_EFFECT_DECALRE_ATTACKER phase')
      resolve()
    })
  },
  BATTLE_OPP_DECLARE_DEFENSER({
    commit,
    state,
    dispatch
  }) {
    return new Promise(async function (resolve, reject) {
      await dispatch('ASYNC_ACT_SELECT_CARD_START', {
        list: state.opponentPlayer.zone,
        many: 1,
        phase: 'BATTLE_OPP_DECLARE_DEFENSER',
        agent: state.currentPlayer.agent,
        selectedMuation: (state, card) => {
          state.storemsg = `select ${card.name}`
          card.name = card.name + '**'
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
          // console.log('BATTLE_OPP_DECLARE_DEFENSER finish')
        },
      }).then(() => {
        // note!
        // console.log('BATTLE_OPP_DECLARE_DEFENSER promise.then finish')
      })

      resolve()
    })
  },
  BATTLE_PLAY_SUPPORTER({
    commit,
    state,
    dispatch
  }) {
    return new Promise(async function (resolve, reject) {
      await dispatch('ASYNC_ACT_SELECT_CARD_START', {
        list: 'hand',
        many: 1,
        phase: 'BATTLE_PLAY_SUPPORTER',
        agent: state.currentPlayer.agent,
        selectedMuation: (state, card) => {
          state.storemsg = `select ${card.name}`
          card.name = card.name + '**'
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
      }).then(() => {
        // note!
        // console.log('BATTLE_PLAY_SUPPORTER promise.then finish')
      })

      resolve()
    })
  },
  BATTLE_OPP_PLAY_SUPPORTER({
    commit,
    state,
    dispatch
  }) {
    return new Promise(async function (resolve, reject) {
      await dispatch('ASYNC_ACT_SELECT_CARD_START', {
        list: state.opponentPlayer.hand,
        many: 1,
        phase: 'BATTLE_OPP_PLAY_SUPPORTER',
        agent: state.opponentPlayer.agent,
        selectedMuation: (state, card) => {
          state.storemsg = `select ${card.name}`
          card.name = card.name + '**'
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
      }).then(() => {
        // note!
        // console.log(`BATTLE_OPP_PLAY_SUPPORTER dispatch promise.then finish')
      })

      resolve()
    })
  },
  BATTLE_END({
    commit,
    state,
    dispatch
  }) {
    return new Promise(function (resolve, reject) {
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
