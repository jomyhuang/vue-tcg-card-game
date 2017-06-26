import Vue from 'vue'
import R from 'ramda'
import _ from 'lodash'

import mu from '@/mutil'


export var $store = {}
export var $mainapp
export var $effectUI
var dispatch
var commit

// export quick function
//
function thiscard() {
  return $store.state.placeholder
}

function cxrun(type, payload) {
  const fn = $store._actions[type] ? $store.dispatch : $store.commit
  const card = thiscard()
  return fn.call(card, type, payload)
}

//
// export function cxpipe(...items) {
//   return function () {
//     const card = thiscard()
//     const context = this
//     const fnlist = R.flatten(items)
//
//     let current = Promise.resolve().then(() => {
//       console.group()
//       console.log('cxpipe call')
//       mu.tcall(cxphaseinfo,context,`${this.card.cardno} ${this.card.name} 发动${this.type}效果`)
//       // select current player/card
//       // mu.tcall(cxrun,context,'EFFECT_SOURCE',card)
//     })
//     let promlist = fnlist.map((act) => {
//         current = current.then(() => {
//         console.log('pipe-----------------')
//         if (_.isFunction(act)) {
//           let res = mu.tcall(act, context, context)
//           // let res = act.call(context, context)
//           return res
//         } else {
//           return console.log(act)
//         }
//       }).then((result) => {
//         // console.log('exec act ok')
//         // pipe next, re-align current source
//         mu.tcall(cxrun,context,'EFFECT_SOURCE',card)
//       })
//       return current
//     })
//     // console.log(promlist)
//
//     return Promise.all(promlist)
//     .then(function (res) {
//       console.log('-------OK---------')
//     })
//     .catch((err) => {
//       console.log('%c-----catch------','color:red')
//       console.log('%ccxpipe effect 中断 promise all','color:red')
//       console.log('%c'+err,'color:red')
//       // TODO IDEA: 如果有catch时，错误会忽略/ effect.loop = true ／ 识别特殊 Error Object
//       // console.log('context',context)
//       if(context.loop) {
//         throw 'cxpipe throw ERROR IN EFFECT FUNCTION'
//       }
//     }).then(function(res) {
//       // final task
//       mu.clearMessage()
//       console.groupEnd()
//     })
//   }
// }
//
// export function cxengage(...items) {
//   return function () {
//     const card = thiscard()
//     const context = this
//     const fnlist = R.flatten(items)
//
//     let current = Promise.resolve().then(() => {
//       console.group()
//       console.log('cxengage call')
//       mu.tcall(cxphaseinfo,context,`${this.card.cardno} ${this.card.name} 发动${this.type}效果`)
//       // select current player/card
//       // mu.tcall(cxrun,context,'EFFECT_SOURCE',card)
//     })
//     let promlist = fnlist.map((act) => {
//         current = current.then(() => {
//         console.log('act-----------------')
//         if (_.isFunction(act)) {
//           let res = mu.tcall(act, context, context)
//           // let res = act.call(context, context)
//           return res
//         } else {
//           return console.log(act)
//         }
//       }).then((result) => {
//         // console.log('exec act ok')
//       })
//       return current
//     })
//     // console.log(promlist)
//
//     return Promise.all(promlist)
//     .then(function (res) {
//       console.log('-------OK---------')
//       // console.log('effect act all finish')
//       // console.log('context',context)
//     })
//     .catch((err) => {
//       console.log('%c-----catch------','color:red')
//       console.log('%ceffect 中断 promise all','color:red')
//       console.log('%c'+err,'color:red')
//       // TODO IDEA: 如果有catch时，错误会忽略/ effect.loop = true ／ 识别特殊 Error Object
//       // console.log('context',context)
//       if(context.loop) {
//         throw 'cxengage throw ERROR IN EFFECT FUNCTION'
//       }
//     }).then(function(res) {
//       // final task
//       mu.clearMessage()
//       console.groupEnd()
//     })
//   }
// }
//
// export function cxbuff(power = 0, tag) {
//   return function () {
//     const card = thiscard()
//     if (R.isNil(tag) && power > 0) {
//       tag = `UP +${power}`
//     }
//     let buff = {
//       power: power,
//       tag: tag,
//       source: card,
//     }
//     commit('ADD_BUFF', buff)
//     return buff
//   }
// }
//
// export function cxtap(fn) {
//   return function () {
//       return _.isFunction(fn) ? console.log(`tap function `, fn.call(this,thiscard())) : console.log(`tap %c${fn}`, 'color:blue')
//   }
// }
//
// export function cxmessage(message) {
//   return function () {
//     this.text = message
//     return $mainapp.gameloop_message(message)
//   }
// }
//
// export function cxphaseinfo(message) {
//   return function () {
//     this.text = message
//     return $mainapp.gameloop_phaseinfo(message)
//   }
// }

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
      $effectUI = payload.effectUI
      console.log('cardxflow install $effectUI', $effectUI)
    }
    mu.assert($store._actions, '请设置vuex store')

    dispatch = $store.dispatch
    commit = $store.commit

    mu.mixinEffect(payload)
    console.log('cardflow link mutil')

    // Vue.config.debug = process.env.DEBUG_MODE
    // Vue.config.test = process.env.NODE_ENV === 'development'
    // Vue.config.test = process.env.NODE_ENV === 'testing'

    this.init = true
    console.log('cardflow installed')
  },
  // thiscard() {
  //   // console.log('cx.thiscard ($store.state.placeholder)')
  //   return $store.state.placeholder
  // },
  // source() {
  //   // console.log('cx.source ($store.state.placeholder)')
  //   return $store.state.placeholder
  // },
  run(type, payload) {
    return function () {
      const context = this
      const fn = $store._actions[type] ? $store.dispatch : $store.commit
      const card = context.card
      return fn.call(card, type, payload)
    }
  },
  pipe(...items) {
    return function () {
      const context = this
      const cx = context.cx
      const card = context.card
      let fnlist = R.flatten(items)

      let current = Promise.resolve().then(() => {
        console.group()
        console.log('cxpipe start')
        mu.tcall(cx.phaseinfo, context, `${card.cardno} ${card.name} 发动${this.type}效果`)
        // select current player/card
        // mu.tcall(cxrun,context,'EFFECT_SOURCE',card)
      })
      let promlist = fnlist.map((act) => {
        current = current.then(() => {
          console.log('pipe-----------------')
          if (_.isFunction(act)) {
            let res = mu.tcall(act, context, context)
            return res
          } else {
            return console.log(act)
          }
        }).then((result) => {
          // pipe next, re-align current source
          mu.tcall(cx.run, context, 'EFFECT_SOURCE', card)
        })
        return current
      })
      // console.log(promlist)

      return Promise.all(promlist)
        .then(function (res) {
          console.log('-pipe OK---------')
        })
        .catch((err) => {
          console.log('%c-pipe catch------', 'color:red')
          console.log('%ccxpipe effect 中断 promise all', 'color:red')
          console.log('%c' + err, 'color:red')
          // TODO IDEA: 如果有catch时，错误会忽略/ effect.loop = true ／ 识别特殊 Error Object
          // console.log('context',context)
          if (context.loop) {
            throw 'cxpipe throw ERROR IN EFFECT FUNCTION'
          }
        }).then(function (res) {
          // final task
          mu.clearMessage()
          console.groupEnd()
        })
    }
  },
  engage(...items) {
    return function () {
      const context = this
      const cx = context.cx
      const card = context.card
      let fnlist = R.flatten(items)
      // let fnlist = items

      // compose chain list
      fnlist = [cx.openUI()].concat(fnlist)
      fnlist = fnlist.concat([cx.closeUI()])
      fnlist = R.flatten(fnlist)

      let current = Promise.resolve().then(() => {
        console.group()
        console.log('cxengage start')
        mu.tcall(cx.phaseinfo, context, `${card.cardno} ${card.name} 发动${this.type}效果`)
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
      // console.log(promlist);

      return Promise.all(promlist)
        .then(function (res) {
          console.log('-engage OK---------')
          // console.log('context',context)
        })
        .catch((err) => {
          console.log('%c-engage catch------', 'color:red')
          console.log('%ceffect 中断 promise all', 'color:red')
          console.log('%c' + err, 'color:red')
          // TODO IDEA: 如果有catch时，错误会忽略/ effect.loop = true ／ 识别特殊 Error Object
          // console.log('context',context)
          if (context.loop) {
            throw 'cxengage throw ERROR IN EFFECT FUNCTION'
          }
        }).then(function (res) {
          // final task
          mu.clearMessage()
          console.groupEnd()
        })
    }
  },
  buff(power, tag) {
    return function () {
      const context = this
      const cx = context.cx
      const card = context.card
      return new Promise(function (resolve, reject) {
        if (R.isNil(tag) && power > 0) {
          tag = `UP +${power}`
        }
        let buff = {
          power: power,
          tag: tag,
          source: card,
        }
        console.log(`cx.buff ${card.name} +${power}`)
        commit('ADD_BUFF', buff)
        // resolve()
        $effectUI.showbuff(buff,resolve)
      })
    }
  },
  tap(fn) {
    return function () {
      const context = this
      const card = context.card
      return _.isFunction(fn) ? console.log(`tap function `, fn.call(this, card)) : console.log(`tap %c${fn}`, 'color:blue')
    }
  },
  message(message) {
    return function () {
      this.text = message
      return $mainapp.gameloop_message(message)
    }
  },
  phaseinfo(message) {
    return function () {
      this.text = message
      return $mainapp.gameloop_phaseinfo(message)
    }
  },
  iftest(message) {
    return function () {
      this.reason = '效果中断测试'
      this.loop = false
      return Promise.reject(new Error('效果中断测试'))
    }
  },
  openUI(auto = 0) {
    return [this.phaseinfo('open UI message'), function () {
      const context = this
      const cx = context.cx
      return new Promise((resolve, reject) => {
        mu.tcall(cx.phaseinfo, this, 'open UI message')
        context.UImode = true
        $effectUI.context = this
        // $effectUI.open(auto, resolve)
        $effectUI.open()
        resolve()
      })
    }]
  },
  closeUI() {
    return [this.phaseinfo('close UI message'), function () {
      const context = this
      const cx = context.cx
      return new Promise((resolve, reject) => {
        context.UImode = false
        // $effectUI.close()
        // resolve()
        $effectUI.waitclose(resolve)
      })
    }]
  },
}
