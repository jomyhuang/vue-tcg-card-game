export default {
  "JW15-001": {
    mounted() {
      return function () {
        console.log('mounted this =', this)
        this.name = this.name + 'XYZ'
        console.log('JW15-001 mounted test ok')
      }
    },
    isAttacker({
      // card,
      // player,
      // // state,
      // // dispath
    }
    , payload) {
      // 箭头函数的this不由bind控制, 使用this最后不用箭头函数
      // return () => {
        return function({card,player}) {
        console.log('JW15-001 isAttacker effect test this=', this)
        console.log(`JW15-001 player ${player} effect call OK!`)
        // console.log(card);
        console.log(`JW15-001 ${this.name} effect call OK!`)

        return [123]
      }
    },
  },
}
