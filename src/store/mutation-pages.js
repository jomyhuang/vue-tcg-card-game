export default {
  M2(state) {
    console.log('mutations M2');
  },
  TOGGLE_LOADING(state) {
    state.callingAPI = !state.callingAPI
  },
  TOGGLE_SEARCHING(state) {
    state.searching = (state.searching === '') ? 'loading' : ''
  },
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  TEST_STORE(state, payload) {
    state.storemsg = payload
  },
  INIT_DB(state) {
    // state.cardDB = storeDB

    // deck init
    // console.log('deck1', deck1, 'length', deck1.length)
    // 转换成数组便利处理
    // state.cardDB = JSON.parse(storeDB || '[]')
    state.pageFullList = []
    // exam = Object.keys(exam).map(function(k){return exam[k]});
    Object.keys(cardDB).forEach((k) => state.pageFullList.push(cardDB[k]))
    state.pageKeyList = state.pageFullList

    // console.log('JSON to fulllist/keylist array', state.pageFullList)

    state.storemsg = 'INIT_DB loaded'
    console.log('commit INIT_DB')
  },
  // 结构双重默认值写法
  FETCH_REFRESH(state, {
    pagePerItems = 10,
    filter = 'all',
    filterfunc = {}
  } = {}) {
    state.pagePerItems = pagePerItems
    state.pageFilter = filter

    state.pageKeyList = []
    if (state.pageFilter == 'all') {
      // full list
      state.pageKeyList = state.pageFullList
    } else {
      // filter
      // state.pageKeyList = state.pageFullList.filter( (n) => n.cost == 2 )
      // filterfunc = (n) => n.cost > 2
      state.pageKeyList = state.pageFullList.filter(filterfunc)
      console.log('filter', state.pageFilter)
    }
    state.pageTotalPage = parseInt(state.pageKeyList.length / state.pagePerItems)
    state.pageTotalPage += state.pageKeyList.length % state.pagePerItems ? 1 : 0
    state.pageCurrent = 1
    state.pageList = []

    state.storemsg = 'FETCH_REFRESH'
    console.log('commit FETCH_REFRESH pageTotalPage', state.pageTotalPage)
    console.log('FETCH_REFRESH pagePerItems', state.pagePerItems, 'filter', state.pageFilter)
  },
  FETCH_PAGE(state, pageno = 1) {
    state.pageList = []
    pageno = Math.min(pageno, state.pageTotalPage)
    pageno = Math.max(pageno, 1)
    state.pageCurrent = pageno

    let start = (state.pageCurrent - 1) * state.pagePerItems
    let end = Math.min(start + state.pagePerItems - 1, state.pageKeyList.length - 1)
    for (; start <= end; start++) {
      // 使用 array, 不是 Object
      // state.pageList.push( state.cardDB[ state.pageKeys[ start+index ] ]  )
      // state.pageList.push( state.cardDB[ state.pageKeys[ start ] ]  )
      state.pageList.push(state.pageKeyList[start])
    }
    // state.pageNextDisabled = state.pageCurrent >= state.pageTotalPage ? true : false
    // state.pagePrevDisabled = state.pageCurrent <= 1 ? true : false
    console.log('commit FETCH_PAGE', state.pageList.length, 'filter', state.pageFilter)
  },
  FETCH_SCROLL_NEXT(state) {

    let start = state.pageList.length
    let end = Math.min(start + state.pagePerItems - 1, state.pageKeyList.length - 1)
    for (; start <= end; start++) {
      // 使用 array, 不是 Object
      // state.pageList.push( state.cardDB[ state.pageKeys[ start+index ] ]  )
      // state.pageList.push( state.cardDB[ state.pageKeys[ start ] ]  )
      state.pageList.push(state.pageKeyList[start])
    }
    console.log('commit FETCH_SCROLL_NEXT', state.pageList.length)
    if (end >= state.pageKeyList.length - 1)
      console.log('commit FETCH_SCROLL_NEXT end of list')
  },
}
