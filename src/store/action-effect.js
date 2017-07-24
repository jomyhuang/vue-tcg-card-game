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
    commit('EFFECT_SET', {})
    commit('EFFECT_SET', {
      loop: true,
    })
    commit('EFFECT_SET', payload)
    console.log(`EFFECT_CONTEXT_INIT`, state.effect)
  },
  EFFECT_SOURCE({
    commit,
    state,
    dispatch
  }, payload) {
    if (!payload) {
      console.log('commit EFFECT_SOURCE set null')
      commit('SELECT_PLAYER', null)
      commit('SELECT_CARD', null)
      commit('EFFECT_SET', null)
      return
    }

    const card = payload
    const owner = card.owner
    console.log(`EFFECT_SOURCE select ${card.name} owner ${owner.id}`)
    commit('SELECT_PLAYER', owner)
    commit('SELECT_CARD', card)
    commit('EFFECT_SET', {
      source: card
    })
  },
  EFFECT_TARGET({
    commit,
    state,
    dispatch
  }, payload) {
    if (!payload) {
      console.log('commit EFFECT_TARGET set null')
      commit('SELECT_PLAYER', null)
      commit('SELECT_CARD', null)
      commit('EFFECT_SET', null)
      return
    }

    const card = payload
    const owner = card.owner
    console.log(`EFFECT_TARGET select ${card.name} owner ${owner.id}`)
    commit('SELECT_PLAYER', owner)
    commit('SELECT_CARD', card)
    commit('EFFECT_SET', {
      target: card
    })
    // TODO: if target is player? / register
  },
  // TIGGER_EFFECT22({
  //   commit,
  //   state,
  //   dispatch
  // }, payload) {
  //
  //   if (R.isNil(state.placeholder)) {
  //     console.warn(`TIGGER_EFFECT placeholder is null skip`)
  //     return false
  //   }
  //
  //   const type = payload
  //   const phase = state.game.phase
  //   const card = state.placeholder
  //   const player = card.owner
  //   const opponent = mutil.opponent(player)
  //
  //   // without condition check effect 不需要 tag check
  //   let condition
  //   const checklist = ['main']
  //
  //   if (R.contains(type)(checklist)) {
  //     condition = (card, type) => true
  //   } else {
  //     condition = (card, type) => R.path(['play', type])(card)
  //   }
  //
  //   if (!condition(card, type)) {
  //     // console.log(`card without ${type} status key skip`);
  //     return false
  //   }
  //
  //   let effectfunc = R.path(['effect', type])(card)
  //   if (!effectfunc) {
  //     // console.log(`card without effect func ${type} skip`)
  //     return false
  //   }
  //
  //   let context = {
  //     text: 'effect context',
  //     type: type,
  //     phase: state.game.phase,
  //     source: card,
  //     card: card,
  //     player: player,
  //     opponent: opponent,
  //     state: state,
  //     loop: true,
  //     UImode: false,
  //     cx: $cx,
  //   }
  //
  //   // console.group()
  //   console.log(`TIGGER_EFFECT => ${card.cardno} %c${type} effect action`, 'color:blue')
  //   // console.log(effectfunc())
  //
  //   return mutil.tcall(effectfunc,context,context)
  //   // return effectfunc().call(context,context)
  // },
  TIGGER_EFFECT({
    commit,
    state,
    dispatch
  }, payload) {

    if (R.is(String, payload)) {
      const fromstring = payload
      payload = {
        source: state.placeholder,
        tag: fromstring,
      }
    }

    if (!payload.source) {
      console.warn('TIGGER_EFFECT source is null', payload);
      return
    }

    const tag = payload.tag
    const source = payload.source

    const phase = state.game.phase
    const player = source.owner
    const opponent = mutil.opponent(player)

    if (R.isNil(payload.source)) {
      console.warn(`TIGGER_EFFECT source is null skip`)
      throw new Error(`TIGGER_EFFECT source is null`)
    }
    if (R.isNil(payload.tag)) {
      throw new Error(`TIGGER_EFFECT tag is null`)
    }

    let tigger = $cx.$getnext(tag, source)
    if (!tigger) {
      // no tigger to run
      return false
    }
    // let activelist = $cx.$getlist(tag, source)
    // if(!activelist.length) {
    //   // no tigger to run
    //   return false
    // }
    //
    // console.log(`NEWTIGGER_EFFECT getlist ${tag}`,activelist)
    // if(activelist.length > 1) {
    //   console.warn('NEWTIGGER_EFFECT activelist length >1 make sure piority')
    //   throw new Error('NEWTIGGER_EFFECT activelist length >1 make sure piority')
    // }

    // check slot
    // let tigger = R.head(activelist)
    let whenslot = tigger.slot
    if (!whenslot.includes(source.slot)) {
      console.warn(`NEWTIGGER_EFFECT slot check error ${source.cardno} @ ${source.slot} `, whenslot)
      return false
    }

    // check when
    if (!R.isNil(tigger.when)) {
      // console.log('when',tigger.when)
      if (!mutil.tcall(tigger.when, this, tigger)) {
        console.warn(`NEWTIGGER_EFFECT ${tag} when check fail`)
        return false
      }
    }

    let effectfunc = tigger.func
    if (!effectfunc) {
      throw new Error('TIGGER_EFFECT func is null')
    }

    let context = {
      text: 'effect context',
      type: tag,
      phase: state.game.phase,
      source: source,
      card: source,
      player: player,
      opponent: opponent,
      state: state,
      loop: true,
      UImode: false,
      cx: $cx,
      tigger: tigger,
      finish: false,
    }

    dispatch('EFFECT_SOURCE', source)
    console.log(`NEWTIGGER_EFFECT RUN => ${source.cardno} ${source.key}@${source.slot} %c${tag} effect action`, 'color:blue')

    return mutil.tcall(effectfunc, context, context).then(() => {
      tigger.run = true
      tigger.turn = state.game.turnCount
      dispatch('EFFECT_SOURCE', null)
    })
  },
  EFFECT_CHOICE({
    commit,
    state,
    dispatch
  }, payload) {

    if (R.is(String, payload)) {
      payload = {
        selector: payload
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
      player: state.placeplayer,
      selectedMuation: (state, card) => {
        state.storemsg = `EFFECT_CHOICE ${state.placeplayer.id} select ${card.name}`
        card.name = card.name + '[效果指定]'
      },
      choiceUI: true,
      source: R.prop('source', $cx.context),
      // many: 2,
    })(payload)

    // if(R.is(String, R.prop('list',payload))) {
    //   payload = R.assoc('message', payload.player.id + '从【'+R.prop('list',payload)+'】选择')(payload)
    //   // console.log(payload.message);
    // }

    // console.log('EFFECT_CHOICE do ', payload)
    return dispatch('ASYNC_ACT_SELECT_CARD_START', payload)
    // .then( (card) => {
    //   // NEWEFFECT
    //   commit('ACTIVE_CARD', card)
    // })
  },
  EFFECT_OPP_CHOICE({
    commit,
    state,
    dispatch
  }, payload) {

    if (R.is(String, payload)) {
      payload = {
        selector: payload
      }
    }

    const oppplayer = mutil.opponent(state.placeplayer)

    payload = R.merge({
      phase: 'EFFECT_OPP_CHOICE',
      player: oppplayer,
      selectedMuation: (state, card) => {
        state.storemsg = `EFFECT_OPP_CHOICE ${oppplayer} select ${card.name}`
        card.name = card.name + '[OPP效果指定]'
      },
      choiceUI: true,
      source: R.prop('source', $cx.context),
    })(payload)

    // if(R.is(String, R.prop('list',payload))) {
    //   payload = R.assoc('message', payload.player.id + ' 对方从【'+R.prop('list',payload)+'】选择')(payload)
    // }

    // return dispatch('ASYNC_ACT_SELECT_CARD_START', payload).then( ()=> {
    //   console.log('EFFECT_OPP_CHOICE finish return select currentPlayer')
    //   commit('SELECT_PLAYER',state.currentPlayer)
    // })
    // console.log('EFFECT_OPP_CHOICE do ', payload)
    return dispatch('ASYNC_ACT_SELECT_CARD_START', payload)
    // .then( (card) => {
    //   // NEWEFFECT
    //   commit('ACTIVE_CARD', card)
    // })
  },
  EMIT_EVENT({
    commit,
    state,
    dispatch
  }, payload) {
    console.log(`dispatch do event ${payload}`)
    return mutil.emitEvent(payload)
  },
}
