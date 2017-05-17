import Vue from 'vue'
import R from 'ramda'
import _ from 'lodash'

// import cardDB from '@/components/SDWCardDB.json'
import cardDB from '@/components/KJCardDB.json'
import effectDB from '@/components/SDWCardEffect.js'


// export function rx(type, payload) {
//   console.log('mutil.rx', this)
//
//   return this.store._actions[type] ? () => this.dispatch(type, payload) : () => this.commit(type, payload)
// }

export var $store = {}

export function testfn() {
  console.log('test func $store', $store)
  console.log('test func this', this)
}

// export function thiscard() {
//   return $store.state.placeholder
// }
//
// export function rxrun(type, payload) {
//   // return store._actions[type] ? () => store.dispatch(type, payload) : () => store.commit(type, payload)
//   return function () {
//     const fn = $store._actions[type] ? $store.dispatch : $store.commit
//     const card = thiscard()
//     return fn.call(card, type, payload)
//     // const cardfn = fn.bind(card)
//     // return cardfn(type,payload)
//   }
// }
//
// export function pipec(...items) {
//   // let pipearr = []
//   // items.forEach((effect) => {
//   //   const fn = effect.bind($store.placeholder)
//   //   pipearr.push(fn)
//   // })
//   // return pipearr
//   return items
// }



export default {
  // store,
  mixin: false,
  tap(fn) {
    console.log('mutil tap this func', this)
  },
  assert(...args) {
    return console.assert(...args)
  },
  mixinEffect(payload) {

    let source = effectDB

    if (payload) {
      if (payload._actions) {
        $store = payload
        console.log('mutil install $store', $store)
      } else {
        source = payload
        console.log('mixeffect other source')
      }
    }
    if (!$store._actions) {
      console.error('设置store在mixeffect前')
    }

    if (this.mixin && source === effectDB) {
      return
    }

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
    const init = {
      storemsg: 'vuex default state',

      // game app
      currentPlayer: null,
      opponentPlayer: null,
      firstPlayer: null,

      // chain function
      placeholder: null,
      placelist: [],
      placeplayer: null,
      pickindex: -1,
      test: {},
      // ACT_SELECT_CARD_...
      act_selection: {
        list: [],
        many: 0,
        selectedAction: null,
        selectedMuation: null,
        thenAction: null,
        selectedList: [],
        agent: null,
      },
      // game/turn package
      ramda: {},
      game: {
        started: false,
        turnCount: 0,
        over: false,
        score: {
          reason: '',
          draw: false,
          win: null,
          lose: null,
        },
        config: {
          message: false,
          battelshow: false,
          battleshow_pauseonly: false,
          maxturn: 99,
        },
      },
      turn: {},
      // battle package (move to default)
      battle: {
        attacker: {
          player: null,
          main: null,
          support: null,
          hero: null,
          power: [],
          chain: [],
        },
        defenser: {
          player: null,
          main: null,
          support: null,
          hero: null,
          power: [],
          chain: [],
        },
        score: {
          finish: false,
          winside: null,
          draw: false,
          win: null,
          lose: null,
        },
        chain: [],
      },
      // player list
      players: [],
      player1: {
        id: 'playerId1',
        hero: 'heroId1',
        name: 'PLAYER-1',
        cardPool: [],
        deck: [],
        zone: [],
        hand: [],
        graveyard: [],
        base: [],
        supporter: [],

        secrets: [],
        effects: [],
        auras: [],
        minions: [],
        mana: 0,
        maxMana: 10,
        agent: null,
        // agent: null,
      },
      player2: {
        id: 'playerId2',
        hero: 'heroId2',
        name: 'PLAYER-2',
        cardPool: [],
        deck: [],
        zone: [],
        hand: [],
        graveyard: [],
        base: [],
        supporter: [],

        secrets: [],
        effects: [],
        auras: [],
        minions: [],
        mana: 0,
        maxMana: 10,
        agent: null,
      },
    }

    R.forEachObjIndexed((value, key) => {
      // console.log('each ' + key + ':' + value)
      state[key] = value
    })(init)
  },
  battleInit(state) {
    state.battle = {
      attacker: {
        player: null,
        main: null,
        support: null,
        hero: null,
        power: [],
        chain: [],
      },
      defenser: {
        player: null,
        main: null,
        support: null,
        hero: null,
        power: [],
        chain: [],
      },
      score: {
        finish: false,
        winside: null,
        draw: false,
        win: null,
        lose: null,
      },
      chain: [],
    }
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
    // new prop for game card object
    // Vue.set(gamecard, 'facedown', facedown)
    // Vue.set(gamecard, 'selected', false)
    // Vue.set(gamecard, 'selectable', false)
    // Vue.set(gamecard, 'play', {})

    gamecard = R.merge(gamecard, {
      facedown: facedown,
      selected: false,
      selectable: false,
      owner: player,
      play: {},
      power: [],
    })

    gamecard.power1 = this.convertPower(gamecard.power1)
    gamecard.power2 = this.convertPower(gamecard.power2)

    return gamecard
  },
  makepower(card, power = 0, effect, tag) {
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
  addbuff(card, power = 0, effect, tag) {
    if (!R.isNil(effect) && R.isNil(tag) && power > 0) {
      tag = `${effect} UP +${power}`
    }
    let buff = {
      card: card,
      power: power,
      effect: effect,
      tag: tag,
    }
    card.power.push(buff)
    return buff
  },
  makeflat(chain) {
    // reduce version
    return R.reduce((a, x) => {
      if (x) {
        let sublist = R.prop('power')(x)
        a = R.into(a, R.map(R.prop('power')))(sublist)
      }
      return a
    }, [])(chain)
  },
  reducepower(chain) {
    return R.reduce((a, x) => {
      let sum = 0
      if (x) {
        let sublist = R.prop('power')(x)
        let powerlist = R.map(R.prop('power'))(sublist)
        sum = R.reduce(R.add, 0)(powerlist)
      }
      return a + sum
    }, 0)(chain)
  },
  selectcards(selector) {

    const placeplayer = $store.state.placeplayer
    const placelist = $store.state.placelist
    const state = $store.state
    let list

    console.log('mutil.selectcards selector', selector)

    if (R.is(String, selector)) { // string
      switch (selector) {
        case 'placelist':
          list = placelist
          console.log(`mutil.selectcards (type keyword ${selector}) select`, list)
          break
        default:
          const opt = R.split('_', selector)

          if (opt.length > 1 && opt[0] === 'opp') {
            // 处理选择对手的牌库
            let oppplayer = this.opponent(placeplayer)

            list = oppplayer[opt[1]]
            console.log('mutil.selectcards (type string) opponent select', list)
          } else {
            list = placeplayer[selector]
            console.log(`mutil.selectcards (type string) placeplayer ${placeplayer.id} select`, list)
          }
      }
    }
    else if (_.isFunction(selector)) { // function
      console.log(`mutil.selectcards (type function) select call`)
      list = selector.call(state)
      console.log(`mutil.selectcards (type function) select`, list)
    }
    else if (R.is(Array, selector)) { // array
      list = selector
      console.log(`mutil.selectcards (type array) select`, list)
    }
    else if (_is.isNil(selector)) { // undefined/Nil
      list = placelist
      console.log(`mutil.selectcards (type Nil) select placelist`, list)
    }
    else {
      throw `mutil.selectcards (type unknown) select`
    }

    return list
  },
}
