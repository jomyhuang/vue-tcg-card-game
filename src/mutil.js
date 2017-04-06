import Vue from 'vue'

import R from 'ramda'
import cardDB from '@/components/SDWCardDB.json'

export default {
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
      console.warn('mutil.opponent error no oppent')
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

  findcard(cardid) {
    // console.log('find card ', card, cardDB[card]);
    const gamecard = Object.assign({}, cardDB[cardid])
    // new prop for game card object
    Vue.set(gamecard, 'facedown', false)
    Vue.set(gamecard, 'selected', false)
    Vue.set(gamecard, 'selectable', false)
    Vue.set(gamecard, 'play', {})
    gamecard.power1 = this.convertPower(gamecard.power1)
    gamecard.power2 = this.convertPower(gamecard.power2)

    return gamecard
  }
}
