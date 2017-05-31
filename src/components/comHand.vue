<template>
<div class="comHand">
  <h4>Hand : {{player.hand.length}} cards</h4>
  <transition-group name="bounceRight" tag="div" class="flex-container">
    <comCard v-for="(card,key,index) in player.hand" :card="card" :key="key"></comCard>
  </transition-group>
</div>
</template>

<script>
// import cardDB from './cardDB.json'
// import deckControl from './deckControl.vue'
import comCard from './comCard.vue'

export default {
  name: 'comHand',
  data() {
    return {
      msg: 'comHand msg'
    }
  },
  // props: ['player'],
  props: {
    player: {
      type: Object,
      default: () => {},
    }
  },
  components: {
    comCard,
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  computed: {},
  methods: {}
}
</script>

<style>
/*@import '../style/base.scss';*/
</style>

<style scoped>
</style>
