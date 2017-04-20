import mutil from '@/mutil'

export default {
  "JW15-001": {
    mounted() {
      return function () {
        // console.log('mounted this =', this)
        this.name = this.name + 'TEST'
        // console.log('JW15-001 mounted test ok')
      }
    },
    isAttacker({
      card,
      // player,
      // opponent,
      // state,
      // commit,
      // dispath,
    }, payload) {
      // 箭头函数的this不由bind控制, 使用this最后不用箭头函数
      // return () => {
      return function ({
        card,
        player,
        effect,
        buff,
        dispatch,
        // opponent,
        state,
        commit,
      }) {
        console.log('JW15-001 isAttacker effect test this=', this)
        // console.log(`JW15-001 player ${player} effect call OK!`)
        // console.log(card);
        // console.log(`JW15-001 ${this.name} effect call OK!`)

        // mutil.addbuff(card, 1000, effect)
        buff(500)
        buff(500, 'special power!')
        // buff(card, 1000, effect)
      }
    },
    faceup() {
      return function ({
        card,
        player,
        dispatch,
      }) {
        console.log('JW15-001 FACEUP effect this=', this)
        dispatch('DRAW',1)
      }
    },
    main() {
      return function ( {
        card,
        player,
        effect,
        buff,
        dispatch,
        // opponent,
        state,
        commit,
      } ){
        console.warn('JW15-001 MAIN effect this=', this)
        const selectfunc = {
          phase: 'JW15-001 main selection',
          list: 'hand',
          many: 1,
          // agent: state.currentPlayer.agent,
          // init: xSel,
          selectedMuation: (state, card) => {
            state.storemsg = `select ${card.name}`
            card.name = card.name + '[ES]'
          },
          selectedAction: (state, card) => {
            console.log('JW15-001 处理选择后进入黑洞 ',card)
            commit('PICK_CARD', card)
            // commit('TO_BASE')
            commit('TO_GRAVEYARD')
          },
          thenAction: (state) => {
          },
        }
        dispatch('EFFECT_ACT_SELECTION',selectfunc)
        // console.warn('EFFECT_ACT_SELECTION finish')
      }
    },
  },
  "JW15-002": {
    faceup() {
      return function ({
        card,
        player,
        dispatch,
      }) {
        console.log(`${this.cardno} FACEUP effect this=`, this)
        // dispatch('DRAW',2)
      }
    },
    main() {
      return () => {
        console.log(`${this.cardno} MAIN effect`)
      }
    }
  },
}
