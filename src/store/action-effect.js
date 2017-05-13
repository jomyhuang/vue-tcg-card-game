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

    let type = payload
    let card = state.placeholder
    let player = card.owner
    let opponent = mutil.opponent(player)

    // 处理效果目标对象 owner, card...
    // select card owner
    if (card !== state.placeholder) {
      commit('SELECT_CARD', card)
      commit('SELECT_PLAYER', player)
      console.error(`TIGGER_EFFECT ${card.name} 发动效果不等于 placeholder`)
      throw '发动效果卡不等于 placeholder'
    }

    // console.log('TIGGER_EFFECT this',this);

    const funcdispatch = (type, payload) => {
      return () => dispatch(type, payload)
    }

    const funccommit = (type, payload) => {
      return () => commit(type, payload)
    }

    const tap = () => {
      return () => console.log('tap this',this)
    }

    const funcrx = (type, payload) => {
      const store = mutil.store
      return store._actions[type] ? funcdispatch(type, payload) : funccommit(type, payload)
    }

    const funcbuff = (power = 0, tag) => {
      if (!R.isNil(type) && R.isNil(tag) && power > 0) {
        tag = `${type} UP +${power}`
      }
      let buff = {
        power: power,
        type: type,
        tag: tag,
        // card: card,
        source: card,
      }
      // card.power.push(buff)
      commit('CARD_ADD_BUFF', buff)
      return buff
    }

    const funcpipe = (...items) => {
      // let pipearr = []
      // items.forEach( (effect) => {
      //   pipearr.push(effect)
      // })
      return items
    }

    let effectpack = {
      store: mutil.store,
      type: type,
      card: card,
      player: player,
      opponent: opponent,
      commit: commit,
      state: state,
      dispatch: dispatch,
      buff: funcbuff,
      rxdispatch: funcdispatch,
      rxcommit: funccommit,
      rx: funcrx,
      pipe: funcpipe,
      tap: tap,
    }

    // without condition check effect
    let condition
    const checklist = ['main']

    if (R.contains(type)(checklist)) {
      condition = (card, type) => true
    } else {
      condition = (card, type) => R.path(['play', type])(card)
    }

    if (!condition(card, type)) {
      console.log(`card without ${type} status key`);
      return false
    }

    let effectfunc = R.path(['effect', type])(card)
    if (!effectfunc) {
      console.log(`card without effect func ${type}`);
      return false
    }
    // console.log('effectfunc', effectfunc)

    let result = effectfunc.call(card, effectpack)

    // callEffect replace
    // let effectfunc = mutil.callEffect(effect, effectpayload, condition)
    // let result = effectfunc()

    // convert any vaule to pipe array
    let effectpipe = R.is(Array, result) ? result : [result]

    return new Promise(async function (resolve, reject) {

      // 如果是UI互动效果，这传回promise
      // await version foreach
      console.log('TIGGER_EFFECT result is effect pipe begin')
      for (let x of effectpipe) {
        if (_.isFunction(x)) {
          console.log(`effect pipe call start`, x)
          await x.call(card)
          console.log('await pipe call finish next')
        } else {
          console.log(`effect pipe [object]`, x)
        }
      }
      console.log('TIGGER_EFFECT result is effect pipe finish')

      resolve()
    })
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
