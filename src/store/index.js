import Vue from 'vue'
// require karma/mocha unit test vuex
import 'babel-polyfill'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './action'
import getters from './getters'

import storeDB from '@/components/SDWCardDB.json'
import deck1 from '@/components/player1.deck'

import _ from 'underscore'
import R from 'ramda'

import firstAgent from './agent-first'

Vue.use(Vuex)

const state = {
  storemsg: 'vuex store test',
  cardDB: {},
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

  placeholder: null,
  placelist: [],
  placeplayer: null,
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
  },
  turn: {},
  // battle package
  battle: {
    attacker: {
      player: null,
      main: null,
      support: null,
      hero: null,
    },
    defenser: {
      player: null,
      main: null,
      support: null,
      hero: null,
    },
  },
  player1: {
    id: 'playerId1',
    hero: 'heroId1',
    name: 'Jimmy',
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
    agent: firstAgent,
    // agent: null,
  },
  player2: {
    id: 'playerId2',
    hero: 'heroId2',
    name: 'Jomy',
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
    agent: firstAgent,
  },
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
})
