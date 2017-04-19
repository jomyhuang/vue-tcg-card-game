export default {
  NAME(state) {
    return 'agent-first'
  },
  SELECT_CARD(state, payload) {
    const card = state.placelist[0]
    this.TALK(state, `agent SELECTCARD ${payload.phase} choice ${card.name}`)
    return card
  },
  TALK(state, msg) {
    console.log(`FIRST AGENT TALK: ${msg} `)
  },
}
