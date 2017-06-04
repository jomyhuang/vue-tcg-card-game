import R from 'ramda'
import _ from 'lodash'

import mu from '@/mutil'


export var $store = {}
export var $mainapp
var dispatch
var commit

// export quick function

export function thiscard() {
  return $store.state.placeholder
}

export function cxrun(type, payload) {
  return function () {
    const fn = $store._actions[type] ? $store.dispatch : $store.commit
    const card = thiscard()
    return fn.call(card, type, payload)
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
  return function () {
    return console.log(`cxtap %c${message}`, 'color:blue')
  }
}

// effect function 定义：
// 1、point free，单参
// 2、可组合，函数式，pipe 模式
// 3、this 为context、return Promise/resolve 返回(context)、标准函数返回 context

// main module

export default {
  init: false,

  install(payload) {
    if (this.init) {
      console.error('cardflow already installed')
      return
    }

    if (payload) {
      $store = payload.store
      console.log('cardxflow install $store', $store)
      $mainapp = payload.mainapp
      console.log('cardxflow install $mainapp', $mainapp)
    }
    mu.assert($store._actions, '请设置store')

    dispatch = $store.dispatch
    commit = $store.commit

    mu.mixinEffect(payload)
    console.log('cardflow link mutil')

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

  // export effect function wrapper
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

  // function
  iftest(message) {
    return function() {
      this.reason = '效果中断测试'
      this.loop = false
      return Promise.reject(new Error('效果中断测试'))
      // return new Promise((resolve, reject) => {
      //   console.log('iftest中断测试')
      //   // commit('EFFECT_SET', {
      //   //   loop: false
      //   // })
      //   reject(new Error('效果中断测试'))
      // })
    }
  },
  tapUI() {
    return function () {
      console.log('tapUI 呼叫UI funcion')
      console.log('tapUI this',this)
      this.title = 'tapUI'
      return $mainapp.run_message('tapUI 呼叫UI funcion')
    }
  }
}
