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
import $cx from '@/cardxflow'

export default {
  EFFECT_CONTEXT_INIT({
    commit,
    state,
    dispatch
  }, payload) {
    commit('EFFECT_SET',{})
    commit('EFFECT_SET',{
      loop: true,
    })
    commit('EFFECT_SET',payload)
    console.log(`EFFECT_CONTEXT_INIT`,state.effect)
  },
  EFFECT_SOURCE({
    commit,
    state,
    dispatch
  }, payload) {
    const card = payload
    const owner = card.owner
    commit('SELECT_PLAYER', owner)
    commit('SELECT_CARD', card)
    console.log(`EFFECT_SOURCE select ${card.name} owner ${owner.id}`);
  },
  TIGGER_EFFECT({
    commit,
    state,
    dispatch
  }, payload) {

    if (R.isNil(state.placeholder)) {
      console.warn(`TIGGER_EFFECT placeholder is null skip`)
      return false
    }

    const type = payload
    const phase = state.game.phase
    const card = state.placeholder
    const player = card.owner
    const opponent = mutil.opponent(player)

    // without condition check effect 不需要 tag check
    let condition
    const checklist = ['main']

    if (R.contains(type)(checklist)) {
      condition = (card, type) => true
    } else {
      condition = (card, type) => R.path(['play', type])(card)
    }

    if (!condition(card, type)) {
      console.log(`card without ${type} status key skip`);
      return false
    }

    let effectfunc = R.path(['effect', type])(card)
    if (!effectfunc) {
      console.log(`card without effect func ${type} skip`)
      return false
    }

    let context = {
      text: 'effect context',
      type: type,
      phase: state.game.phase,
      source: card,
      card: card,
      player: player,
      opponent: opponent,
      state: state,
      loop: true,
      UImode: false,
      cx: $cx,
    }

    // console.group()
    console.log(`TIGGER_EFFECT => ${card.cardno} %c${type} effect action`, 'color:blue')
    // console.log(effectfunc())

    return mutil.tcall(effectfunc,context,context)
    // return effectfunc().call(context,context)
  },
  EFFECT_CHOICE({
    commit,
    state,
    dispatch
  }, payload) {

    if (!R.isNil(payload)) {
      payload = {
        list: payload
      }
    }

    // if (R.is(String, payload) || R.is(Array, payload) ) {
    //   // console.log('EFFECT_CHOICE is string')
    //   payload = {
    //     list: payload
    //   }
    // }

    // R.has 如果没有，会 throw error
    // if (!_.has('list', payload)) {
    //   console.log('EFFECT_CHOICE payload no list key, select by placelist')
    //   // console.error('EFFECT_CHOICE payload no list key')
    //   // throw 'EFFECT_CHOICE no list for choice'
    //   // return false
    // }

    payload = R.merge({
      phase: 'EFFECT_CHOICE',
      message: 'EFFECT_CHOICE',
      // player: state.currentPlayer,
      player: state.placeplayer,
      selectedMuation: (state, card) => {
        state.storemsg = `EFFECT_CHOICE ${state.placeplayer.id} select ${card.name}`
        card.name = card.name + '[效果指定]'
      },
      choiceUI: true,
      source: R.prop('source',$cx.context),
      // many: 2,
    })(payload)

    if(R.is(String, R.prop('list',payload))) {
      payload = R.assoc('message', payload.player.id + '从【'+R.prop('list',payload)+'】选择')(payload)
      // console.log(payload.message);
    }

    console.log('EFFECT_CHOICE do ', payload)
    return dispatch('ASYNC_ACT_SELECT_CARD_START', payload)
  },
  EFFECT_OPP_CHOICE({
    commit,
    state,
    dispatch
  }, payload) {

    if (!R.isNil(payload)) {
      payload = {
        list: payload
      }
    }

    const oppplayer = mutil.opponent(state.placeplayer)

    payload = R.merge({
      phase: 'EFFECT_OPP_CHOICE',
      message: 'EFFECT_OPP_CHOICE',
      player: oppplayer,
      selectedMuation: (state, card) => {
        state.storemsg = `EFFECT_OPP_CHOICE ${oppplayer} select ${card.name}`
        card.name = card.name + '[OPP效果指定]'
      },
      // choiceUI: true,
      source: R.prop('source',$cx.context),
    })(payload)

    if(R.is(String, R.prop('list',payload))) {
      payload = R.assoc('message', payload.player.id + ' 对方从【'+R.prop('list',payload)+'】选择')(payload)
    }

    // return dispatch('ASYNC_ACT_SELECT_CARD_START', payload).then( ()=> {
    //   console.log('EFFECT_OPP_CHOICE finish return select currentPlayer')
    //   commit('SELECT_PLAYER',state.currentPlayer)
    // })
    console.log('EFFECT_OPP_CHOICE do ', payload)
    return dispatch('ASYNC_ACT_SELECT_CARD_START', payload)
  },
}
