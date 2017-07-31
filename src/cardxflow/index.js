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
export var $messageUI
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
      $messageUI = payload.messageUI
      console.log('cardxflow install $messageUI', $messageUI)
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
    R.forEach((x) => {
      console.log(`tigger ${x.tag} ${x.source ? x.source.cardno : x.player.id} `);
      console.dir(x)
    })($effectlist)
  },
  $initeffect() {
    console.log('$cx.$initeffect')
    $effectlist = []
  },
  $addtigger(payload) {
    $effectlist.push(payload)
    const isPlayerTag = R.prop('player')(payload) ? true : false

    console.log(`$cx.$addtigger ${payload.source ? payload.source.cardno : payload.player.id} ${payload.tag} ${payload.type}`)
  },
  $removetigger(tag, card) {
    if (!card) {
      throw new Error('$removetigger card is null')
    }
    // way1: remove
    // $effectlist = R.filter( (x) => !(x.tag == tag && x.source.key == card.key) )($effectlist)
    // way2: make inactive first
    $effectlist = R.map((x) => {
      if (x.tag == tag && x.source.key == card.key) x.active = false
      return x
    })($effectlist)
    // TODO: way3 transduce
    // console.log(`removetigger ${tag} ${card.cardno}`, $effectlist.length)
  },
  $getlist(tag, card) {
    const cardcheck = card ? (x) => x.source.key == card.key : () => true
    const slotcheck = card ? (x) => x.slot.includes(x.source.slot) : () => true
    const tagcheck = card ? (x) => x.source.play[tag] : () => true

    if (tag === 'main') {
      // FIXME: main effect fix
      console.warn('$getlist is [main]');
      return R.filter((x) => x.tag == tag &&
        tagcheck(x) &&
        cardcheck(x))($effectlist)
    } else {
      return R.filter((x) => x.tag == tag &&
        !x.run && x.active &&
        tagcheck(x) &&
        cardcheck(x))($effectlist)
    }
  },
  $getnext(tag, card) {
    const list = this.$getlist(tag, card)
    return list.length > 0 ? R.head(list) : null
  },
  $emitall(taglist, card) {
    if (_.isString(taglist)) {
      const fromstring = taglist
      taglist = [fromstring]
    }
    return new Promise(async(resolve, reject) => {

      let tigger
      let tag = R.head(taglist)
      let ismessage = true
      do {
        // TODO: get list & make piority 修正算法
        tigger = undefined
        if (card)
          tigger = this.$getnext(tag, card)
        if (!tigger)
          tigger = this.$getnext(tag)

        ismessage = ['clear'].includes(tag) ? false : true
        if (tigger) {
          if (ismessage) console.log(`%c$emitnext tigger is ${tigger.tag}`, 'color:fuchsia', tigger.source)

          const isPlayerTag = tigger.player ? true : false
          const isEmit = tigger._type == 'emit' || tigger.player ? true : false

          // tigger now
          if (isEmit) {
            if (ismessage) console.log(`do emit tag ${tigger.tag} func`)
            // TODO: await mu.tcall(tigger.func, this, tigger)
            mu.tcall(tigger.func, this, tigger)
            // await mu.tcall(tigger.func, this, tigger)
          } else {
            await dispatch('TIGGER_EFFECT', {
              tag: tigger.tag,
              source: tigger.source,
            })
          }

          // TODO: 非常重要：不然会进入死循环
          tigger.run = true

        } else {
          taglist = R.drop(1, taglist)
          tag = R.head(taglist)
        }
      }
      while (tag)

      resolve()
    })
  },
  _setcontext(context = null) {
    if (context) {
      this.context = context
      this.active = true
      console.log('$cx.setcontext set')
    } else {
      this.context = null
      this.active = false
      console.log('$cx.setcontext clear')
    }
  },
  _settarget(card) {
    if (this.context) {
      this.context.target = card
      console.log(`$cx.settarget ${card.cardno}`, card)
    } else {
      this.context.target = null
      console.log(`$cx.settarget clear`)
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
  // pipe(...items) {
  //   return function () {
  //     const context = this
  //     const cx = context.cx
  //     const card = context.card
  //     cx._setcontext(context)
  //
  //     let fnlist = R.flatten(items)
  //
  //     let current = Promise.resolve().then(() => {
  //       console.group()
  //       console.log('cxpipe start')
  //       mu.tcall(cxrun, context, 'EFFECT_SOURCE', card)
  //       // BUG：这里call promise 产生错误
  //       // mu.tcall(cx.phaseinfo, context, `${card.cardno} ${card.name} 发动${this.type}效果`)
  //       return mu.tcall(cx.phaseinfo, context, `begin pipe 发动${this.type}效果`)
  //       // select current player/card
  //     })
  //     let promlist = fnlist.map((act) => {
  //       current = current.then(() => {
  //         console.log('pipe-----------------')
  //         if (_.isFunction(act)) {
  //           let res = mu.tcall(act, context, context)
  //           return res
  //         } else {
  //           return console.log(act)
  //         }
  //       }).then((result) => {
  //         // pipe next, re-align current source
  //         mu.tcall(cx.run, context, 'EFFECT_SOURCE', card)
  //       })
  //       return current
  //     })
  //     // console.log(promlist)
  //
  //     return Promise.all(promlist)
  //       .then(function (res) {
  //         console.log('-pipe OK---------')
  //       })
  //       .catch((err) => {
  //         console.log('%c-pipe catch------', 'color:red')
  //         console.log('%ccxpipe effect 中断 promise all', 'color:red')
  //         console.log('%c' + err, 'color:red')
  //         // TODO IDEA: 如果有catch时，错误会忽略/ effect.loop = true ／ 识别特殊 Error Object
  //         // console.log('context',context)
  //         if (context.loop) {
  //           throw 'cxpipe throw ERROR IN EFFECT FUNCTION'
  //         }
  //       }).then(function (res) {
  //         // final task
  //         // mu.clearMessage()
  //         console.groupEnd()
  //         cx._setcontext()
  //       })
  //   }
  // },
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
      const source = context.source
      let nextlevel = false

      if (cx.active) {
        // throw new Error('engage active is true')
        console.log(`%ccxengage next level`, 'color:blue')
        nextlevel = true
      } else {
        cx._setcontext(context)
      }

      let fnlist = R.flatten(items)

      let current = Promise.resolve().then(() => {
        console.group()
        console.log('$cx.engage start')
        // mu.tcall(cxrun, context, 'EFFECT_SOURCE', source)
        commit('EFFECT_SET', {
          source: source,
        })
        cxrun('EFFECT_SOURCE')

        // BUG：这里call promise 产生错误
        // mu.tcall(cx.phaseinfo, context, `begin ${card.cardno} ${card.name} 发动${this.type}效果`)
        // FIXME: return promise 就可以
        return mu.tcall(cx.phaseinfo, context, `begin engage 发动${this.type}效果`)
        // select current player/card
      })
      let promlist = fnlist.map((act) => {
        current = current.then(() => {
          if (!this.loop) {
            console.warn('$cx.engage nextlevel logic false')
            throw new Error('nextlevel logic false')
          }
          console.log('>>act-------------')
          if (_.isFunction(act)) {
            let res = mu.tcall(act, context, context)
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
          console.groupEnd()

          if (nextlevel) {
            // mu.tcall(cx.run, context, 'EFFECT_SOURCE', source)
            cxrun('EFFECT_SOURCE')

          } else {
            // clear first level context
            cx._setcontext()
          }
        })
    }
  },
  target(payload, filter) {
    // return [ this.phaseinfo('指定效果Target'), function() {
    // 获取函数名称
    // console.log('target caller', this.target.name );
    return function () {
      const context = this
      const cx = context.cx
      const source = context.source

      const fnselector = function (payload) {
        // console.log('$cx.target exec default selector')
        let actpayload = {
          selector: payload.from,
          filter: payload.filter,
        }
        const act = payload.opponent ? 'EFFECT_OPP_CHOICE' : 'EFFECT_CHOICE'
        // let list = mu.selectcards(payload.from)
        // list = R.filter(payload.filter)(list)
        // console.log(list,_.isArray(list));
        return dispatch(act, actpayload)
        // .then( (card)=> {
        //   console.log('$cx.target fnselector then',card)
        //   return card
        // })
      }

      if (R.is(String, payload)) {
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

      return new Promise(async function (resolve, reject) {
          console.log('$cx.target start')
          // console.dir(payload)

          let target = await mu.tcall(payload.selector, context, payload)
          // let target = await mu.tcall(fnselector,context,payload)
          // let target = await dispatch('EFFECT_CHOICE',payload.from)

          if (target) {
            resolve(target)
          } else {
            reject()
          }
        })
        .then((target) => {
          this.target = target
          // dispatch('EFFECT_TARGET', target)
          commit('EFFECT_SET', {
            target: target,
          })
          cxrun('EFFECT_TARGET')
          console.log('$cx.target targeting', context.target)
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
    if (R.is(String, payload)) {
      const fromstring = payload
      payload = {
        from: fromstring
      }
    }
    payload = R.assoc('opponent', true)(payload)
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

        if (context.UImode)
          $effectUI.showbuff(buff, resolve)
        else
          resolve()
      })
    }
  },
  buffjiban(star, powerup) {
    return function () {
      const context = this
      const cx = context.cx
      const card = context.card
      const fnbuff = (buff) => {
        let power = 0
        // console.log(buff.tag, card.slot)
        let place = mu.battleplace(card)
        let battle = $store.state.battle[place]
        let ismain = card.key === battle.main.key
        let list = []
        let logic = false

        if (ismain) {
          list = [battle.support]
          list = list.concat(battle.exsupport)
        } else {
          list = [battle.main]
        }

        logic = R.reduce((a, c) => {
          // console.log('buffjiban logic',a,c);
          if (!a) {
            a = R.lte(star, R.prop('star', c))
          }
          return a
        }, false)(list)

        // console.log('buffjiban ',place,battle,ismain,list,logic)
        if (logic) {
          // console.log(`cx.buffjiban 羁绊${star}成功 +${powerup}`);
          let msg = `cx.buffjiban 羁绊${star}成功 +${powerup}`
          buff.tag = msg

          // FIXME: show UI in buff calc
          if (context.UImode)
            $effectUI.showbuff(buff)

        } else {
          console.log(`cx.buffjiban 羁绊${star}失效`);
        }

        return logic ? powerup : 0
      }

      return new Promise(function (resolve, reject) {
        let tag = `buffjiban 羁绊 ${star} ${powerup}`
        let buff = {
          power: fnbuff,
          tag: tag,
          source: card,
          star: star,
          powerup: powerup,
        }
        console.log(`add cx.buffjiban ${card.name} star ${star}+${powerup}`)
        commit('ADD_BUFF', buff)

        // if (context.UImode)
        //   $effectUI.showbuff(buff, resolve)
        // else
        resolve()
      })
    }
  },
  effectChoice(payload) {
    return function () {
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
      return dispatch('EFFECT_CHOICE', payload)
        .then((card) => {
          this.target = card
          console.log('effectChoice target', context.target)
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
      let text = _.isFunction(message) ? mu.tcall(message, this) : message
      return $mainapp.gameloop_message(text)
    }
  },
  phaseinfo(message) {
    return function () {
      let text = _.isFunction(message) ? mu.tcall(message, this) : message
      return $mainapp.gameloop_phaseinfo(text)
    }
  },
  _stop(msg) {
    console.warn(msg)
    this.context.reason = msg
    this.context.loop = false
    // return Promise.reject(new Error(msg))
    return
  },
  when(pred = () => true, fnstop = () => '$cx.when logic false') {
    return function () {
      const context = this
      const cx = context.cx
      const logic = mu.tcall(pred, this)
      if (!logic) {
        // context.reason = mu.tcall(fnstop, this)
        context.reason = mu.tcall(fnstop, this)
        return cx._stop('$cx.when logic false')
      }

      return Promise.resolve(true)
    }
  },
  iif(pred = () => true, fntrue = () => true, fnfalse = () => true) {
    return function () {
      const logic = mu.tcall(pred, this)
      const fn = logic ? fntrue : fnfalse
      console.log('$cx.iif is', logic)
      return mu.tcall(fn, this)
    }
  },
  maybe({
    text = '是否发动效果',
    opponent = false,
  } = {}, fntrue = () => true, fnfalse = () => true) {
    return async function () {
      const context = this
      const cx = context.cx
      const source = context.source

      console.log('$cx.maybe logic')
      let logic = true
      let player = opponent ? mu.opponent(source.owner) : source.owner
      let isUMI = player.agent ? false : true
      // TODO: get value from agent by player

      // if (mu.isUMI || true) {
      console.log('messageLevel', mu.messageLevel, mu.styleUI, mu.autoUI, mu.HMIUI, $store.state.message);
      if (isUMI) {
        await $mainapp.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          $mainapp.$message({
            type: 'success',
            message: '发动成功!'
          })
          logic = true
        }).catch(() => {
          $mainapp.$message({
            type: 'info',
            message: '发动取消'
          })
          logic = false
        })
      }

      const fn = logic ? fntrue : fnfalse
      console.log('$cx.maybe is', logic)
      return mu.tcall(fn, this)
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

    return [function () {
        const context = this
        const cx = context.cx
        return new Promise((resolve, reject) => {
          context.UImode = true
          $effectUI.context = this
          console.log('$cx._startGUI')
          resolve()
        })
      },
      // this.phaseinfo(`${this.card.cardno} ${this.card.name} 发动${this.type}效果`)
      this.phaseinfo(fnmsg)
    ]
  },
}
