import Vue from 'vue'

import R from 'ramda'
import _ from 'underscore'

import cardDB from '@/components/SDWCardDB.json'
import effectDB from '@/components/SDWCardEffect.js'

export default {
  mixinEffect() {
    const combine = (value, key) => {
      console.log('minxin ' + key + ':' + value)

      let card = cardDB[key]
      if (card) {
        // if(R.has('effect')(cardDB[key])) {
        // !!! assoc create new object
        // card = R.assoc('effect',value)(card)
        // R.assoc 会建立新对象，无法bind到原生CardDB
        card.effect = value

        // OK1:
        // let mounted = R.bind(R.prop('mounted')(card.effect),card)
        // R.apply(mounted)(card)
        // let log = (x) => console.log('tap ' + x)

        let callmounted = R.pipe(
          R.path(['effect', 'mounted']),
          // bind for mounted function
          R.bind(R.__, card),
          R.call,
          // R.tap(console.log),
          // bind for "return function"
          R.bind(R.__, card),
          // ok for R.apply 必须要有第二参数[], 如果缺少必要参数就会“等待完整参数后才运行”
          // OK! R.apply(R.__,[]),
          R.call,
        )
        // check it out: 如何带入闭包的card值
        // call可以
        // apply work 必须要有第二参数[]
        // OK! let result = R.apply(callmounted(card),[])
        let resuult = callmounted(card)
        // console.log(result)

        this.callEffect('isAttacker', card)

        // OK2: 传统bind方式
        // let mounted = card.effect.mounted
        // if(mounted) {
        //   // OK1: bind way, to gen new function
        //   // let bindfunc = mounted.bind(card)
        //   // bindfunc({})
        //   // OK2: apply this directly
        // mounted.apply(card,{})
        // }
      } else {
        console.warn(`mixinEffect key not found ${key}`);
      }
    }

    R.forEachObjIndexed(combine)(effectDB)

    console.log('mutil mixin effect DB finish')
  },
  callEffect(effectkey, initpayload = {}, condition) {

    let payload = {
      card: undefined,
      player: 'testplayer',
      opponent: undefined,
      state: undefined,
      commit: undefined,
      dispath: undefined
    }
    let buffs


    let card = R.prop('card')(initpayload)
    if (_.isUndefined(card)) {
      card = initpayload
      initpayload = {
        card: card
      }
    }

    payload = R.merge(payload)(initpayload)
    // console.log(card,payload);
    // test
    card.play = {
      isAttacker: true
    }
    if (_.isUndefined(condition)) {
      condition = (card, key) => R.path(['play', key])(card)
    }

    // console.log('condition', condition(card,effectkey));

    if (condition(card, effectkey)) {
      console.log(`callEffect ${effectkey} activate check card effect function`)
      let effect = R.path(['effect', effectkey])(card)
      // console.log(effect);

      if (effect) {
        console.log(`callEffect ${card.name} ${effectkey} function start`)
        // pack 给内置函数，跟返回闭包箭头函数使用
        let func = effect.apply(card, [payload])
        // pack 给返回标准闭包函数使用
        buffs = func.apply(card, [payload])
        console.log(`callEffect ${effectkey} function end buff ${buffs}`)

        // return buffs rights!
        return buffs
      }
    }
  },
  convertPower(strpower = '') {
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
  makecard(cardid, facedown = false) {
    // console.log('find card ', card, cardDB[card]);
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
      play: {},
    })

    gamecard.power1 = this.convertPower(gamecard.power1)
    gamecard.power2 = this.convertPower(gamecard.power2)

    return gamecard
  }
}
