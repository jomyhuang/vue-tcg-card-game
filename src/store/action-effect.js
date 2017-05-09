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
  TIGGER_EFFECT({
    commit,
    state,
    dispatch
  }, payload) {

    let effect = payload
    let card = state.placeholder
    let player = card.owner
    let opponent = mutil.opponent(player)

    // 处理效果目标对象 owner, card...
    // select card owner
    if (card !== state.placeholder) {
      commit('SELECT_CARD', card)
      commit('SELECT_PLAYER', player)
      console.error(`TIGGER_EFFECT ${card.name} owner not equal currentPlayer`);
    }

    let funcdispatch = (type, payload) => {
      return () => dispatch(type, payload)
    }

    let funccommit = (type, payload) => {
      return () => commit(type, payload)
    }


    let funcbuff = (power = 0, tag) => {
      if (!R.isNil(effect) && R.isNil(tag) && power > 0) {
        tag = `${effect} UP +${power}`
      }
      let buff = {
        power: power,
        effect: effect,
        tag: tag,
        card: card,
      }
      card.power.push(buff)
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
      buff: funcbuff,
      rxdispatch: funcdispatch,
      rxcommit: funccommit,
    }

    // without condition check effect
    let condition
    const checklist = ['main']

    if (R.contains(effect)(checklist)) {
      condition = x => true
    }

    let effectfunc = mutil.callEffect(effect, effectpayload, condition)
    let result = effectfunc()

    // convert any vaule to pipe array
    let effectpipe = R.is(Array,result) ? result : [result]

    return new Promise(async function (resolve, reject) {

      // 如果是UI互动效果，这传回promise
      // await version foreach
      console.log('TIGGER_EFFECT result is effect pipe begin')
      for (let x of effectpipe) {
        if (_.isFunction(x)) {
          console.log(`effect pipe start`, x)
          await x.apply(card)
          console.log('await pipe finish next')
        } else {
          console.log(`effect pipe [not object/fucntion]`, x)
        }
      }
      console.log('TIGGER_EFFECT result is effect pipe finish');
      resolve()
    })
    // } else if (R.is(Object, result)) {
    //   // TODO: 判断返回特效／连续Chain
    //   console.error('TIGGER_EFFECT result is Object not apply', result)
    //   // result = R.assoc('effect', effect)(result)
    //   // return dispatch('ASYNC_ACT_SELECT_CARD_START', result)
    //   // test ramda pipe, but no support await
    //   // result()
    // }
    // return true
  },
  EFFECT_CHOICE({
    commit,
    state,
    dispatch
  }, payload) {

    if (R.is(String, payload)) {
      // console.log('EFFECT_CHOICE is string')
      payload = {
        list: payload
      }
    } else if (R.is(Array, payload)) {
      // console.log('EFFECT_CHOICE is array')
      payload = {
        list: payload
      }
    }

    // R.has 如果没有，会 throw error
    if (!_.has('list', payload)) {
      console.log('EFFECT_CHOICE payload no list key, select by placelist')
      // console.error('EFFECT_CHOICE payload no list key')
      // throw 'EFFECT_CHOICE no list for choice'
      // return false
    }

    payload = R.merge({
      phase: 'EFFECT_CHOICE',
      message: 'EFFECT_CHOICE',
      player: state.placeplayer,
      selectedMuation: (state, card) => {
        state.storemsg = `select ${card.name}`
        card.name = card.name + '[EF]'
        console.log('EFFECT_CHOICE selectedMuation')
      },
    })(payload)

    return dispatch('ASYNC_ACT_SELECT_CARD_START', payload)
  },

  // EFFECT_ACT_SELECTION({
  //   commit,
  //   state,
  //   dispatch
  // },payload) {
  //
  //   console.log('EFFECT_ACT_SELECTION effect phase')
  //
  //   let selectfunc = payload
  //   // TODO: 连续UI动作／连续Chain
  //   return dispatch('ASYNC_ACT_SELECT_CARD_START', selectfunc)
  // },
}
