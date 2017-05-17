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
  TIGGER_EFFECT({
    commit,
    state,
    dispatch
  }, payload) {

    const type = payload
    const phase = payload
    const card = state.placeholder
    const player = card.owner
    const opponent = mutil.opponent(player)

    // 处理效果目标对象 owner, card...
    // select card owner
    commit('SELECT_PLAYER', player)

    if (player !== state.currentPlayer) {
      // commit('SELECT_CARD', card)
      // commit('SELECT_PLAYER', player)
      console.warn(`TIGGER_EFFECT ${card.name} 对方回合发动效果`)
      // throw '发动效果卡不等于 placeholder'
    }

    // console.log('TIGGER_EFFECT this',this);

    const funcdispatch = (type, payload) => {
      return () => dispatch(type, payload)
    }

    const funccommit = (type, payload) => {
      return () => commit(type, payload)
    }

    const tap = () => {
      return () => console.log('tap this', this)
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
      phase: phase,
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
      console.log(`card without ${type} status key skip`);
      return false
    }

    let effectfunc = R.path(['effect', type])(card)
    if (!effectfunc) {
      console.log(`card without effect func ${type} skip`)
      return false
    }

    // let engage = R.path(['effect', 'engage'])(card)
    //
    // if(engage) {
    //   console.log('enage test',engage)
    //   engage(type)
    // }

    return new Promise(async function (resolve, reject) {

      let result = effectfunc
      if( _.isFunction(result) ) {
        result = effectfunc.call(card,effectpack)
      }
      if (R.isNil(result)) {
        console.log('TIGGER_EFFECT result is nil skip do effect pipe')
        resolve()
        return true
      }

      console.group()
      console.log(`=> ${card.cardno} ${type} effect action`)

      let pipelist = R.is(Array, result) ? result : [ result ]
      pipelist = R.flatten(pipelist)

      let pipecount = 0
      for( let pipe of pipelist ) {
        pipecount++
        console.group()
        console.log(`=> ${card.cardno} ${type} pipelist ${pipecount}/${pipelist.length}`)

        // let result = effectfunc.call(card, effectpack)
        // console.log(`${card.cardno} ${type} result is`, R.type(item))
        // if (R.isNil(item)) {
        //   console.log('TIGGER_EFFECT result is nil skip effect')
        //   resolve()
        //   return false
        // } else if (_.isFunction(item)) {
        if (_.isFunction(pipe)) {
          pipe = pipe.call(card, effectpack)
        }

        // convert & flatten any vaule to pipe array
        let effectpipe = R.is(Array, pipe) ? pipe : [ pipe ]
        effectpipe = R.flatten(effectpipe)

        // await version foreach
        console.group()
        console.log('TIGGER_EFFECT result is effect pipe start')
        // 改成map不行，不在目前主线程 blocking
        // effectpipe.map(async function (x) {
        //   if (_.isFunction(x)) {
        //     console.log(`effect pipe call start`, x)
        //     await new Promise(async function(resolve, reject) {
        //       await x.call(card,effectpack)
        //       resolve()
        //     })
        //     console.log('await pipe call finish next')
        //   } else {
        //     console.log(`effect pipe [object]`, x)
        //   }
        // })

        let count = 0
        for (let act of effectpipe) {
          count++

          if (_.isFunction(act)) {
            console.log(`===> ${card.cardno} ${type} ${count}/${effectpipe.length} -> effect pipe call`)
            await act.call(card, effectpack)
            console.log('await pipe call finish next')
          } else {
            console.log(`===> ${card.cardno} ${type} ${count}/${effectpipe.length} -> effect pipe [object]`, act)
          }
        }
        console.log('TIGGER_EFFECT result is effect pipe finish')
        console.groupEnd()
        console.groupEnd()
      }

      console.groupEnd()

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
}
