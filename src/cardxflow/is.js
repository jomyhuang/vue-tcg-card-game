import R from 'ramda'
import _ from 'lodash'

import $cx from '@/cardxflow'
import { $store, $state } from '@/cardxflow'
import mu from '@/mutil'

function _condition(phase) {
  const card = $cx.card()
  return (key) => {
    console.log(`_condition key ${key} phase ${phase}`)
    return key === phase && R.path(['effect',phase])(card) && R.path(['play',phase])(card)
  }
}

export const is = {

  attacker(name) {
    console.log('is.attacker this',this)
    // console.log(card.play['isAttacker'])

    return function() {
      const context = this
      console.log('is.attacker context',name,context);
      return true
    }
  },

}
