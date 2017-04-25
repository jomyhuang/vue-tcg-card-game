import R from 'ramda'
import mutil from '@/mutil'

export default {
  NAME(state) {
    return 'agent-first'
  },
  SELECT_CARD(state, payload) {
    let card
    if( R.length(state.placelist) <=0 ) {
      this.TALK(state, `SELECTCARD list is 0`)
      return false
    }

    card = R.path(['test',payload.phase])(state)
    if (card) {
      this.TALK(state, `SELECTCARD ${payload.phase} choice ${card.name} test`)
    } else {
      card = state.placelist[0]
      if(card) {
        this.TALK(state, `SELECTCARD ${payload.phase} choice ${card.name} place 0`)
      }
      else {
        this.TALK(state, `SELECTCARD ${payload.phase} card is null`)
      }
    }
    return card
  },
  TALK(state, msg) {
    console.info(`FIRST AGENT TALK: ${msg} `)
  },
}
