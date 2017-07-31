<template>
<div class="comHand">
  <h4>Hand : {{player.hand.length}} cards</h4>
  <!-- <span>UITest: {{$attrs.UItest}} HOC1: {{$attrs.HOC1}} {{this.$attrs}}</span> -->
  <transition-group name="bounceRight" tag="div" class="flex-container">
    <!-- 向下传递 $attrs -->
    <comCard v-for="(card,key,index) in player.hand" :card="card" :key="key" v-bind="$attrs"></comCard>
    <!-- <comCard v-for="(card,key,index) in player.hand" :card="card" :key="key" :HOC1="$attrs.HOC1"></comCard> -->
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
    },
    // inheritAttrs: true,
  },
  components: {
    comCard,
  },
  created() {},
  mounted() {
    // console.log('comHand', this.$attrs);
  },
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
