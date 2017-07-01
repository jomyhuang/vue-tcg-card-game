import mu from '@/mutil'
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
      this.name = this.name + 'TEST'
      // console.log('JW15-001 mounted test ok')
    },
    // isAttacker: $cx.engage($cx.buff(500), $cx.buff(500, 'special power!')),
    isAttacker: $cx.pipe(
        $cx.GUIengage($cx.buff(500), $cx.buff(500, 'special power!')),
        $cx.GUIengage('do engage 2','do engage 2-1',$cx.run('EFFECT_CHOICE', 'hand'), $cx.message('END PIPE')),
    ),
    // isDefenser: $cx.engage(
    //   [$cx.tap('do this tap message array1')],
    //   [$cx.buff(500), $cx.tap('effect array2')],
    // ),
    // isDefenser: [
    //   $cx.engage($cx.tap('do this tap message array1')),
    //   $cx.engage($cx.buff(500), $cx.tap('effect array2')),
    // ],
    // faceup({
    //   dispatch,
    // }) {
    //   console.log('JW15-001 FACEUP effect this=', this)
    //   dispatch('DRAW', 1)
    // },
    main() {
      return $cx.GUIengage(
      // return $cx.engage(
        // $cx.run('SELECT_LIST', 'opp_zone'),
        // $cx.run('SELECT_FILTER', x => x.star >= 3),
        // $cx.run('EFFECT_OPP_CHOICE', () => mu.opponent(state.placeplayer)['hand']),
        // $cx.run('EFFECT_CHOICE', () => mu.opponent(state.placeplayer)['hand']),
        $cx.phaseinfo('选择一张牌，进入休息区'),
        $cx.run('EFFECT_CHOICE', 'opp_zone'),
        $cx.run('PICK_CARD'),
        $cx.run('TO_GRAVEYARD'),
        // $cx.choice(),
        // $cx.RXbuff(1000),
        // $cx.openUI(),
        // $cx.tap( ()=> console.log('JOMY') ),
        // $cx.message('do this tap message main action'),
        // $cx.iftest(),
        // 'string message',
      )
    },
  },
  // "JW15-002": {
  //   faceup() {
  //     // console.log(`${this.cardno} FACEUP effect this=`, this)
  //   },
  //   main() {
  //     // console.log(`${this.cardno} MAIN effect`)
  //   }
  // },
}
