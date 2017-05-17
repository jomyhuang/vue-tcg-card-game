// import {
// 	getUser,
// 	getAddressList
// } from '../service/getData'
// import {
// 	GET_USERINFO,
// 	SAVE_ADDRESS
// } from './mutation-types.js'

import R from 'ramda'
import mutil from '@/mutil'
import {
  testfn
} from '@/mutil'
import $cx from '@/cardxflow'


export default {
  RAMDA_TEST({
    commit,
    state
  }, payload) {
    // commit('RAMDA_TEST', payload)
    console.log('RAMDA_TEST action result')
    // let card = state.player1.deck[0]
    // console.log(`test result ${card.name} ${card.play.info} ${card.play.tag}`)
    // console.log(mutil.convertPower('1亿2000万'));
    // console.log(mutil.convertPower('2000万'));
    // console.log(mutil.convertPower('2亿'));
    // console.log(mutil.convertPower('2'));
    // console.log(mutil.convertPower('万'));

  },
  GAME_INIT(store, payload) {

    // 从store中分离
    const {
      state,
      commit
    } = store

    commit('GAME_INIT', payload)
    console.log('action GAME_INIT', payload)
  },
  GAME_INIT_STORE({
    commit,
    state,
    dispatch
  }, payload) {

    // 将store实例传入mutil, _vm.this.$store
    // mutil.store = payload
    // console.log('action GAME_INIT_STORE keep store instance',mutil.store)

    // 将store实例传入mutil, _vm.this.$store
    // mixin
    // mutil.mixinEffect(payload)
    // console.log('action GAME_INIT_STORE keep store instance',mutil.$store)
    // testfn()
    $cx.install(payload)
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
  // async _WAIT_ACT_SYNC_SELECT_UI({
  //   commit,
  //   state,
  //   dispatch
  // }, checkfunc = () => true) {
  //
  //   const waitfunc = () => {
  //     return new Promise(function (resolve, reject) {
  //       setTimeout(() => {
  //         if (R.length(state.act_selection.selectedList) >= state.act_selection.many) {
  //           resolve()
  //         } else {
  //           reject()
  //         }
  //       }, 1000)
  //     })
  //   }
  //
  //   console.log('_WAIT_ACT_SYNC_SELECT_UI')
  //   let waiting = true
  //   while (waiting) {
  //     // let checkfunc = () => state.placeholder ? state.placeholder.star >= 4 : true
  //     await waitfunc().then((resolve) => {
  //       waiting = false
  //     }, (err) => {
  //       // run again
  //     })
  //     // await dispatch('_ACT_SYNC_SELECT_CHECK').then((resolve) => {
  //     //   // console.log('resolve')
  //     //   waiting = false
  //     // }, (err) => {
  //     //   // console.log('reject')
  //     //   // run again
  //     // })
  //   }
  // },
  ACT_SELECTED_CARD({
    dispatch,
    commit,
    state
  }, card) {

    console.log(`action ACT_SELECTED_CARD select ${card.name}`)

    commit('SELECT_CARD', card)
    commit('ACT_SET_SELECTED', card)

    // dispatch selected action
    if (state.act_selection.selectedAction) {
      // console.log( `ACT_SELECTED_CARD dispatch ${state.act_selection.action}` )
      // dispatch(state.act_selection.action,card)
      // console.log( `ACT_SELECTED_CARD selectedAction call` )
      state.act_selection.selectedAction(state, card)
    }
  },
  ASYNC_ACT_SELECT_CARD_START({
    commit,
    state,
    dispatch
  }, payload) {

    // console.log('ASYNC_ACT_SELECT_CARD_START', R.prop('finish', state.act_selection))

    // if(R.F(R.propEq('finish',true),state.act_selection)) {
    // 防止重复选择
    if (R.has('finish', state.act_selection)) {
      if (!state.act_selection['finish']) {
        console.error('ASYNC_ACT_SELECT_CARD_START not finish yet!!')
        throw 'error throw ASYNC_ACT_SELECT_CARD_START not finish yet!!'
        return false
      }
    }

    return new Promise(async function (resolve, reject) {
      // 注意：使用箭头函数不能是 async
      commit('_ACT_SELECTION_INIT', payload)

      if (state.act_selection.message)
        console.log(state.act_selection.message)

      let doselect = true
      if (R.length(state.act_selection.list) <= 0) {
        console.warn('ASYNC_ACT_SELECT_CARD_START list is empty no select')
        // reject()
        doselect = false
      }

      // let xLens = R.lensProp('init')
      // let xSel = R.view(xLens)(state.act_selection)

      // OK 1 for test
      // if (xSel) {
      //   const card = xSel
      //   dispatch('ACT_SELECTED_CARD', card)
      //   console.log('ASYNC_ACT_SELECT_CARD_START from [INIT]')
      // } else {
      if (doselect) {
        const agent = state.act_selection.agent
        let selectcard

        if (agent) {
          console.log('ASYNC_ACT_SELECT_CARD_START from [AGENT]')
          selectcard = agent.SELECT_CARD(state, payload)
          dispatch('ACT_SELECTED_CARD', selectcard)
          console.log('ASYNC_ACT_SELECT_CARD_START from [AGENT] OK')
          // TODO fix: agent 在测试模式下选择没有 actselection.list, selectedlist
        } else {
          console.log('ASYNC_ACT_SELECT_CARD_START from [UI]')
          // await dispatch('_WAIT_ACT_SYNC_SELECT_UI')
          // move from _WAIT_ACT_SYNC_SELECT_UI
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

          console.log('_WAIT_ACT_SYNC_SELECT_UI START BLOCKING')
          let waiting = true
          while (waiting) {
            await waitfunc().then((resolve) => {
              waiting = false
            }, (err) => {
              // run again
            })
          }
          // console.log('_WAIT_ACT_SYNC_SELECT_UI OK')
          console.log('ASYNC_ACT_SELECT_CARD_START from [UI] OK')

          selectcard = R.head(state.act_selection.selectedList)
        }

        commit('_ACT_FINISH')

        commit('SELECT_PLAYER', state.act_selection.player)
        // TODO fix: agent 在测试模式下选择没有 actselection.list, selectedlist
        mutil.assert(selectcard, 'assert ASYNC_ACT_SELECT_CARD_START is null')

        commit('SELECT_CARD', selectcard)

        // call thenAction
        if (state.act_selection.thenAction) {
          state.act_selection.thenAction(state,selectcard)
        }
      }

      resolve()
    })
  },
}
