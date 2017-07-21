import Vue from 'vue'
import R from 'ramda'
import _ from 'lodash'
import $cx from '@/cardxflow'
import tiggermap from '@/cardxflow/tiggermap'

// import cardDB from '@/components/SDWCardDB.json'
import cardDB from '@/components/KJCardDB.json'
import effectDB from '@/components/SDWCardEffect.js'
// state init const
import {
  initstate,
  initbattle,
} from '@/store/index.js'

export var $store = {}
export var $mainapp
export var $effectUI
export var $effectChoiceUI
var dispatch
var commit


export function testfn() {
  console.log('test func $store', $store)
  console.log('test func this', this)
}

export var UIShow

export default {
  // store
  mixin: false,
  _isTestmode: false,
  ucardid: 0,
  // testmode: false,
  tap(fn) {
    console.log('mutil tap this func', this)
  },
  tapUI() {
    console.log('tapUI', UIShow)
    return UIShow(1500)
  },
  setUI(fn) {
    // console.log('setUI',fn);
    UIShow = fn
  },
  assert(...args) {
    return console.assert(...args)
  },
  getfuncname(fn) {
    // 获取函数名称
    console.log('mutil.getfuncname', fn.name)
    return fn.name
  },
  clearMessage() {
    if (this.isTestmode) return
    // $mainapp.$Message.destroy()
    // $mainapp.$Notice.destroy()
  },
  setTestmode(mode = true) {
    // manual test mode flag
    this.isTestmode = mode
    return mode
  },
  getChoiceUI(UI) {
    return UI ? $effectChoiceUI : null
  },
  // isTestmode {
  //   // manual test mode flag
  //   return this.testmode || process.env.NODE_ENV === 'testing'
  // },
  mixinEffect(payload) {

    let source = effectDB

    if (payload) {
      if (payload.store) {
        $store = payload.store
        // console.log('mutil install $store', $store)
        dispatch = $store.dispatch
        commit = $store.commit

        $mainapp = payload.mainapp
        // console.log('mutil install $mainapp', $mainapp)
        $effectUI = payload.effectUI
        // console.log('mutil install $effectUI', $effectUI)
        $effectChoiceUI = payload.effectChoiceUI
        // console.log('mutil install $effectChoiceUI', $effectChoiceUI)
      } else {
        source = payload
        console.log('mixeffect 其他效果库')
      }
    }
    this.assert($store._actions, '设置store在mixeffect前')

    if (this.mixin && source === effectDB) {
      console.error('effectDB已经mixin')
      return
    }

    // inital test mode
    this._isTestmode = process.env.NODE_ENV === 'testing'

    // isTestmode property
    Object.defineProperty(this, 'isTestmode', {
      // value: false,
      get: function () {
        // console.log('isTestmode property get')
        return this._isTestmode || process.env.NODE_ENV === 'testing'
      },
      set: function (val) {
        // console.log('isTestmode property set')
        this._isTestmode = val
      },
      // writable: true,
      enumerable: true,
      configurable: true,
    })

    const combine = (value, key) => {
      console.log('minxin ' + key + ':' + value)

      let card = cardDB[key]
      if (card) {
        // if(R.has('effect')(cardDB[key])) {
        // !!! assoc create new object
        // card = R.assoc('effect',value)(card)
        // R.assoc 会建立新对象，无法bind到原生CardDB

        card.effect = value
        const fn = card.effect['mounted'] || (() => {})
        const result = fn.call(card)

        // OK1:
        // let mounted = R.bind(R.prop('mounted')(card.effect),card)
        // R.apply(mounted)(card)
        // let log = (x) => console.log('tap ' + x)

        // OK2: Ramda func way
        // let mounted = R.path(['effect', 'mounted'])
        // let callmounted =
        //   R.when(
        //     mounted,
        //     R.pipe(
        //       mounted,
        //       // bind for mounted function
        //       R.bind(R.__, card),
        //       R.call,
        //       // R.tap(console.log),
        //       // bind for "return function"
        //       // R.bind(R.__, card),
        //       // ok for R.apply 必须要有第二参数[], 如果缺少必要参数就会“等待完整参数后才运行”
        //       // OK! R.apply(R.__,[]),
        //       // R.call,
        //     )
        //   )

        // check it out: 如何带入闭包的card值
        // call可以
        // apply work 必须要有第二参数[]
        // OK! let result = R.apply(callmounted(card),[])
        // OK2: 传统bind方式
        // let mounted = card.effect.mounted
        // if(mounted) {
        //   // OK1: bind way, to gen new function
        //   // let bindfunc = mounted.bind(card)
        //   // bindfunc({})
        //   // OK2: apply this directly
        // mounted.apply(card,{})
        //
        // let result = callmounted(card)

      } else {
        console.warn(`mixinEffect key not found ${key}`);
      }
    }
    console.log('mutil mixin effect DB start')

    R.forEachObjIndexed(combine)(source)

    this.mixin = true
    console.log('mutil mixin effect DB finish')
  },
  ___callEffect(effectkey, initpayload = {}, condition) {
    // move to TIGGER_EFFECT
    // return new Promise(async function (resolve, reject) {
    return () => {
      let payload = {
        card: undefined,
        player: undefined,
        opponent: undefined,
        state: undefined,
        commit: undefined,
        dispath: undefined,
        buff: undefined,
        rxdispatch: undefined,
        rxcommit: undefined,
      }
      let result = false

      let card = R.prop('card')(initpayload)
      if (R.isNil(card)) {
        card = initpayload
        initpayload = {
          card: card
        }
      }

      payload = R.merge(payload)(initpayload)
      // console.log(card,payload);
      // test
      // card.play = {
      //   isAttacker: true
      // }
      if (R.isNil(condition)) {
        condition = (card, key) => R.path(['play', key])(card)
      }

      // console.log('condition', condition(card,effectkey));

      if (condition(card, effectkey)) {
        // console.log(`callEffect ${effectkey} activate check card effect function`)
        let effect = R.path(['effect', effectkey])
        // let effect = R.path(['effect', effectkey])(card)
        // console.log(effect);

        let effectfunc = R.when(
          effect,
          R.pipe(
            effect,
            R.bind(R.__, card),
            R.apply(R.__, [payload]),
            // bind for "return function"
            // R.bind(R.__, card),
            // ok for R.apply 必须要有第二参数[], 如果缺少必要参数就会“等待完整参数后才运行”
            // R.apply(R.__, [payload]),
          )
        )

        if (effect(card)) {
          console.warn(`callEffect ${card.name} [${effectkey}] functor tigger`)
          // result = effectfunc(card)
          // return result
          result = effect(card).apply(card, [payload])
          if (R.is(Object, result)) {
            // console.log('callEffect result is object')
          } else {
            result = true
          }
        } else {
          // console.log(`callEffect ${card.name} no ${effectkey} function`)
        }

        // if (effect) {
        //   console.log(`callEffect ${card.name} ${effectkey} function start`)
        //   // pack 给内置函数，跟返回闭包箭头函数使用
        //   let func = effect.apply(card, [payload])
        //   // pack 给返回标准闭包函数使用
        //   buffs = func.apply(card, [payload])
        //   console.log(`callEffect ${effectkey} function end buff ${buffs}`)
        //
        //   // return buffs rights!
        //   return buffs
        // } else {
        //   console.log(`callEffect ${card.name} no ${effectkey} function`)
        // }
      } else {
        // console.log(`callEffect ${effectkey} no effect tag`);
      }

      return result
      // resolve(result)
      // })
    }
  },
  Rdefaults(x, y) {
    const defaults = R.flip(R.merge)
    return defaults(x, y)
  },
  convertPower(strpower = '') {
    if (R.is(Number, strpower)) {
      return strpower
    }

    const rep = R.split(/(\d+)(亿|万)/)

    let list = R.splitEvery(2)(R.filter(x => x, rep(strpower)))
    let power = R.reduce((prev, data) => {
      // console.log('convertPower ---',prev,data)
      if (data.length <= 1) {
        console.warn('convertPower string error')
        return 0
      }
      return prev + (data[1] == '亿' ? parseInt(data[0]) * 1000 : parseInt(data[0]) / 10)
    }, 0)(list)

    // console.log(`convertPower ${strpower} to ${power}`);
    return power
  },
  checkAnti(main, enemy) {
    let result = false
    if (main == "T" && enemy == "A") {
      result = true
    } else if (main == "A" && enemy == "H") {
      result = true
    } else if (main == "H" && enemy == "T") {
      result = true
    }
    // console.log(`checkAnti ${main} vs ${enemy}`);
    if (result)
      console.log(`checkAnti is true power up ${main} vs ${enemy}`);

    return result
  },
  opponent(list, who) {
    if (arguments.length == 1) {
      who = list
      list = $store.state.players
    }

    let result = null
    if (list[0] === who) {
      result = list[1]
    } else if (list[1] === who) {
      result = list[0]
    } else {
      console.error('mutil.opponent error no oppent')
    }
    return result
  },
  resetGameState(state) {

    const init = R.clone(initstate)
    if (init.player1.deck.length > 0) {
      throw 'mutil.resetGameState init object is not default'
    }
    // FIXME: 在测试环境中 replacestate失效
    // console.log('resetGameState by repalceState')
    // $store.replaceState(initstate)
    // console.log(initstate)

    R.forEachObjIndexed((value, key) => {
      state[key] = value
    })(init)

    if (state.player1.deck.length > 0) {
      throw 'mutil.resetGameState fail init object'
    }

    $cx.$initeffect()

    return init
  },
  battleInit(state) {
    return R.clone(initbattle)
  },
  makecard(cardid, player = {}, facedown = false) {
    // console.log('find card ', card, cardDB[card]);

    if (R.is(Boolean, player)) {
      facedown = player
      player = {}
    }

    if (!R.has('id', player)) {
      console.warn(`mutil.makecard ${cardid} no owner`)
    }

    let gamecard = Object.assign({}, cardDB[cardid])

    gamecard = R.merge(gamecard, {
      key: this.ucardid++,
      // key: Symbol('uid'),
      facedown: facedown,
      selected: false,
      selectable: false,
      owner: player,
      slot: undefined,
      // powerup: false,
      // power: 0,
      buffs: [],
      play: {},
      active: false,
      effecttext: cardDB[cardid].effecttext ? cardDB[cardid].effecttext : '无效果',
    })

    gamecard.power1 = this.convertPower(gamecard.power1)
    gamecard.power2 = this.convertPower(gamecard.power2)
    // gamecard.power = gamecard.power1

    return gamecard
  },
  makebuff(card, power = 0, effect, tag) {
    if (!R.isNil(effect) && R.isNil(tag) && power > 0) {
      tag = `${effect} UP +${power}`
    }
    let buff = {
      card: card,
      power: power,
      effect: effect,
      tag: tag,
    }
    // card.power.push( buff )
    return buff
  },
  // addbuff(card, power = 0, effect, tag) {
  //   if (!R.isNil(effect) && R.isNil(tag) && power > 0) {
  //     tag = `${effect} UP +${power}`
  //   }
  //   let buff = {
  //     card: card,
  //     power: power,
  //     effect: effect,
  //     tag: tag,
  //   }
  //   card.power.push(buff)
  //   return buff
  // },
  // makeflat(chain) {
  //   // reduce version
  //   return R.reduce((a, x) => {
  //     if (x) {
  //       let sublist = R.prop('power')(x)
  //       a = R.into(a, R.map(R.prop('power')))(sublist)
  //     }
  //     return a
  //   }, [])(chain)
  // },
  // reducepower(chain) {
  //   return R.reduce((a, x) => {
  //     let sum = 0
  //     if (x) {
  //       let sublist = R.prop('power')(x)
  //       let powerlist = R.map(R.prop('power'))(sublist)
  //       sum = R.reduce(R.add, 0)(powerlist)
  //     }
  //     return a + sum
  //   }, 0)(chain)
  // },
  selectcards(selector) {

    const placeplayer = $store.state.placeplayer
    const placelist = $store.state.placelist
    const state = $store.state
    let list

    // console.log('mutil.selectcards selector', selector)

    if (_.isString(selector)) { // string
      switch (selector) {
        case 'placelist':
          list = placelist
          // console.log(`mutil.selectcards (type keyword ${selector}) select`, list)
          break
        default:
          const opt = R.split('_', selector)

          if (opt.length > 1 && opt[0] === 'opp') {
            // 处理选择对手的牌库
            let oppplayer = this.opponent(placeplayer)

            list = oppplayer[opt[1]]
            // console.log(`mutil.selectcards (type string ${selector}) opponent select`, list)
          } else {
            list = placeplayer[selector]
            // console.log(`mutil.selectcards (type string ${selector}) placeplayer ${placeplayer.id} select`, list)
          }
      }
    } else if (_.isArray(selector)) { // array
      list = selector
      // console.log(`mutil.selectcards (type array) select`, list)
    } else if (_.isFunction(selector)) { // function
      // console.log(`mutil.selectcards (type function) select call`)
      list = selector.call(state)
      // console.log(`mutil.selectcards (type function) select`, list)
    } else if (_.isNil(selector)) { // undefined/Nil
      list = placelist
      // console.log(`mutil.selectcards (type Nil) select placelist`, list)
    } else {
      throw `mutil.selectcards (type unknown) select`
    }

    this.assert(_.isArray(list), `selectcards list is not array`)

    return list
  },
  isPromise(val) {
    return val && typeof val.then === 'function'
  },
  call(fn, thisobj, ...args) {
    let res
    if (!_.isFunction(fn)) {
      return fn
    }
    res = fn.apply(thisobj, args)
    return res
  },
  // Trampoline functional
  tcall(fn, thisobj, ...args) {
    let res
    if (!_.isFunction(fn)) {
      return fn
    }
    res = fn.apply(thisobj, args)
    // if(!this.isPromise(res)) {
    //   res = Promise.resolve(res)
    // }
    return this.tcall(res, thisobj, ...args)
  },
  packcall(fn, thisobj, ...args) {
    let res = []
    if (R.is(Array, fn)) {
      res = fn
    } else if (_.isFunction(fn)) {
      // res = fn.apply(thisobj, args)
      res = this.tcall(fn, thisobj, ...args)
      res = R.is(Array, res) ? res : [res]
      // res = R.flatten(res)
    } else {
      res = [fn]
    }
    return res
  },
  packisNil(pack) {
    return R.isNil(pack) || R.isNil(R.head(pack))
  },
  maketigger(payload) {
    const map = R.propOr({}, payload.tigger)(tiggermap)
    // const map = tiggermap[payload.tigger]
    // console.log(map);
    let tigger = R.merge({
      tigger: undefined,
      type: 'once',
      source: undefined,
      run: false,
      from: undefined,
      active: true,
      func: () => true,
      target: undefined,
      when: () => true,
      slot: [],
    })(payload)
    tigger = R.merge(tigger)(map)

    return tigger
  },
  hasTag(tag, place = $store.state.placeholder) {
    const isPlayerTag = R.prop('deck',place)
    if(isPlayerTag)
      return !R.isNil(place.effects[tag])
    else
      return !R.isNil(card.play[tag]) || !R.isNil(card.owner.effects[tag])
  },
  addTag(payload, ...items ) {
    let tag, card, player, opponent, val
    if( R.is(Object, payload)) {
      // 结构如果没有 let 必须要加 ()
      ({ tag, card, player, opponent, val=true } = payload);
    }
    else {
      // 如果结构没有值就会变成undefined
      // 结构 payload 会跟下方的 () 变成函数错误，加上 ;
      tag = payload;
      ([ card, player, opponent, val=true ] = items);
      // console.log(tag);
      // console.log(card);
    }

    if (!card && !player) {
      throw new Error('mu.addTag card/player is null')
    }
    const isPlayerTag = R.path([tag,'_type'])(tiggermap) == 'player' || player ? true : false
    //
    // console.log(tag,card,player);
    if(isPlayerTag) {
      if(R.is(Boolean, player))
        player = $store.state.placeplayer
      else
        player = player ? player : $store.state.placeplayer

      player = opponent ? this.opponent(player) : player

      console.log(`mu.addTag add player ${player.id} ${tag}`)
      player.effects = R.assoc(tag, val)(player.effects)
    }
    else {
      card = card ? card : $store.state.placeholder
      if(!card)
        throw new Error('mu.addTag card is null')

      if(opponent) {
        throw new Error('mu.addTag card tag but opponent is true')
      }

      card.play = R.assoc(tag, val)(card.play)

      // EFFECTNEW add tag tigger
      let effect = R.path(['effect', tag])(card)
      if (effect) {
        let tigger = this.maketigger({
          from: 'tagtigger',
          tigger: tag,
          source: card,
          func: effect,
          type: 'once',
          // slot: ['zone', 'supporter'],
        })
        const when = R.path(['effect', tag.concat('When')])(card)
        if (when) {
          tigger.when = when
        }
        if (!tigger.slot.length) {
          tigger.slot = ['zone', 'supporter']
        }

        return $cx.$addtigger(tigger)
      }
    }

    // console.log(`mu.addtag ${card.cardno} ${tag}`,card.play);
    return card
  },
  removeTag(tag, place = $store.state.placeholder ) {
    if (!place) {
      console.log('mu.removeTag place is null')
      return
    }
    const isPlayerTag = R.prop('deck',place)

    if(isPlayerTag) {
      let player = place
      player.effects = R.dissoc(tag)(player.effects)
      // console.log(`mu.removeTag player ${tag}`,player);
    }
    else {
      let card = place
      card.play = R.dissoc(tag)(card.play)
      // EFFECTNEW remove tag tigger
      $cx.$removetigger(tag, card)
      // console.log(`mu.removeTag ${card.cardno} ${tag}`,card.play);
    }

    return place
  },
  checkslot() {
    console.log('mutil.checkslot')

    R.forEach((player) => {
      R.forEach((slot) => {
        R.forEach((card) => {
          if (card.slot !== slot) {
            console.log(`checkslot error ${player} ${slot} ${card.cardno} != ${card.slot}`);
            throw new Error('mutil.checkslot error! ')
          }
        })($store.state[player][slot])
      })(['deck', 'hand', 'base', 'zone', 'graveyard'])
    })(['player1', 'player2'])

    return true
  },
  getslot(player, slot) {
    const list = R.path([player, slot])($store.state)
    return list ? R.filter(x => x.slot === slot)(list) : []
  },
  moveslot(toslot, card, maketigger = true) {
    const from = card.slot
    card.slot = toslot
    if(!$store.state.game.turnCount) {
      // console.log('moveslot game not start yet skip tigger')
      return card
    }

    // TODO: clear some tag/tigger when diff slot
    if (from)
      this.removeTag({ tag:'at' + _.capitalize(from), card: card })
    if (toslot && maketigger)
      this.addTag({ tag:'at' + _.capitalize(toslot), card: card})
    return card
  },
  activecard(card) {

    if (!card) {
      console.log('mu.activecard is null');
      return
    }
    const effect = R.prop('effect')(card)
    if (!effect) {
      return
    }

    // 主动技能列表
    // const tiggerlist = {
    //   main: {
    //     type: 'once',
    //   },
    // }

    R.forEachObjIndexed((v, k) => {
      const map = R.propOr({}, k)(tiggermap)
      const from = R.propEq('from', 'active')(map)
      if (from) {
        let payload = this.addTag({ tag: k, card: card })
        console.log(`mu.activecard 主动技能 tigger ${card.cardno} ${k}`, payload)
      }
    })(effect)

    return card
  },
  tiggerEffect(tag, card) {
    // TAG tigger
    return dispatch('TIGGER_EFFECT', {
      tag: tag,
      source: card
    }).then(async() => {

      await $cx.$emitnext(['at1', 'at2', 'at3', 'atGraveyard'])

      // WAY1:
      // let next
      // do {
      //   next = $cx.$emitnext(['at1', 'at2', 'at3', 'atGraveyard'])
      //   if (next) {
      //     console.log(`mu.tiggerEffect after emit ${next.tigger} ${next.source.cardno}`)
      //     await dispatch('TIGGER_EFFECT', {
      //       tag: next.tigger,
      //       source: next.source
      //     })
      //     console.log('mu.tiggerEffect after emit finish ')
      //   }
      // } while (next)

      // WAY2:
      // let next = $cx.$getnext('atGraveyard')
      // if(next) {
      //   console.log('mu.tiggerEffect after ')
      //   console.log('tiggerlist do atGraveyard')
      //   await dispatch('TIGGER_EFFECT', { tag: next.tigger, source: next.source })
      //   console.log('mu.tiggerEffect after finish ')
      // }
    })
  }
}
