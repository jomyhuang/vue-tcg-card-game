import mutil from '@/mutil'
import R from 'ramda'


export default {
  "JW15-001": {
    mounted() {
      // console.log('mounted this =', this)
      this.name = this.name + 'TEST'
      // console.log('JW15-001 mounted test ok')
    },
    isAttacker({
      card,
      buff,
      // player,
      // opponent,
      // state,
      // commit,
      // dispatch,
    }, payload) {
      console.log('JW15-001 isAttacker effect test this=', this)
      // console.log(`JW15-001 player ${player} effect call OK!`)
      // console.log(card);
      // console.log(`JW15-001 ${this.name} effect call OK!`)
      // mutil.addbuff(card, 1000, effect)
      buff(500)
      buff(500, 'special power!')
      // buff(card, 1000, effect)
    },
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
      return [
      // return [
        () => dispatch('EFFECT_CHOICE', 'hand').then( ()=> console.log('effect choice then')),
        //  箭头函数加上 {} 必须加上 return
        // () => { return dispatch('EFFECT_CHOICE', state.currentPlayer.hand ) }
        () => commit('PICK_CARD'),
        () => commit('TO_GRAVEYARD'),
        // 'list4',
      ]
    },
  },
  "JW15-002": {
    faceup() {
      console.log(`${this.cardno} FACEUP effect this=`, this)
      // dispatch('DRAW',2)
    },
    main() {
      console.log(`${this.cardno} MAIN effect`)
      // const effectfunc = {
      //
      // }
      // return effectfunc
    }
  },
}
