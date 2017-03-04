import Vue from 'vue'
// require karma/mocha unit test vuex
import 'babel-polyfill'
import Vuex from 'vuex'
// import storeDB from './components/CardDB.json'
import storeDB from './components/SDWCardDB.json'

Vue.use(Vuex)

const state = {
  callingAPI: false,
  searching: '',
  serverURI: 'http://10.110.1.136:8080',
  user: null,
  token: null,
  userInfo: {
    messages: [{1: 'test', 2: 'test'}],
    notifications: [],
    tasks: []
  },
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
  pageFilter: 'all'
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
    // 转换成数据便利处理
    // state.cardDB = JSON.parse(storeDB || '[]')
    state.pageFullList = []
    // exam = Object.keys(exam).map(function(k){return exam[k]});
    Object.keys(state.cardDB).map( (k) => state.pageFullList.push( state.cardDB[k] ) )
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
  FETCH_PAGE( state, pageno = 1 ) {
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
  }
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
  }
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
