import R from 'ramda'
import mutil from '@/mutil'

export default {
  NAME(state) {
    return 'agent-first'
  },
  SELECT_CARD(state, payload) {
    let card
    card = R.path(['test',payload.phase])(state)
    if (card) {
      this.TALK(state, `SELECTCARD ${payload.phase} choice ${card.name} test`)
    } else {
      card = state.placelist[0]
      this.TALK(state, `SELECTCARD ${payload.phase} choice ${card.name} place 0`)
    }
    return card
  },
  TALK(state, msg) {
    console.info(`FIRST AGENT TALK: ${msg} `)
  },
}
