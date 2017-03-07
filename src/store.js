import Vue from 'vue'
// require karma/mocha unit test vuex
import 'babel-polyfill'
import Vuex from 'vuex'
// import storeDB from './components/CardDB.json'
import storeDB from './components/SDWCardDB.json'
import deck1 from './components/player1.deck'


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
  placeholder: null,
  battle: {
    attacker: {
      player: null,
      main: null,
      support: null,
    },
    defenser: {
      player: null,
      main: null,
      support: null,
    },
  },
  player1: {
    id: 'playerId1',
    hero: 'heroId1',
    name: 'Jimmy',
    cardPool: [],
    deck: [
      'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10',
      'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18', 'c19', 'c20',
      'c21', 'c22', 'c23', 'c24', 'c25', 'c26', 'c27', 'c28', 'c29', 'c30',
    ],
    battlefield: [],
    hand: [],
    graveyard: [],
    base: [],
    secrets: [],
    effects: [],
    auras: [],
    minions: [],
    mana: 0,
    maxMana: 10,
  },
  player2: {
    id: 'playerId2',
    hero: 'heroId2',
    name: 'Jomy',
    cardPool: [],
    deck: [
      'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10',
      'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18', 'c19', 'c20',
      'c21', 'c22', 'c23', 'c24', 'c25', 'c26', 'c27', 'c28', 'c29', 'c30',
    ],
    battlefield: [],
    hand: [],
    graveyard: [],
    base: [],
    secrets: [],
    effects: [],
    auras: [],
    minions: [],
    mana: 0,
    maxMana: 10,
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
  INIT_DB ( state ) {
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
      console.log( 'init deck ', player.id )
      player.cardPool = []
      player.deck = []
      deckfile.forEach( (cardid) => {
          let card = state.cardDB[ cardid ]
          if( card ) {
            // clone /or make gamecard object
            // simple clone
            const gamecard = Object.assign( {}, card )
            // new prop for game
            Vue.set( gamecard, 'facedown', false )
            player.cardPool.push( gamecard )
            player.deck.push( gamecard )
            // if( (gamecard === card) )
            //     console.log( 'same card' )
          } else {
            // throw init error
            console.log( `GAME_INIT: warning ${cardid} not found` )
          }
        } )

        console.log( `cardPool lenth ${player.cardPool.length}`, player.cardPool )
        console.log( `deck lenth ${player.deck.length}`, player.deck )
      } )

    console.log( 'commit INIT_GAME end' )
  },
  SELECT_PLAYER ( state, player ) {
    state.currentPlayer = player
    console.log( `commit SELECT_PLAYER ${state.currentPlayer.id}` )
  },
  SELECT_CARD( state, card=null ) {
    state.placeholder = card
    if( state.placeholder )
      console.log( `commit SELECT_CARD ${state.placeholder.name}` )
    else
      console.log( 'commit SELECT_CARD null' )
  },
  PICK_CARD( state, card=null ) {
    if( card ) {
      const pilelist = [ ['hand', state.currentPlayer.hand],
                    ['battlefield', state.currentPlayer.battlefield],
                    ['base', state.currentPlayer.base],
                    ['graveyard', state.currentPlayer.graveyard],
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
    else
      console.log( 'commit set PICK_CARD null' )
  },
  DRAW( state ) {
    if( state.currentPlayer.deck.length > 0 ) {
      state.placeholder = state.currentPlayer.deck.pop()
      console.log( `commit DRAW ${state.placeholder.name}` )
    }
    else {
      state.placeholder = null
      console.log( `commit DRAW ERROR no card to draw` )
    }
  },
  SET_FACEDOWN( state ) {
    if( !state.placeholder ) {
      console.log( 'commit SET_FACEDOWN ERROR no placeholder card')
      return
    }
    state.placeholder.facedown = true
  },
  SET_FACEUP( state ) {
    if( !state.placeholder ) {
      console.log( 'commit SET_FACEUP ERROR no placeholder card')
      return
    }
    state.placeholder.facedown = false
  },
  TO_HAND( state ) {
    if( !state.placeholder ) {
      console.log( 'commit TO_HAND ERROR no placeholder card')
      return
    }
    state.currentPlayer.hand.push( state.placeholder )
    state.placeholder = null
  },
  TO_BATTLEFIELD( state ) {
    if( !state.placeholder ) {
      console.log( 'commit TO_HAND ERROR no placeholder card')
      return
    }
    state.currentPlayer.battlefield.push( state.placeholder )
    state.placeholder = null
  },
  TO_BASE( state ) {
    if( !state.placeholder ) {
      console.log( 'commit TO_BASE ERROR no placeholder card')
      return
    }
    state.currentPlayer.base.push( state.placeholder )
    state.placeholder = null
  },
  TO_GRAVEYARD( state ) {
    if( !state.placeholder ) {
      console.log( 'commit TO_BASE ERROR no placeholder card')
      return
    }
    state.currentPlayer.graveyard.push( state.placeholder )
    state.placeholder = null
  },
}
const actions = {
  INIT_DB( { commit, state } ) {
    commit( 'INIT_DB' )
    commit( 'FETCH_REFRESH' )
    console.log( 'action INIT_DB')
  },
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
  GAME_INIT( { commit, state } ) {
    commit( 'GAME_INIT' )
    console.log( 'action GAME_INIT' )
  },
  SELECT_PLAYER( { commit, state }, player ) {
    commit( 'SELECT_PLAYER', player )
    console.log( 'SELECT_PLAYER' )
  },
  DRAW( { commit, state }, many=1 ) {
    for( let i=0; i < many; i++ ) {
      commit( 'DRAW' )
      commit( 'TO_HAND' )
    }
    console.log( 'DRAW CARDS', many )
  },
  DRAW_TO_BATTLEFIELD( { commit, state }, many=1 ) {
    for( let i=0; i < many; i++ ) {
      commit( 'DRAW' )
      commit( 'SET_FACEDOWN' )
      commit( 'TO_BATTLEFIELD' )
    }
    console.log( 'DRAW CARDS TO battlefield', many )
  },
  SET_FACEUP( { commit, state }, card ) {
    commit( 'SELECT_CARD', card )
    commit( 'SET_FACEUP' )
    commit( 'SELECT_CARD', null )
    console.log( 'action SET_FACEUP' )
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
  }
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
