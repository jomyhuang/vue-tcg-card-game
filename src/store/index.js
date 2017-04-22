import Vue from 'vue'
// require karma/mocha unit test vuex
// import 'babel-polyfill'
// move to karma.conf.js
// files: [
//   '../../node_modules/babel-polyfill/dist/polyfill.js',
//   './index.js'
// ],
import Vuex from 'vuex'

import mutation1 from './mutations'
import mutation2 from './mutation2'
import actions1 from './action'
import actions2 from './action2'
import getters from './getters'

import _ from 'underscore'
import R from 'ramda'
import mutil from '@/mutil'

Vue.use(Vuex)

const mutations = R.mergeAll([mutation1, mutation2])
const actions = R.mergeAll([actions1, actions2])

const state = {
  storemsg: 'vuex store test',
  // cardDB: {},
  // page
  pageFullList: [],
  pageList: [],
  pageKeyList: [],
  pageCurrent: 1,
  pagePerItems: 10,
  pageTotalPage: 0,
  // pageNextDisabled: false,
  // pagePrevDisabled: false,
  pageFilter: 'all',

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

// const defaultstate = mutil.defaultGameState()

export default new Vuex.Store({
  state,
  // defaultstate,
  getters,
  actions,
  mutations,
})
