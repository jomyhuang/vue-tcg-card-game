export default {
  "JW15-001": {
    mounted() {
      return () => {
        console.log('JW15-001 mounted test')
        console.log('test this bind',this)
        this.name = this.name + 'XYZ'
      }
    },
    isAttacker({
      card,
      player,
      state,
      dispath
    }) {
      console.log('JW15-001 isAttacker effect this', this)
      console.log('JW15-001 effect', state)
    },
  },
}
