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
      // buff: R.bind(mutil.addbuff, card),
      buff: funcbuff,
    }

    // without condition check effect
    let condition
    const checklist = ['main']

    if (R.contains(effect)(checklist)) {
      condition = x => true
    }

    let effectfunc = mutil.callEffect(effect, effectpayload, condition)
    let result
    result = effectfunc()

    // 如果是UI互动效果，这传回promise
    if (R.is(Object, result)) {
      // TODO: 判断返回特效／连续Chain
      console.log('TIGGER_EFFECT result is Object')
      result = R.assoc('effect', effect)(result)
      return dispatch('ASYNC_ACT_SELECT_CARD_START', result)
    }
    return true
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
