export default {
  "JW15-001": {
    mounted() {
      // return () => {
        console.log('JW15-001 mounted')
        console.log('this',this);
        this.name = 'XYZ'
      // }
    },
    isAttacker({
      state
    }) {
      console.log('JW15-001 hello')
    },
  },
}
