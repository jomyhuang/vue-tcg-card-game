import mutil from '@/mutil'
import {
  cxrun,
  cxpipe,
} from '@/cardxflow'
import R from 'ramda'
import $cx from '@/cardxflow'
import is from '@/cardxflow/is'


export default {
  "JW15-001": {
    mounted() {
      // console.log('mounted this =', this)
      this.name = this.name + 'TEST'
      // console.log('JW15-001 mounted test ok')
    },
    isAttacker: $cx.engage($cx.buff(500), $cx.buff(500, 'special power!')),
    isDefenser: $cx.engage(
      [$cx.tap('do this tap message array1')],
      [$cx.buff(500), $cx.tap('effect array2')],
    ),
    // isDefenser: [
    //   $cx.engage($cx.tap('do this tap message array1')),
    //   $cx.engage($cx.buff(500), $cx.tap('effect array2')),
    // ],
    faceup({
      dispatch,
    }) {
      console.log('JW15-001 FACEUP effect this=', this)
      dispatch('DRAW', 1)
    },
    main({
      commit,
      state,
      dispatch,
    }) {
      return $cx.pipe(
        // rxcommit('SELECT_LIST','hand'),
        // () => mutil.tap('test'),
        // tap('this'),
        // rxcommit('SELECT_MAP', x => { x.name = x.name + '***'; return x } ),
        // rxdispatch('EFFECT_CHOICE', 'hand'),
        // $cx.run('SELECT_LIST', 'opp_zone'),
        // $cx.run('SELECT_FILTER', x => x.star >= 3),
        // $cx.run('EFFECT_OPP_CHOICE', () => mutil.opponent(state.placeplayer)['hand']),
        // $cx.run('EFFECT_CHOICE', () => mutil.opponent(state.placeplayer)['hand']),

        $cx.run('EFFECT_CHOICE', 'opp_zone'),
        $cx.run('PICK_CARD'),
        $cx.run('TO_GRAVEYARD'),
        $cx.tapUI(),
        $cx.iftest(),
        $cx.tap('do this tap message main action'),
        'string message',
      )
    },
  },
  "JW15-002": {
    faceup() {
      console.log(`${this.cardno} FACEUP effect this=`, this)
    },
    main() {
      // console.log(`${this.cardno} MAIN effect`)
    }
  },
}
