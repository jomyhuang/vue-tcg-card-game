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

export default {

  attacker() {
    const card = $cx.card()
    console.log('is.attacker card',$cx.card())
    // console.log(card.play['isAttacker'])

    return _condition('isAttacker')
  },

}
