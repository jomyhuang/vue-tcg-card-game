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
        // dispath,
        // opponent,
        // state,
        // commit,
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
        dispatch('DRAW',5)
      }
    },
    main() {
      return function (){
        console.warn('JW15-001 MAIN effect this=', this)
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
        dispatch('DRAW',3)
      }
    },
    main() {
      return () => {
        console.log(`${this.cardno} MAIN effect`)
      }
    }
  },
}
