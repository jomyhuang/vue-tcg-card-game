import Vue from 'vue'
// require karma/mocha unit test vuex
import 'babel-polyfill'
import Vuex from 'vuex'
// import storeDB from './components/CardDB.json'
import storeDB from './components/SDWCardDB.json'
import deck1 from './components/player1.deck'

import _ from 'underscore'
import R from 'ramda'

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
  gameStarted: false,
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
  },
  // game/turn package
  turnCount: 0,
  turn: {

  },
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
    agent: null,
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
    agent: null,
  },
}
const mutations = {
  TOGGLE_LOADING (state) {
    state.callingAPI = !state.callingAPI
  },
  TOGGLE_SEARCHING (state) {
    state.searching = (state.searching === '') ? 'loading' : ''
  },
  SET_USER (state, user) {
    state.user = user
  },
  SET_TOKEN (state, token) {
    state.token = token
  },
  TEST_STORE (state, payload ) {
    state.storemsg = payload
  },
  INIT_DB (state) {
    state.cardDB = storeDB

    // deck init
    console.log( 'deck1', deck1, 'length', deck1.length )
    // 转换成数组便利处理
    // state.cardDB = JSON.parse(storeDB || '[]')
    state.pageFullList = []
    // exam = Object.keys(exam).map(function(k){return exam[k]});
    Object.keys(state.cardDB).forEach( (k) => state.pageFullList.push( state.cardDB[k] ) )
    state.pageKeyList = state.pageFullList

    console.log( 'JSON to fulllist/keylist array', state.pageFullList )

    state.storemsg = 'INIT_DB loaded'
    console.log( 'commit INIT_DB' )
  },
  // 结构双重默认值写法
  FETCH_REFRESH ( state, { pagePerItems = 10, filter = 'all', filterfunc = {} } = {} ) {
    state.pagePerItems = pagePerItems
    state.pageFilter = filter

    state.pageKeyList = []
    if( state.pageFilter == 'all' ) {
      // full list
      state.pageKeyList = state.pageFullList
    } else {
      // filter
      // state.pageKeyList = state.pageFullList.filter( (n) => n.cost == 2 )
      // filterfunc = (n) => n.cost > 2
      state.pageKeyList = state.pageFullList.filter( filterfunc )
      console.log('filter', state.pageFilter )
    }
    state.pageTotalPage = parseInt( state.pageKeyList.length / state.pagePerItems )
    state.pageTotalPage += state.pageKeyList.length % state.pagePerItems ? 1 : 0
    state.pageCurrent = 1
    state.pageList = []

    state.storemsg = 'FETCH_REFRESH'
    console.log( 'commit FETCH_REFRESH pageTotalPage', state.pageTotalPage )
    console.log( 'FETCH_REFRESH pagePerItems' , state.pagePerItems, 'filter', state.pageFilter )
  },
  FETCH_PAGE ( state, pageno = 1 ) {
    state.pageList = []
    pageno = Math.min( pageno, state.pageTotalPage )
    pageno = Math.max( pageno, 1 )
    state.pageCurrent = pageno

    let start = ( state.pageCurrent -1 ) * state.pagePerItems
    let end = Math.min( start + state.pagePerItems -1, state.pageKeyList.length -1 )
    for(  ; start <= end ; start++ ) {
      // 使用 array, 不是 Object
      // state.pageList.push( state.cardDB[ state.pageKeys[ start+index ] ]  )
      // state.pageList.push( state.cardDB[ state.pageKeys[ start ] ]  )
      state.pageList.push( state.pageKeyList[ start ] )
    }
    // state.pageNextDisabled = state.pageCurrent >= state.pageTotalPage ? true : false
    // state.pagePrevDisabled = state.pageCurrent <= 1 ? true : false
    console.log( 'commit FETCH_PAGE', state.pageList.length, 'filter', state.pageFilter )
  },
  FETCH_SCROLL_NEXT( state ) {

    let start = state.pageList.length
    let end = Math.min( start + state.pagePerItems -1, state.pageKeyList.length -1 )
    for(  ; start <= end ; start++ ) {
      // 使用 array, 不是 Object
      // state.pageList.push( state.cardDB[ state.pageKeys[ start+index ] ]  )
      // state.pageList.push( state.cardDB[ state.pageKeys[ start ] ]  )
      state.pageList.push( state.pageKeyList[ start ] )
    }
    console.log( 'commit FETCH_SCROLL_NEXT', state.pageList.length )
    if( end >= state.pageKeyList.length -1 )
      console.log( 'commit FETCH_SCROLL_NEXT end of list' )
  },
  GAME_INIT ( state ) {
    state.cardDB = storeDB
    state.storemsg = 'GAME INIT'

    // make deck to card pool clone from cardDB
    // [ state.player1 ].( (player) => {
    // const list = [ (state.player1, deck1), (state.player2,deck1) ]
    // let test = [ 1, 2, 3 ].map( x => x * x )

    const list = [ [state.player1,deck1], [state.player2,deck1]]

    list.forEach( ([player,deckfile]) => {
      // console.log(pack)
      // const (player,deckfile) = pack...
      // let player = pack[0]
      // let deckfile = pack[1]
      // console.log( 'init deck ', player.id )
      player.cardPool = []
      player.deck = []
      deckfile.forEach( (cardid) => {
          let card = state.cardDB[ cardid ]
          if( card ) {
            // clone /or make gamecard object
            // simple clone
            const gamecard = Object.assign( {}, card )
            // new prop for game card object
            Vue.set( gamecard,'facedown',false )
            Vue.set( gamecard,'selected',false )
            Vue.set( gamecard,'selectable',false )

            // end prop
            player.cardPool.push( gamecard )
            player.deck.push( gamecard )
            // if( (gamecard === card) )
            //     console.log( 'same card' )
          } else {
            // throw init error
            console.log( `GAME_INIT: warning ${cardid} not found` )
          }
        } )

        // underscore.js
        player.deck = _.shuffle(player.deck)

        console.log( `cardPool lenth ${player.cardPool.length}`, player.cardPool )
        console.log( `deck lenth ${player.deck.length}`, player.deck )
      } )

    console.log( 'commit INIT_GAME end' )
  },
  GAME_SET_FIRSTPLAYER(state, player) {
    if (_.isUndefined(player)) {
      console.log('GAME_SET_FIRSTPLAYER no player assign')
      throw 'GAME_SET_FIRSTPLAYER no player assign'
      return
    }

    state.firstPlayer = player
    console.log( `commit set GAME_SET_FIRSTPLAYER ${state.firstPlayer.id}` )
  },
  GAME_SET_CURRENTPLAYER (state, player) {
    if (_.isUndefined(player)) {
      console.log('GAME_SET_CURRENTPLAYER no player assign')
      throw 'GAME_SET_CURRENTPLAYER no player assign'
      return
    }

    if( _.isNull(state.firstPlayer) ) {
      state.firstPlayer = state.player
    }

    if( player === state.player1 ) {
      state.currentPlayer = player
      state.opponentPlayer = state.player2
    } else if ( player === state.player2 ) {
      state.currentPlayer = player
      state.opponentPlayer = state.player1
    } else {
      state.currentPlayer = player
      state.opponentPlayer = null
      console.log('WARING: GAME_SET_CURRENTPLAYER no opponentPlayer')
    }

    console.log( `commit set GAME_SET_CURRENTPLAYER CURR ${state.currentPlayer.id}` )
    console.log( `commit set GAME_SET_CURRENTPLAYER OPP ${state.opponentPlayer.id}` )
  },
  GAME_NEXT_PLAYER ( state ) {
    if( _.isNull(state.currentPlayer) ) {
      console.log('GAME_NEXT_PLAYER error currentPlayer is null')
      throw 'GAME_NEXT_PLAYER error currentPlayer is null'
      return
    }

    let swap = state.currentPlayer
    state.currentPlayer = state.opponentPlayer
    state.opponentPlayer = swap

    console.log( `commit set GAME_NEXT_PLAYER CURR ${state.currentPlayer.id}` )
    console.log( `commit set GAME_NEXT_PLAYER OPP ${state.opponentPlayer.id}` )
  },
  SELECT_PLAYER ( state, player ) {
    state.placeplayer = player
    console.log( `commit SELECT_PLAYER ${state.placeplayer.id}` )
  },
  SELECT_CARD( state, card=null ) {
    state.placeholder = card
    if( state.placeholder ) {
      console.log( `commit SELECT_CARD ${state.placeholder.name}` )
    } else {
      console.log( 'commit SELECT_CARD null' )
    }
  },
  SELECT_CARDLIST( state, list='hand' ) {
    if( typeof(list)=="string" ) {
      state.placelist = eval(`state.placeplayer.${list}`)
    }
    else {
      state.placelist = list
    }

    if( state.placelist.length > 0 )
      console.log( `commit SELECT_CARDLIST ${state.placelist.length}` )
    else {
      console.log( 'commit SELECT_CARDLIST is 0' )
    }
  },
  // FETCH_REFRESH ( state, { pagePerItems = 10, filter = 'all', filterfunc = {} } = {} ) {
  ACT_SELECTION( state, {
    list='hand',
    many=1,
    selectedMuation=null,
    selectedAction=null,
    thenAction=null,
  } = {} ) {

    // 修改成解构式
    state.act_selection.list = list
    state.act_selection.many = many
    state.act_selection.selectedMuation = selectedMuation
    state.act_selection.selectedAction = selectedAction
    state.act_selection.thenAction = thenAction
    state.act_selection.selectedList = []

    // placelist 处理 copy from SELECT_CARDLIST
    if( _.isString(list) ) {
      state.placelist = eval(`state.placeplayer.${list}`)
    }
    else {
      state.placelist = list
    }
    state.placelist.forEach((card) => {
      card.selected = false
      card.selectable = true
    })
    // end

    // state.act_selection.selected_count = 0
    // state.act_selection.selected_list = []
    console.log('commit ACT_SELECTION')
  },
  ACT_SET_SELECTED ( state, value ) {
    if( !state.placeholder ) {
      console.log( 'commit ACT_SET_SELECTED ERROR no placeholder card' )
      return
    }
    let flag = false
    if( value == undefined )
      flag = !state.placeholder.selected
    else {
      flag = value
    }
    state.placeholder.selected = flag

    if( state.act_selection.selectedMuation ) {
      // 处理muation callback
      console.log( `commit ACT_SET_SELECTED selectedMuation call` )
      state.act_selection.selectedMuation( state, state.placeholder )
    }

    // 处理更新selected list
    state.act_selection.selectedList = state.placelist.filter( (card) => {
      return card.selected
    } )
    console.log( `commit ACT_SET_SELECTED ${state.placeholder.name} is ${state.placeholder.selected}` )
  },
  ACT_UNSELECTION ( state ) {
    state.placelist.forEach( (card) => {
      // card.selected = false
      card.selectable = false
    })
    console.log('commit ACT_UNSELECTION')
  },
  PICK_CARD ( state, card=null ) {
    if( card ) {
      const pilelist = [
        ['hand', state.placeplayer.hand],
        ['zone', state.placeplayer.zone],
        ['base', state.placeplayer.base],
        ['graveyard', state.placeplayer.graveyard],
      ]

      let found = false
      state.placeholder = null
      for( let i=0; i < pilelist.length; i++ ) {
        let pack = pilelist[i]
        let pilename = pack[0]
        let pile = pack[1]
        // console.log(`find ${card.name} in ${pilename}`)
        let index = pile.indexOf(card)
        if( index > -1 ) {
          pile.splice(index,1)
          state.placeholder = card
          found = true
          console.log( `commit PICK_CARD find ${card.name} from ${pilename} index ${index}` )
          break
        }
      }

      if( !found ) {
        state.placeholder = null
        console.log( `commit PICK_CARD ERROR ${card.name} not found in all pile` )
        throw `commit PICK_CARD ERROR ${card.name} not found in all pile`
      }
    }
    else {
      state.placeholder = null
      console.log( 'commit PICK_CARD null must assign' )
    }
  },
  DRAW (state) {
    if( state.placeplayer.deck.length > 0 ) {
      state.placeholder = state.placeplayer.deck.pop()
      // console.log( `commit DRAW ${state.placeholder.name}` )
    }
    else {
      state.placeholder = null
      console.log( `commit DRAW ERROR no card to draw` )
    }
  },
  SET_FACEDOWN ( state ) {
    if( !state.placeholder ) {
      console.log( 'commit SET_FACEDOWN ERROR no placeholder card')
      return
    }
    state.placeholder.facedown = true
  },
  SET_FACEUP ( state ) {
    if( !state.placeholder ) {
      console.log( 'commit SET_FACEUP ERROR no placeholder card')
      return
    }
    state.placeholder.facedown = false
  },
  TO_HAND ( state ) {
    if( !state.placeholder ) {
      console.log( 'commit TO_HAND ERROR no placeholder card')
      return
    }
    state.placeplayer.hand.push( state.placeholder )
    state.placeholder = null
  },
  TO_ZONE ( state ) {
    if( !state.placeholder ) {
      console.log( 'commit TO_ZONE ERROR no placeholder card')
      return
    }
    state.placeplayer.zone.push( state.placeholder )
    state.placeholder = null
  },
  TO_BASE ( state ) {
    if( !state.placeholder ) {
      console.log( 'commit TO_BASE ERROR no placeholder card')
      return
    }
    state.placeplayer.base.push( state.placeholder )
    state.placeholder = null
  },
  TO_GRAVEYARD ( state ) {
    if( !state.placeholder ) {
      console.log( 'commit TO_GRAVEYARD ERROR no placeholder card')
      return
    }
    state.placeplayer.graveyard.push( state.placeholder )
    state.placeholder = null
  },
  // GAME
  GAME_SET (state, payload) {
    // if(_.has(payload, 'turnCount'))
    //   state.turnCount = payload.turnCount
    // if(_.has(payload, 'gameStarted'))
    //   state.gameStarted = payload.gameStarted

    // console.log('test Ramda', R.concat('ABC')('DEF'))
    const settingState = (value,key) => {
      if(R.has(key)(state)) {
        // const xKey = R.lensProp(key)
        // console.log(R.view(xKey,state))
        // 错误 set 只能返回更新后物件，但无法state无法diff更新
        // state = R.set(xKey,value,state)
        // console.log(`ramda set ${key} ${state[key]}`)
        state[key] = value
      }
      else {
        console.warn(`GAME_SET no key ${key}`)
      }
    }
    R.forEachObjIndexed(settingState,payload)

    // underscore.js
    // _.each(payload,(value,key,list) => {
    //   // console.log(value,key,list)
    //   if(_.has(state,key))
    //     state[key] = value
    //   else {
    //     console.warn(`GAME_SET no key ${key}`)
    //   }
    // })

    console.log('gameset payload',payload)
  },
  // TURN
  TURN_SET (state, payload) {


    console.log( 'commit TURN_SET no impelement', state.turn )
  },
  // BATTLE
  BATTLE_INIT(state) {
    state.battle = {
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
    }

    state.battle.attacker.player = state.currentPlayer
    state.battle.defenser.player = state.opponentPlayer
    console.log('commit BATTLE_INIT')
  },
  BATTLE_SET (state, payload) {

    const settingAttacker = (value,key) => {
      const data = state.battle.attacker
      if(R.has(key)(data)) {
        // console.log(`R attacker set ${key} ${value}`)
        data[key] = value
      }
      else {
        console.warn(`BATTLE_SET attacker no key ${key}`)
      }
    }
    const settingDefenser = (value,key) => {
      const data = state.battle.defenser
      if(R.has(key)(data)) {
        // console.log(`R attacker set ${key} ${value}`)
        data[key] = value
      }
      else {
        console.warn(`BATTLE_SET defenser no key ${key}`)
      }
    }

    if(R.has('attacker')(payload)) {
      R.forEachObjIndexed(settingAttacker,payload.attacker)
    }
    if(R.has('defenser')(payload)) {
      R.forEachObjIndexed(settingDefenser,payload.defenser)
    }

    state.battle.attacker.player = state.currentPlayer
    state.battle.defenser.player = state.opponentPlayer

    // console.log(payload)
    console.log( 'commit BATTLE_SET', state.battle )

    // underscore.js
    // if( _.has(payload, 'attacker') ) {
    // underscore.js assignment
    // if( _.has( payload.attacker, 'player' ) )
    //   state.battle.attacker.player = payload.attacker.player
    // if( _.has( payload.attacker, 'main' ) )
    //   state.battle.attacker.main = payload.attacker.main
    // if( _.has( payload.attacker, 'support' ) )
    //   state.battle.attacker.support = payload.attacker.support
    // _.each(payload.attacker,(value,key,list) => {
    //   // console.log(value,key,list)
    //   if(_.has(state.battle.attacker,key))
    //     state.battle.attacker[key] = value
    //   else {
    //     console.warn(`BATTLE_SET attacker no key ${key}`)
    //   }
    // })
    // }

    // if( _.has(payload, 'defenser') ) {
    //   // if( _.has( payload.defenser, 'player' ) )
    //   //   state.battle.defenser.player = payload.defenser.player
    //   // if( _.has( payload.defenser, 'main' ) )
    //   //   state.battle.defenser.main = payload.defenser.main
    //   // if( _.has( payload.defenser, 'support' ) )
    //   //   state.battle.defenser.support = payload.defenser.support
    //   _.each(payload.defenser,(value,key,list) => {
    //     // console.log(value,key,list)
    //     if(_.has(state.battle.defenser,key))
    //       state.battle.defenser[key] = value
    //     else {
    //       console.warn(`BATTLE_SET defenser no key ${key}`)
    //     }
    //   })
    // }
  },
}
const actions = {
  INIT_DB( { commit, state } ) {
    commit( 'INIT_DB' )
    commit( 'FETCH_REFRESH' )
    console.log( 'action INIT_DB')
  },
  // paging APP ------------------------------------------------
  FETCH_REFRESH( { commit, state }, pagePerItems = 10 ) {
    commit( 'FETCH_REFRESH', { pagePerItems: pagePerItems, filter: state.pageFilter }  )
    commit( 'FETCH_PAGE', 1 )
    console.log( 'action FETCH_REFRESH')
  },
  FETCH_PAGE( { commit, state }, pageno = 1 ) {
    commit( 'FETCH_PAGE', pageno )
    console.log( 'action FETCH_PAGE finish key count:', state.pageKeyList.length, 'fetech page:', pageno )
  },
  PAGE_NEXT( { commit, state }, step = 1 ) {
    commit( 'FETCH_PAGE', state.pageCurrent + step )
    console.log( 'action page_next', state.pageCurrent  )
  },
  PAGE_FILTER( { commit, state }, val = 0 ) {
    let filter = val > 0 ? 'cost' : 'all'
    // let func = eval( `(n) => n.cost == ${val}` )
    // condition string makes condition
    let condition = `n.star == ${val}`
    commit( 'FETCH_REFRESH',  { pagePerItems: state.pagePerItems,
            filter: filter,
            // filterfunc: func } ) // OK!
            filterfunc: (n) => eval( condition ) } ) // OK!
            // filterfunc: (n) => n.cost == val } )
    commit( 'FETCH_PAGE', 1 )
    console.log( 'action PAGE_FILTER', filter )
    // console.log( 'val2', val2 )
  },
  FETCH_SCROLL_NEXT( { commit, state } ) {
    commit( 'FETCH_SCROLL_NEXT' )
    console.log( 'action FETCH_SCROLL_NEXT' )
  },
  // end of paging APP ------------------------------------------------
  GAME_INIT( { commit, state } ) {
    commit( 'GAME_INIT' )
    console.log( 'action GAME_INIT' )
  },
  // SELECT_PLAYER( { commit, state }, player ) {
  //   commit( 'SELECT_PLAYER', player )
  //   console.log( 'action SELECT_PLAYER' )
  // },
  // SELECT_CARDLIST( { commit, state }, list ) {
  //   commit( 'SELECT_CARDLIST', list )
  //   console.log( 'action SELECT_CARDLIST' )
  // },
  DRAW( { commit, state }, many=1 ) {
    for( let i=0; i < many; i++ ) {
      commit( 'DRAW' )
      commit( 'TO_HAND' )
    }
    console.log( 'action DRAW CARDS', many )
  },
  DRAW_TO_ZONE( { commit, state }, many=1 ) {
    for( let i=0; i < many; i++ ) {
      commit( 'DRAW' )
      commit( 'SET_FACEDOWN' )
      commit( 'TO_ZONE' )
    }
    console.log( 'action DRAW CARDS TO zone', many )
  },
  SET_FACEUP( { commit, state }, card ) {
    commit( 'SELECT_CARD', card )
    commit( 'SET_FACEUP' )
    commit( 'SELECT_CARD', null )
    console.log( 'action SET_FACEUP' )
  },
  async ACT_SELECT_CARD_START( { dispatch, commit, state }, payload ) {

    commit('ACT_SELECTION', payload)

    let waiting = true
    while( waiting ) {
      await dispatch('_ACT_SYNC_SELECT_CHECK').then( (resolve) => {
        // console.log('resolve')
        waiting = false
      }, (err) => {
        // console.log('reject')
      } )
    }
    console.log('ACT_SELECT_CARD_START AWAIT SYNC finish')

    // return dispatch('_ACT_SELECT_CARD_END')
    dispatch('_ACT_SELECT_CARD_END')
  },
  // 带入 dispatch
  ACT_SELECTED_CARD( { dispatch, commit, state }, card ) {

    console.log( `action ACT_SELECTED_CARD ${card.name}` )

    commit('SELECT_CARD',card)
    commit('ACT_SET_SELECTED')

    // dispatch selected action
    if( state.act_selection.selectedAction ) {
      // console.log( `ACT_SELECTED_CARD dispatch ${state.act_selection.action}` )
      // dispatch(state.act_selection.action,card)
      console.log( `ACT_SELECTED_CARD selectedAction call` )
      state.act_selection.selectedAction(state,card)
    }
  },
  _ACT_SELECT_CARD_END( { commit, state } ) {

    commit('ACT_UNSELECTION')
    if( state.act_selection.thenAction ) {
      console.log( `ACT_SELECT_CARD_END thenAction call` )
      return state.act_selection.thenAction(state)
    }
  },
  async _ACT_SYNC_SELECT_CHECK( { commit, state, dispatch }, checkfunc=()=>true ) {

    // console.log( '_ACT_SYNC_SELECT_CHECK' )
    return new Promise(function(resolve, reject) {
      setTimeout(()=> {
        // console.log('hello promise check')
        // console.log(checkfunc())
        // if( !checkfunc(state) ) {
        //     commit('ACT_SET_SELECTED',false)
        //     reject()
        // }
        if( state.act_selection.selectedList.length >= state.act_selection.many ) {
          resolve()
        } else {
          reject()
        }
      }, 1000 )
    })
  },
  async _WAIT_ACT_SYNC_SELECT_CHECK( { commit, state, dispatch }, checkfunc=()=>true ) {

    console.log('_WAIT_ACT_SYNC_SELECT_CHECK')
    let waiting = true
    while( waiting ) {
      // let checkfunc = () => state.placeholder ? state.placeholder.star >= 4 : true
      await dispatch('_ACT_SYNC_SELECT_CHECK').then( (resolve) => {
        // console.log('resolve')
        waiting = false
      }, (err) => {
        // console.log('reject')
      } )
    }
  },
  ASYNC_ACT_SELECT_CARD_START ({commit,state,dispatch}, payload) {

    console.log('ASYNC_ACT_SELECT_CARD_START')
    return new Promise( async function(resolve, reject) {
    // return new Promise( (resolve, reject) => {
    // 注意：使用箭头函数不能是 async
      commit('ACT_SELECTION', payload)

      // OK 1
      await dispatch('_WAIT_ACT_SYNC_SELECT_CHECK')

      // OK 2
      // let waiting = true
      // while( waiting ) {
      //   await dispatch('_ACT_SYNC_SELECT_CHECK').then( (resolve) => {
      //     // console.log('resolve')
      //     waiting = false
      //   }, (err) => {
      //     // console.log('reject')
      //   } )
      // }
      dispatch('_ACT_SELECT_CARD_END')
      resolve()
    })
  },
  // game loop
  // GAME_START
  // GAME_WHO_FIRST
  // GAME_SET_FIRST_PLAYER
  // GAME_TURN_BEGIN
  // ...GAME_CHECK_GAMEOVER
  // GAME_DRAW
  // BATTLE_START
  // ...BATTLE_DECALRE_ATTACKER
  // ...BATTLE_OPP_DECLARE_DEFENSER
  // ...BATTLE_PLAY_SUPPORTER
  // ...BATTLE_OPP_PLAY_SUPPORTER
  // ...BATTLE_BATTLE_EFFECT
  // BATTLE_END
  // ...GAME_CHECK_GAMEOVER
  // GAME_NEXT_TURN
  // GAME_SCOREBOARD
  // GAME_END

  GAME_TEMPLATE({commit,state,dispatch}) {
    return new Promise(function(resolve, reject) {
      resolve()
    })
  },
  GAME_WHO_FIRST({commit,state,dispatch}) {
    return new Promise(function(resolve, reject) {
      resolve(state.player1)
    })
  },
  GAME_SET_FIRSTPLAYER({commit,state,dispatch},player) {
    return new Promise(function(resolve, reject) {
      commit('GAME_SET_FIRSTPLAYER', player)
      commit('GAME_SET_CURRENTPLAYER', player)
      resolve()
    })
  },
  GAME_START({commit,state,dispatch}) {
    return new Promise(function(resolve, reject) {
      commit('GAME_SET', { gameStarted: true })
      commit('SELECT_PLAYER', state.player2)
      dispatch('DRAW', 5)
      dispatch('DRAW_TO_ZONE', 5)

      commit('SELECT_PLAYER', state.player1)
      dispatch('DRAW', 5)
      dispatch('DRAW_TO_ZONE', 5)
      resolve()
    })
  },
  GAME_TURN_BEGIN({commit,state,dispatch}) {
    return new Promise(function(resolve, reject) {
      commit('GAME_SET', { turnCount: state.turnCount+1 })
      resolve()
    })
  },
  GAME_CHECK_GAMEOVER({commit,state,dispatch}) {
    return new Promise(function(resolve, reject) {
      resolve()
    })
  },
  GAME_DRAW({commit,state,dispatch}) {
    return new Promise(function(resolve, reject) {
      commit('SELECT_PLAYER', state.player1)
      dispatch('DRAW', 1)
      resolve()
    })
  },
  BATTLE_START({commit,state,dispatch}) {
    return new Promise(function(resolve, reject) {
      resolve()
    })
  },
  BATTLE_END({commit,state,dispatch}) {
    return new Promise(function(resolve, reject) {
      resolve()
    })
  },
  GAME_NEXT_TURN({commit,state,dispatch}) {
    return new Promise(function(resolve, reject) {
      resolve()
    })
  },
  GAME_SCOREBOARD({commit,state,dispatch}) {
    return new Promise(function(resolve, reject) {
      resolve()
    })
  },
  GAME_END({commit,state,dispatch}) {
    return new Promise(function(resolve, reject) {
      resolve()
    })
  },
}
const getters = {
  testGetter ( state ) {
    return state.pageCurrent
  },
  pageNextDisabled ( state ) {
    return state.pageCurrent >= state.pageTotalPage ? true : false
  },
  pagePrevDisabled ( state ) {
    return state.pageCurrent <= 1 ? true : false
  },
  selectCards( state ) {
    let cards = []
    state.pageFullList.forEach( (card) => {
      if ( card.count > 0 )
        cards.push(card)
    } )
    return cards
  },
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
