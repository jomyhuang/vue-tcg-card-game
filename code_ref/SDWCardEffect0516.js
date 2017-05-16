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
    // engage: $cx.engage(is.attacker,$cx.buff(1000)),
    mounted() {
      // console.log('mounted this =', this)
      this.name = this.name + 'TEST'
      // console.log('JW15-001 mounted test ok')
    },
    isAttacker: $cx.engage($cx.buff(500),$cx.buff(500,'special power!')),
    // isAttacker({
    //   card,
    //   buff,
    //   // player,
    //   // opponent,
    // }, payload) {
    //   console.log('JW15-001 isAttacker effect test this=', this)
    //   // console.log(`JW15-001 player ${player} effect call OK!`)
    //   // console.log(card);
    //   // console.log(`JW15-001 ${this.name} effect call OK!`)
    //   // mutil.addbuff(card, 1000, effect)
    //   buff(500)
    //   buff(500, 'special power!')
    //   // buff(card, 1000, effect)
    // },
    // second will overwrite first
    // isAttacker() {
    //   console.error('JW15-001 test second function');
    // },
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
      rxdispatch,
      rxcommit,
      rx,
      pipe,
      tap,
    }) {
      console.warn('JW15-001 MAIN effect this=', this)
      const effectfunc = {
        phase: 'JW15-001 main selection',
        message: `${this.name}效果选择手牌进入黑洞`,
        list: 'hand',
        // many: 1,
        // selectedMuation: (state, card) => {
        //   state.storemsg = `select ${card.name}`
        //   card.name = card.name + '[ES]'
        // },
        selectedAction: (state, card) => {
          console.log('JW15-001 处理选择后进入黑洞 ', card)
          commit('PICK_CARD', card)
          // commit('TO_BASE')
          commit('TO_GRAVEYARD')
          console.log('JW15-001 selectedAction OK ', card)
        },
        // thenAction: (state) => {},
      }
      // return dispatch('EFFECT_ACT_SELECTION', selectfunc)
      // return effectfunc
      // return R.pipe(
      //   rxcommit('SELECT_LIST','hand'),
      //   rxdispatch('EFFECT_CHOICE'),
      //   rxcommit('PICK_CARD'),
      //   rxcommit('TO_GRAVEYARD'),
      // )

      // const rx = mutil.rx.bind(mutil)

      return $cx.pipe(
        // rxcommit('SELECT_LIST','hand'),
        // () => mutil.tap('test'),
        // tap('this'),
        $cx.run('SELECT_LIST', 'opp_zone'),
        $cx.run('SELECT_FILTER', x => x.star >= 3),
        // rxcommit('SELECT_MAP', x => { x.name = x.name + '***'; return x } ),
        // rxdispatch('EFFECT_CHOICE', 'hand'),
        $cx.run('EFFECT_CHOICE'),
        $cx.run('PICK_CARD'),
        $cx.run('TO_GRAVEYARD'),
      )
      // return cxpipe(
      //   // rxcommit('SELECT_LIST','hand'),
      //   () => mutil.tap('test'),
      //   tap('this'),
      //   cxrun('SELECT_LIST', 'opp_zone'),
      //   cxrun('SELECT_FILTER', x => x.star >= 3),
      //   // rxcommit('SELECT_MAP', x => { x.name = x.name + '***'; return x } ),
      //   // rxdispatch('EFFECT_CHOICE', 'hand'),
      //   cxrun('EFFECT_CHOICE'),
      //   cxrun('PICK_CARD'),
      //   cxrun('TO_GRAVEYARD'),
      // )
      // return pipe(
      //   // rxcommit('SELECT_LIST','hand'),
      //   () => mutil.tap('test'),
      //   tap('this'),
      //   rx('SELECT_LIST', 'opp_zone'),
      //   rx('SELECT_FILTER', x => x.star >= 3),
      //   // rxcommit('SELECT_MAP', x => { x.name = x.name + '***'; return x } ),
      //   // rxdispatch('EFFECT_CHOICE', 'hand'),
      //   rx('EFFECT_CHOICE'),
      //   rx('PICK_CARD'),
      //   rx('TO_GRAVEYARD'),
      // )
      // return [
      // // return [
      //   () => dispatch('EFFECT_CHOICE', 'hand').then( ()=> console.log('effect choice then')),
      //   //  箭头函数加上 {} 必须加上 return
      //   // () => { return dispatch('EFFECT_CHOICE', state.currentPlayer.hand ) }
      //   () => commit('PICK_CARD'),
      //   () => commit('TO_GRAVEYARD'),
      //   // 'list4',
      // ]
    },
  },
  "JW15-002": {
    faceup() {
      // console.log(`${this.cardno} FACEUP effect this=`, this)
      // dispatch('DRAW',2)
    },
    main() {
      // console.log(`${this.cardno} MAIN effect`)
      // const effectfunc = {
      //
      // }
      // return effectfunc
    }
  },
}
