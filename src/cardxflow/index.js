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
  return function ({
    phase
  }) {
    const card = thiscard()

    return items
  }
}

export function cxengage(...items) {
  return function ({
    phase
  }) {
    const card = thiscard()

    return [cxtap('cxengage call')].concat(items)
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
    commit('ADD_BUFF', buff)
    return buff
  }
}

export function cxtap(message) {
  return function() {
    return console.log(`cxtap %c${message}`,'color:blue')
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
  },
  tap(message) {
    return cxtap(message)
  },
  iftest(message) {
    return function() {
      console.log('iftest')
      // Promise.reject('promise 中断测试')
    }
  },
}
