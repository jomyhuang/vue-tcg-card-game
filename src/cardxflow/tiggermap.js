import R from 'ramda'
import _ from 'lodash'

export default {
  main: {
    from: 'active',
    type: 'EOG',
  },
  atGraveyard: {
    slot: ['graveyard']
  },
  atBase: {
    slot: ['base']
  },
  blocksupport: {
    _type: 'player',
  },
  clear: {
    _type: 'emit',
  }
}
