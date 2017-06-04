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
// import $cx from '@/cardxflow'


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

    // INIT CONTEXT
    // dispatch('EFFECT_CONTEXT_INIT', {
    //   type: type,
    //   phase: state.game.phase,
    //   card: card,
    //   player: player,
    //   opponent: opponent
    // })

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

    let context = {
      text: 'context',
      type: type,
      phase: state.game.phase,
      card: card,
      player: player,
      opponent: opponent,
      loop: true,
      state: state,
    }

    let pipelist = mutil.packcall(effectfunc, context, effectpack)

    if (mutil.packisNil(pipelist)) {
      console.log('TIGGER_EFFECT result is nil skip do effect pipe')
      // resolve()
      return true
    }

    // !!重要！！如果没有Array，则降维为合并成一个标准模式
    if (!R.any(R.is(Array), pipelist)) {
      pipelist = [pipelist]
    }
    console.group()
    // $cx.message(`${card.cardno} ${card.name} 发动${type}效果`)
    console.log(`=> ${card.cardno} %c${type} effect action`, 'color:blue')
    mutil.assert(pipelist.length == 1, 'WARN! new async only exec array[0]')

    let effectpipe = mutil.packcall(pipelist[0], context, effectpack)

    // async map / promise all
    // http://promise-nuggets.github.io/articles/15-map-in-series.html
    // start with current being an "empty" already-fulfilled promise
    let current = Promise.resolve()

    let promlist = effectpipe.map(function (act) {
      current = current.then(function () {
        console.log('act-----------------')
        if (_.isFunction(act)) {
          let res = act.call(context, effectpack)
          // console.log('context', context)
          // 中断loop
          // 直接在Promise内reject
          return res
        } else {
          return console.log(act)
        }
      }).then(function (result) {
        // console.log('exec act ok')
      })
      return current
    })
    // console.log('promlist',promlist)
    return Promise.all(promlist)
    // return Promise.all(effectpipe.map(function (act) {
    //   current = current.then(function () {
    //     console.log('act-----------------')
    //     if (_.isFunction(act)) {
    //       let res = act.call(card, effectpack)
    //       // 中断loop
    //       // 直接在Promise内reject
    //       // if(!state.effect.loop) {
    //         // TODO: 处理效果中断
    //         // Promise.reject('效果中断')
    //       // }
    //       return res
    //     } else {
    //       return console.log(act)
    //     }
    //   }).then(function (result) {
    //     // console.log('exec act ok')
    //   })
    //   return current
    // }))
    .then(function (results) {
      console.log('-------OK---------')
      console.log('effect act all finish')
      // console.log('context',context)
      mutil.clearMessage()
      console.groupEnd()
    })
    .catch((err) => {
      console.log('%c-----catch------','color:red')
      console.log('%ceffect 中断 promise all','color:red')
      console.log('%c'+err,'color:red')
      // TODO IDEA: 如果有catch时，错误会忽略/ effect.loop = true ／ 识别特殊 Error Object
      // console.log('context',context)
      if(context.loop) {
        throw 'ERROR IN EFFECT FUNCTION'
      }
      mutil.clearMessage()
      console.groupEnd()
      // if(state.effect.loop) {
      //   throw 'ERROR IN EFFECT FUNCTION'
      // }
    })

    // return new Promise(async function (resolve, reject) {
    //
    //   let pipecount = 0
    //   for (let pipe of pipelist) {
    //     pipecount++
    //
    //     // console.log(effectpipe)
    //
    //     // console.group()
    //     // // await version foreach
    //     // console.log(`${card.cardno} ${type} effect step ${effectpipe.length} actions`)
    //
    //     // 处理效果目标对象 owner, card...
    //     // select card owner
    //     // if (player !== state.currentPlayer) {
    //     //   console.warn(`TIGGER_EFFECT ${card.name} 对方回合发动效果`)
    //     // }
    //
    //     // 改成map不行，不在目前主线程 blocking
    //     // promise hell!
    //     // await new Promise(function(resolve, reject) {
    //     //
    //     //   effectpipe.map(async function (x) {
    //     //     if (_.isFunction(x)) {
    //     //       console.log(`effect pipe call start`, x)
    //     //       await x.call(card,effectpack)
    //     //       console.log('await pipe call finish next')
    //     //     } else {
    //     //       console.log(`effect pipe [object]`, x)
    //     //     }
    //     //   })
    //     //   console.log('TIGGER_EFFECT map ok');
    //     //   resolve()
    //     // })
    //
    //     let count = 0
    //     for (let act of effectpipe) {
    //       count++
    //
    //       // console.log(`===> ${card.cardno} ${type} ${count}/${effectpipe.length} -> effect pipe call`)
    //       // 不能使用外部call
    //       // XXXX await mutil.call(act, card, effectpack)
    //
    //       if (_.isFunction(act)) {
    //         console.log(`===> ${card.cardno} ${type} ${count}/${effectpipe.length} -> effect pipe [function] call`)
    //         let res = await act.call(card, effectpack)
    //         // if( _.isFunction(res) ) {
    //         //   res = await res.call(card,effectpack)
    //         // }
    //         console.log('await pipe call finish next',res)
    //       } else {
    //         console.log(`===> ${card.cardno} ${type} ${count}/${effectpipe.length} -> effect pipe [object] next`, act)
    //       }
    //     }
    //     console.log('TIGGER_EFFECT result is effect step finish')
    //     console.groupEnd()
    //
    //   }
    //
    //   resolve()
    // })
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
