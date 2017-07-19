import Vue from 'vue'
import R from 'ramda'
import _ from 'lodash'
import Rx from 'rxjs/Rx'

import mu from '@/mutil'
import is from '@/cardxflow/is'

export var $store = {}
export var $state = {}
export var $mainapp
export var $effectUI
export var $effectChoiceUI
var $effectlist = []
export var dispatch
export var commit

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

// effect function 定义：
// 1、point free，单参
// 2、可组合，函数式，pipe 模式
// 3、this 为context、return Promise/resolve 返回(context)、标准函数返回 context

// main module

export default {
  init: false,
  context: null,
  active: false,

  install(payload) {
    if (this.init) {
      console.error('cardflow already installed')
      return
    }

    if (payload) {
      $store = payload.store
      $state = payload.store.state
      console.log('cardxflow install $store/$state', $store)
      $mainapp = payload.mainapp
      console.log('cardxflow install $mainapp', $mainapp)
      $effectUI = payload.effectUI
      console.log('cardxflow install $effectUI', $effectUI)
      $effectChoiceUI = payload.effectChoiceUI
      console.log('cardxflow install $effectChoiceUI', $effectChoiceUI)
      // console.dir($effectChoiceUI)
    }
    mu.assert($store._actions, '请设置vuex store')

    dispatch = $store.dispatch
    commit = $store.commit

    mu.mixinEffect(payload)
    console.log('cardflow link mutil')

    this.$initeffect()
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
  debug() {
    console.log('$cx.effectlist debug')
    // console.dir($effectlist)
    R.forEach( (x) => {
      console.log(`tigger ${x.source.cardno} ${x.tigger}`);
      console.dir(x)
    })($effectlist)
  },
  $initeffect() {
    console.log('$cx.$initeffect')
    $effectlist = []
  },
  $addtigger(payload) {
    $effectlist.push(payload)
    console.log(`$cx.$addtigger ${payload.source.cardno} ${payload.tigger} ${payload.type}`)
  },
  $removetigger(tag,card) {
    // if(tag == 'main') return
    // way1: remove
    // $effectlist = R.filter( (x) => !(x.tigger == tag && x.source.key == card.key) )($effectlist)
    // way2: make inactive first
    $effectlist = R.map( (x) => {
      if(x.tigger == tag && x.source.key == card.key ) x.active = false
      return x
    })($effectlist)
    // TODO: way3 transduce
    // console.log(`removetigger ${tag} ${card.cardno}`, $effectlist.length)
  },
  $getlist(tag,card) {
    // return R.filter( (x) => x.tigger==tag )($effectlist)
    const cardcheck = card ? (x) => x.source.key == card.key : () => true
    // TODO: add slot check
    const slotcheck = card ? (x) => x.slot.includes(x.source.slot) : () => true
    const tagcheck = card ? (x) => x.source.play[tag] : () => true

    return R.filter( (x) => x.tigger==tag
              && !x.run && x.active
              // && mu.tcall(x.when)
              && mu.tcall(tagcheck,this,x)
              // && mu.tcall(slotcheck,this,x)
              && mu.tcall(cardcheck,this,x) )($effectlist)
    // return R.filter( (x) => x.tigger==tag && x.source.play[tag] )($effectlist)
  },
  $getnext(tag) {
    const list = this.$getlist(tag)

    return list.length > 0 ?  R.head(list) : null
  },
  _setcontext(context=null) {
    if(context) {
      this.context = context
      this.active = true
      console.log('$cx.setcontext set')
    }
    else {
      this.context = null
      this.active = false
      console.log('$cx.setcontext clear')
    }
  },
  run(type, payload) {
    return function () {
      const context = this
      const fn = $store._actions[type] ? $store.dispatch : $store.commit
      const card = context.card
      return mu.tcall(fn, context, type, payload)
      // return fn.call(card, type, payload)
    }
  },
  pipe(...items) {
    return function () {
      const context = this
      const cx = context.cx
      const card = context.card
      cx._setcontext(context)

      let fnlist = R.flatten(items)

      let current = Promise.resolve().then(() => {
        console.group()
        console.log('cxpipe start')
        mu.tcall(cxrun,context,'EFFECT_SOURCE',card)
        // BUG：这里call promise 产生错误
        // mu.tcall(cx.phaseinfo, context, `${card.cardno} ${card.name} 发动${this.type}效果`)
        return mu.tcall(cx.phaseinfo, context, `begin pipe 发动${this.type}效果`)
        // select current player/card
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
          // mu.clearMessage()
          console.groupEnd()
          cx._setcontext()
        })
    }
  },
  GUIengage(...items) {
    let fnlist = items

    // compose chain list
    fnlist = this._startGUI().concat(fnlist)
    // console.log(fnlist)
    return this.engage(fnlist)
  },
  engage(...items) {
    return function () {
      const context = this
      const cx = context.cx
      const card = context.card
      cx._setcontext(context)

      let fnlist = R.flatten(items)
      // let fnlist = items

      // compose chain list
      // fnlist = [cx.openUI()].concat(fnlist)
      // fnlist = fnlist.concat([cx.closeUI()])
      // fnlist = R.flatten(fnlist)
      // console.log(fnlist)

      let current = Promise.resolve().then(() => {
        console.group()
        console.log('cxengage start')
        mu.tcall(cxrun,context,'EFFECT_SOURCE',card)
        // BUG：这里call promise 产生错误
        // mu.tcall(cx.phaseinfo, context, `begin ${card.cardno} ${card.name} 发动${this.type}效果`)
        // FIXME: return promise 就可以
        return mu.tcall(cx.phaseinfo, context, `begin engage 发动${this.type}效果`)
        // select current player/card
      })
      let promlist = fnlist.map((act) => {
        current = current.then(() => {
          console.log('>>act-------------')
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
          console.log('>>engage OK-------')
          // console.log('context',context)
          // return 'then next'
        })
        .catch((err) => {
          console.log('%c>>engage catch------', 'color:red')
          console.log('%c>>effect reject promise all', 'color:red')
          console.log('%c' + err, 'color:red')
          console.log('%c' + context.reason, 'color:red')
          // TODO IDEA: 如果有catch时，错误会忽略/ effect.loop = true ／ 识别特殊 Error Object
          // console.log('context',context)
          if (context.loop) {
            throw 'cxengage throw ERROR IN EFFECT FUNCTION'
          }
        }).then(function (res) {
          // final task
          // mu.clearMessage()
          console.groupEnd()
          cx._setcontext()
        })
    }
  },
  target(payload) {
    // return [ this.phaseinfo('指定效果Target'), function() {
    // 获取函数名称
    // console.log('target caller', this.target.name );
    return function() {
      const context = this
      const cx = context.cx
      const card = context.card

      const fnselector = function(payload) {
        console.log('$cx.target exec default selector')
        let actpayload = {
          selector: payload.from,
          filter: payload.filter,
        }
        const act = payload.opponent ? 'EFFECT_OPP_CHOICE' : 'EFFECT_CHOICE'
        // let list = mu.selectcards(payload.from)
        // list = R.filter(payload.filter)(list)
        // console.log(list,_.isArray(list));
        return dispatch(act,actpayload)
        // .then( (card)=> {
        //   console.log('$cx.target fnselector then',card)
        //   return card
        // })
      }

      if(R.is(String,payload)) {
        const fromstring = payload
        payload = {
          from: fromstring,
        }
      }

      payload = R.merge({
        from: payload,
        selector: fnselector,
        filter: () => true,
        opponent: false,
      })(payload)

      // console.log('target func', mu.getfuncname(is.attacker));

      return new Promise(async function(resolve, reject) {
        console.log('$cx.target')
        // console.dir(payload)

        let target = await mu.tcall(payload.selector,context,payload)
        // let target = await mu.tcall(fnselector,context,payload)
        // let target = await dispatch('EFFECT_CHOICE',payload.from)

        // console.log('target res', target);
        if(target) {
          resolve(target)
        }
        else {
          reject()
        }
      })
      .then( (target) => {
        this.target = target
        dispatch('EFFECT_TARGET',target)
        console.log('$cx.target targeting',context.target)
      })
      .catch((err) => {
        cx._stop('$cx.target target is null')
        // console.log('$cx.target target is null')
        // context.loop = false
        // throw new Error('$cx.target target is null')
      })
    }
  // ]
  },
  opptarget(payload) {
    if(R.is(String,payload)) {
      const fromstring = payload
      payload = {
        from: fromstring
      }
    }
    payload = R.assoc('opponent',true)(payload)
    console.log('$cx.opptarget wrapper')

    return this.target(payload)
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
  effectChoice(payload) {
    return function() {
      const context = this
      const cx = context.cx
      const card = context.card
      // return Promise.resolve().then( () => {
      //   console.log('effectChoice before')
      //   return dispatch('EFFECT_CHOICE',payload)
      // })
      //   .then((card) => {
      //     this.target = card
      //     console.log('effectChoice target',context.target)
      //   })
      return dispatch('EFFECT_CHOICE',payload)
        .then((card) => {
          this.target = card
          console.log('effectChoice target',context.target)
          // dispatch('EFFECT_TARGET',card)
        })
    }
  },
  tap(fn) {
    return function () {
      const context = this
      const card = context.card
      return _.isFunction(fn) ? console.log(`tap function `, mu.tcall(fn, this, card)) : console.log(`tap %c${fn}`, 'color:blue')
    }
  },
  message(message) {
    return function () {
      this.text = _.isFunction(message) ? mu.tcall(message,this) : message
      return $mainapp.gameloop_message(this.text)
    }
  },
  phaseinfo(message) {
    return function () {
      this.text = _.isFunction(message) ? mu.tcall(message,this) : message
      // this.text = message
      return $mainapp.gameloop_phaseinfo(this.text)
    }
  },
  _stop(msg) {
    console.warn(msg)
    // this.context.reason = msg
    this.context.loop = false
    return Promise.reject(new Error(msg))
  },
  when(pred = ()=>true, stopfn = ()=>'$cx.when logic false' ) {
    return function () {
      const context = this
      const cx = context.cx
      const run = mu.tcall(pred, this)
      if(!run) {
        context.reason = _.isFunction(stopfn) ? mu.tcall(stopfn,this) : stopfn
        return cx._stop('$cx.when logic false')
      }

      return Promise.resolve(true)
    }
  },
  reject(message) {
    return function () {
      const msg = message ? message : 'reject 效果中断点'
      this.reason = msg
      this.loop = true
      return Promise.reject(new Error('$cx.reject breakpoint'))
    }
  },
  _startGUI() {
    // console.log('startGUI',this)
    const fnmsg = function () {
      return `${this.card.cardno} ${this.card.name} 发动${this.type}效果`
    }

    return [this.phaseinfo(fnmsg), function () {
      const context = this
      const cx = context.cx
      return new Promise((resolve, reject) => {
        context.UImode = true
        $effectUI.context = this
        console.log('$cx._startGUI')
        // $effectUI.open(auto, resolve)
        // show message
        // $effectUI.showstart(context,resolve)
        resolve()
      })
    }]
  },
  // _openGUI(auto = 0) {
  //   return [this.phaseinfo('open GUI message'), function () {
  //     const context = this
  //     const cx = context.cx
  //     return new Promise((resolve, reject) => {
  //       mu.tcall(cx.phaseinfo, this, 'open GUI message')
  //       context.UImode = true
  //       $effectUI.context = this
  //       // $effectUI.open(auto, resolve)
  //       $effectUI.open()
  //       resolve()
  //     })
  //   }]
  // },
  // _closeGUI() {
  //   return [this.phaseinfo('close GUI message'), function () {
  //     const context = this
  //     const cx = context.cx
  //     return new Promise((resolve, reject) => {
  //       context.UImode = false
  //       // $effectUI.close()
  //       // resolve()
  //       $effectUI.waitclose(resolve)
  //     })
  //   }]
  // },
  // openUI(auto = 0) {
  //   return function () {
  //     const context = this
  //     const cx = context.cx
  //     return new Promise((resolve, reject) => {
  //       mu.tcall(cx.phaseinfo, this, 'open UI message')
  //       // context.UImode = true
  //       $effectUI.context = this
  //       // act state
  //       $effectUI.open(auto, resolve)
  //     })
  //   }
  // },
  // closeUI() {
  //   return function () {
  //     const context = this
  //     const cx = context.cx
  //     return new Promise((resolve, reject) => {
  //       // context.UImode = false
  //       $effectUI.close()
  //       resolve()
  //     })
  //   }
  // },
  RXbuff(power, tag) {
    return function () {
      const context = this
      const cx = context.cx
      const card = context.card
      return new Promise((resolve, reject) => {
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
        // $effectUI.showbuff(buff,resolve)
        // Rx.Observable.fromPromise(123)
        // .flatMap(function(result) {
        //   console.log('rx next1')
        // })
        // .subscribe(function onNext(result) {
        //   console.log('rx finish')
        // })
      })
    }
  },
}
