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
  return function () {
    const card = thiscard()
    const context = this
    const fnlist = items

    let current = Promise.resolve().then(() => {
      console.group()
      console.log('cxpipe call')
      mu.tcall(cxphaseinfo,context,`${this.card.cardno} ${this.card.name} 发动${this.type}效果`)
      // select current player/card
      // mu.tcall(cxrun,context,'EFFECT_SOURCE',card)
    })
    let promlist = fnlist.map((act) => {
        current = current.then(() => {
        console.log('pipe-----------------')
        if (_.isFunction(act)) {
          let res = mu.tcall(act, context, context)
          // let res = act.call(context, context)
          return res
        } else {
          return console.log(act)
        }
      }).then((result) => {
        // console.log('exec act ok')
        // pipe next, re-align current source
        mu.tcall(cxrun,context,'EFFECT_SOURCE',card)
      })
      return current
    })
    // console.log(promlist)

    return Promise.all(promlist)
    .then(function (res) {
      console.log('-------OK---------')
    })
    .catch((err) => {
      console.log('%c-----catch------','color:red')
      console.log('%ccxpipe effect 中断 promise all','color:red')
      console.log('%c'+err,'color:red')
      // TODO IDEA: 如果有catch时，错误会忽略/ effect.loop = true ／ 识别特殊 Error Object
      // console.log('context',context)
      if(context.loop) {
        throw 'cxpipe throw ERROR IN EFFECT FUNCTION'
      }
    }).then(function(res) {
      // final task
      mu.clearMessage()
      console.groupEnd()
    })
  }
}


export function cxengage__(...items) {
  return function ({
    phase
  }) {
    const card = thiscard()
    return [cxtap('cxengage call'), cxphaseinfo(`${this.card.cardno} ${this.card.name} 发动${this.type}效果`)].concat(items)
  }
}

export function cxengage(...items) {
  return function () {
    const card = thiscard()
    const context = this
    const fnlist = items

    let current = Promise.resolve().then(() => {
      console.group()
      console.log('cxengage call')
      mu.tcall(cxphaseinfo,context,`${this.card.cardno} ${this.card.name} 发动${this.type}效果`)
      // select current player/card
      // mu.tcall(cxrun,context,'EFFECT_SOURCE',card)
    })
    let promlist = fnlist.map((act) => {
        current = current.then(() => {
        console.log('act-----------------')
        if (_.isFunction(act)) {
          let res = mu.tcall(act, context, context)
          // let res = act.call(context, context)
          return res
        } else {
          return console.log(act)
        }
      }).then((result) => {
        // console.log('exec act ok')
      })
      return current
    })
    // console.log(promlist)

    return Promise.all(promlist)
    .then(function (res) {
      console.log('-------OK---------')
      // console.log('effect act all finish')
      // console.log('context',context)
    })
    .catch((err) => {
      console.log('%c-----catch------','color:red')
      console.log('%ceffect 中断 promise all','color:red')
      console.log('%c'+err,'color:red')
      // TODO IDEA: 如果有catch时，错误会忽略/ effect.loop = true ／ 识别特殊 Error Object
      // console.log('context',context)
      if(context.loop) {
        throw 'cxengage throw ERROR IN EFFECT FUNCTION'
      }
    }).then(function(res) {
      // final task
      mu.clearMessage()
      console.groupEnd()
    })
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

export function cxtap(fn) {
  return function () {
      return _.isFunction(fn) ? console.log(`tap function `, fn.call(this,thiscard())) : console.log(`tap %c${fn}`, 'color:blue')
  }
}

export function cxmessage(message) {
  return function () {
    this.text = message
    return $mainapp.gameloop_message(message)
  }
}

export function cxphaseinfo(message) {
  return function () {
    this.text = message
    return $mainapp.gameloop_phaseinfo(message)
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
  tap(fn) {
    return cxtap(fn)
  },
  message(message) {
    return cxmessage(message)
  },
  phaseinfo(message) {
    return cxphaseinfo(message)
  },

  // function
  iftest(message) {
    return function () {
      this.reason = '效果中断测试'
      this.loop = false
      return Promise.reject(new Error('效果中断测试'))
    }
  },
}
