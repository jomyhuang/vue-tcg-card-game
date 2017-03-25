export default {
  testGetter(state) {
    return state.pageCurrent
  },
  pageNextDisabled(state) {
    return state.pageCurrent >= state.pageTotalPage ? true : false
  },
  pagePrevDisabled(state) {
    return state.pageCurrent <= 1 ? true : false
  },
  selectCards(state) {
    let cards = []
    state.pageFullList.forEach((card) => {
      if (card.count > 0)
        cards.push(card)
    })
    return cards
  },
}
