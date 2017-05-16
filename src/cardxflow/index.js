import R from 'ramda'
import _ from 'lodash'

import mu from '@/mutil'


export var $store = {}
var dispatch
var commit

// export quick function

export function thiscard() {
  return $store.state.placeholder
}

export function cxrun(type, payload) {
  // return store._actions[type] ? () => store.dispatch(type, payload) : () => store.commit(type, payload)
  return function () {
    const fn = $store._actions[type] ? $store.dispatch : $store.commit
    const card = thiscard()
    return fn.call(card, type, payload)
    // const cardfn = fn.bind(card)
    // return cardfn(type,payload)
  }
}

export function cxpipe(...items) {
  // let pipearr = []
  // items.forEach((effect) => {
  //   const fn = effect.bind($store.placeholder)
  //   pipearr.push(fn)
  // })
  // return pipearr
  // return items
  return function ({
    phase
  }) {
    const card = thiscard()
    console.log('cxpipe call', phase)
    return items
  }
}

export function cxengage(...items) {
  return function ({
    phase
  }) {
    const card = thiscard()
    console.log('cxengage call', phase)
    return items
    // console.log('cxengage',phase)
    // // console.log('cxengage when',when)
    // if(when()(phase)) {
    //   console.log(`cxengage ${phase} check ok`)
    //   return items
    // }
    // else {
    //   console.log(`cxengage ${phase} check fail`)
    //   return false
    // }
  }
}

export function cxbuff(power = 0, tag) {
  return function ({
    phase
  }) {
    const card = thiscard()
    if (R.isNil(tag) && power > 0) {
      tag = `UP +${power}`
    }
    let buff = {
      power: power,
      tag: tag,
      source: card,
      // type: type,
      // card: card,
    }
    commit('CARD_ADD_BUFF', buff)
    return buff
  }
}


// main module

export default {
  init: false,

  install(payload) {
    if (this.init) {
      console.error('cardflow already installed')
      return
    }

    if (payload) {
      $store = payload
      console.log('cardxflow install $store', $store);
    }
    if (!$store._actions) {
      console.error('请设置store')
    }
    dispatch = $store.dispatch
    commit = $store.commit

    mu.mixinEffect(payload)

    this.init = true
    console.log('cardflow installed')
  },
  card() {
    // console.log('thiscard',thiscard());
    return thiscard()
  },
  source() {
    return thiscard()
  },
  run(type, payload) {
    return cxrun(type, payload)
  },
  pipe(...items) {
    return cxpipe(...items)
  },
  buff(power, tag) {
    return cxbuff(power, tag)
  },
  engage(...items) {
    return cxengage(...items)
  }
}
