export default {
  M2({
    commit,
    state
  }, payload) {
    // commit('RAMDA_TEST', payload)
    console.log('RAMDA_TEST M2 action result')
    console.log('RAMDA_TEST M2 action result')
    console.log('RAMDA_TEST M2 action result')
    console.log('RAMDA_TEST M2 action result')
    // let card = state.player1.deck[0]
    // console.log(`test result ${card.name} ${card.play.info} ${card.play.tag}`)
    // console.log(mutil.convertPower('2000万'));
    // console.log(mutil.convertPower('2亿'));
    // console.log(mutil.convertPower('2'));
    // console.log(mutil.convertPower('万'));

  },
  INIT_DB({
    commit,
    state
  }) {
    commit('INIT_DB')
    commit('FETCH_REFRESH')
    console.log('action INIT_DB')
  },
  // paging APP ------------------------------------------------
  FETCH_REFRESH({
    commit,
    state
  }, pagePerItems = 10) {
    commit('FETCH_REFRESH', {
      pagePerItems: pagePerItems,
      filter: state.pageFilter
    })
    commit('FETCH_PAGE', 1)
    console.log('action FETCH_REFRESH')
  },
  FETCH_PAGE({
    commit,
    state
  }, pageno = 1) {
    commit('FETCH_PAGE', pageno)
    console.log('action FETCH_PAGE finish key count:', state.pageKeyList.length, 'fetech page:', pageno)
  },
  PAGE_NEXT({
    commit,
    state
  }, step = 1) {
    commit('FETCH_PAGE', state.pageCurrent + step)
    console.log('action page_next', state.pageCurrent)
  },
  PAGE_FILTER({
    commit,
    state
  }, val = 0) {
    let filter = val > 0 ? 'cost' : 'all'
    // let func = eval( `(n) => n.cost == ${val}` )
    // condition string makes condition
    let condition = `n.star == ${val}`
    commit('FETCH_REFRESH', {
      pagePerItems: state.pagePerItems,
      filter: filter,
      // filterfunc: func } ) // OK!
      filterfunc: (n) => eval(condition)
    }) // OK!
    // filterfunc: (n) => n.cost == val } )
    commit('FETCH_PAGE', 1)
    console.log('action PAGE_FILTER', filter)
    // console.log( 'val2', val2 )
  },
  FETCH_SCROLL_NEXT({
    commit,
    state
  }) {
    commit('FETCH_SCROLL_NEXT')
    console.log('action FETCH_SCROLL_NEXT')
  },
  // end of paging APP ------------------------------------------------
}
