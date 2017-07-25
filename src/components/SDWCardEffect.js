import mu from '@/mutil'
import {
  cxrun,
  cxpipe,
} from '@/cardxflow'
import R from 'ramda'
import $cx from '@/cardxflow'
import {is} from '@/cardxflow/is'
import {$store} from '@/mutil'



export default {
  "JW15-001": {
    mounted() {
      this.name = this.name + 'TEST'
      // console.log('JW15-001 mounted test ok')
    },
    isAttackerWhen: () => true,
    isAttacker: $cx.GUIengage($cx.buff(1000, 'special power'),$cx.run('OPPADD_TAG','blocksupport')),
    // isAttacker: $cx.engage(
    //     $cx.GUIengage($cx.buff(500), $cx.buff(500, 'special power!')),
    //     $cx.GUIengage('do engage 2',
    //       'do engage 2-1',
    //       // $cx.run('EFFECT_CHOICE', 'hand'),
    //       $cx.message('END PIPE')),
    // ),
    // isAttacker: $cx.engage($cx.buff(500), $cx.buff(500, 'special power!')),
    // isDefenser: $cx.engage(
    //   [$cx.tap('do this tap message array1')],
    //   [$cx.buff(500), $cx.tap('effect array2')],
    // ),
    // isDefenser: [
    //   $cx.engage($cx.tap('do this tap message array1')),
    //   $cx.engage($cx.buff(500), $cx.tap('effect array2')),
    // ],
    faceup: $cx.GUIengage($cx.phaseinfo('效果：对手无法支援'),$cx.run('OPPADD_TAG','blocksupport')),
    // faceup() {
    //   // dispatch('DRAW', 1)
    //   return new Promise(function(resolve, reject) {
    //     console.log('JW15-001 FACEUP effect this=', this)
    //     resolve()
    //   });
    // },
    main() {
      return $cx.GUIengage(
      // return $cx.engage(
        // $cx.run('SELECT_LIST', 'opp_zone'),
        // $cx.run('SELECT_FILTER', x => x.star >= 3),
        // $cx.run('EFFECT_OPP_CHOICE', () => mu.opponent(state.placeplayer)['hand']),
        // $cx.run('EFFECT_CHOICE', () => mu.opponent(state.placeplayer)['hand']),
        // $cx.phaseinfo('选择一张牌，进入休息区'),
        // $cx.phaseinfo('信息2'),
        // $cx.phaseinfo('信息3'),
        // $cx.effectChoice('opp_zone'),
        // $cx.run('EFFECT_CHOICE', 'opp_zone'),

        // $cx.when( is.attacker('test'), '中断测试' ),
        // $cx.run('ADD_TAG', 'isWork'),
        // $cx.iif( true,
        //   $cx.engage($cx.target('opp_hand'),$cx.phaseinfo('true测试2')),
        //   $cx.phaseinfo('false测试'),
        // ),
        // $cx.target('opp_zone'),
        // $cx.run('PICK_CARD'),
        // $cx.run('TO_GRAVEYARD'),

        $cx.maybe({text:`回合 ${$store.state.game.turnCount} 是否发动效果？${this.source.effecttext} `},
          $cx.GUIengage(
            $cx.target('opp_zone'),
            $cx.run('PICK_CARD'),
            $cx.run('TO_GRAVEYARD'),
          ),
          $cx.GUIengage(
            $cx.phaseinfo('取消不发动效果'),
          )),

        // $cx.reject(),
        // )(true)

        // $cx.phaseinfo('再次支援'),
        // $cx.target('hand'),
        // $cx.run('PICK_CARD'),
        // $cx.run('TO_EXSUPPORT'),
        // //
        // $cx.phaseinfo('对手再次支援'),
        // $cx.opptarget('hand'),
        // $cx.run('PICK_CARD'),
        // $cx.run('TO_EXSUPPORT'),

        // $cx.phaseinfo('进入基地'),
        // $cx.choice(),
        // $cx.RXbuff(1000),
        // $cx.openUI(),
        // $cx.tap( ()=> console.log('JOMY') ),
        // $cx.message('do this tap message main action'),
        // $cx.ifstop(),
        // 'string message',
      )
      // .then( () => {
      //   console.log('GUI then');
      // })
    },
  },
  "JW15-002": {
    // faceup() {
    //   // console.log(`${this.cardno} FACEUP effect this=`, this)
    // },
    main() {
      return new Promise(function(resolve, reject) {
        console.log('JW15-002 main tag effect this=', this)
        resolve()
      });
    },
    // slotGRAVEYARD() {
    //   // dispatch('DRAW', 1)
    //   return $cx.GUIengage(
    //     $cx.phaseinfo('坟场启动选择对手'),
    //     $cx.opptarget('deck'),
    //     $cx.run('PICK_CARD'),
    //     $cx.run('TO_GRAVEYARD'),
    //   )
    //   // return new Promise(function(resolve, reject) {
    //   //   console.log('JW15-002 slotGRAVEYARD tag effect this=', this)
    //   //   resolve()
    //   // });
    // },
    atGraveyard() {
      // dispatch('DRAW', 1)
      // return $cx.GUIengage(
      //   $cx.phaseinfo('坟场启动选择对手'),
      //   $cx.opptarget('deck'),
      //   $cx.run('PICK_CARD'),
      //   $cx.run('TO_GRAVEYARD'),
      // )
      return new Promise(function(resolve, reject) {
        console.log('JW15-002 atGraveyard tag effect this=', this)
        resolve()
      });
    },
  },
}
