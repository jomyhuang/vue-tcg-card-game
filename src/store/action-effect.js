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
    const phase = payload
    const card = state.placeholder
    const player = card.owner
    const opponent = mutil.opponent(player)

    // move to effect loop
    // // 处理效果目标对象 owner, card...
    // // select card owner
    // commit('SELECT_PLAYER', player)

    // if (player !== state.currentPlayer) {
    //   console.warn(`TIGGER_EFFECT ${card.name} 对方回合发动效果`)
    //   // throw '发动效果卡不等于 placeholder'
    // }
    //
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

    return new Promise(async function (resolve, reject) {

      // let pipelist = mutil.packcall(effectfunc, card, effectpack)
      let effectpipe = mutil.packcall(effectfunc, card, effectpack)
      // let res = effectfunc
      // if (_.isFunction(res)) {
      //   res = effectfunc.call(card, effectpack)
      // }
      // if (R.isNil(res)) {
      if (mutil.packisNil(effectpipe)) {
        console.log('TIGGER_EFFECT result is nil skip do effect pipe')
        resolve()
        return true
      }

      console.group()
      console.log(`=> ${card.cardno} ${type} effect action`)

      // let pipelist = R.is(Array, res) ? res : [res]
      // pipelist = R.flatten(pipelist)

      // let pipecount = 0
      // for (let pipe of pipelist) {
      //   pipecount++
      //
      //   console.log(`=> ${card.cardno} ${type} pipelist ${pipecount}/${pipelist.length}`)

        // let result = effectfunc.call(card, effectpack)
        // console.log(`${card.cardno} ${type} result is`, R.type(item))
        // if (R.isNil(item)) {
        //   console.log('TIGGER_EFFECT result is nil skip effect')
        //   resolve()
        //   return false
        // } else if (_.isFunction(item)) {

        // if (_.isFunction(pipe)) {
        //   pipe = pipe.call(card, effectpack)
        // }

        // convert & flatten any vaule to pipe array
        // let effectpipe = R.is(Array, pipe) ? pipe : [pipe]
        // effectpipe = R.flatten(effectpipe)

        // let effectpipe = mutil.packcall(pipe, card, effectpack)


        // await version foreach
        console.log('TIGGER_EFFECT result is effect pipe start')

        // 处理效果目标对象 owner, card...
        // select card owner
        commit('SELECT_PLAYER', player)
        commit('SELECT_CARD', card)
        if (player !== state.currentPlayer) {
          console.warn(`TIGGER_EFFECT ${card.name} 对方回合发动效果`)
        }

        // 改成map不行，不在目前主线程 blocking
        // promise hell!
        // await new Promise(function(resolve, reject) {
        //
        //   effectpipe.map(async function (x) {
        //     if (_.isFunction(x)) {
        //       console.log(`effect pipe call start`, x)
        //       await x.call(card,effectpack)
        //       console.log('await pipe call finish next')
        //     } else {
        //       console.log(`effect pipe [object]`, x)
        //     }
        //   })
        //   console.log('TIGGER_EFFECT map ok');
        //   resolve()
        // })

        let count = 0
        for (let act of effectpipe) {
          count++

          // console.log(`===> ${card.cardno} ${type} ${count}/${effectpipe.length} -> effect pipe call`)
          // 不能使用外部call
          // await mutil.call(act, card, effectpack)

          if (_.isFunction(act)) {
            console.log(`===> ${card.cardno} ${type} ${count}/${effectpipe.length} -> effect pipe [function] call`)
            await act.call(card, effectpack)
            console.log('await pipe call finish next')
          } else {
            console.log(`===> ${card.cardno} ${type} ${count}/${effectpipe.length} -> effect pipe [object]`, act)
          }
        }
        console.log('TIGGER_EFFECT result is effect pipe finish')
      // }

      console.groupEnd()

      resolve()
    })
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
        card.name = card.name + '[EF]'
      },
    })(payload)

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
        card.name = card.name + '[OEF]'
      },
    })(payload)

    // return dispatch('ASYNC_ACT_SELECT_CARD_START', payload).then( ()=> {
    //   console.log('EFFECT_OPP_CHOICE finish return select currentPlayer')
    //   commit('SELECT_PLAYER',state.currentPlayer)
    // })
    console.log('EFFECT_OPP_CHOICE do ', payload)
    return dispatch('ASYNC_ACT_SELECT_CARD_START', payload)
  },
}
