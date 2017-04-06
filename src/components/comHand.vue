<template>
<div class="comHand">
  <h4>Hand : {{player.hand.length}} cards</h4>
  <!-- <div class="flex-container"> -->
  <transition-group name="bounceRight" tag="div" class="flex-container">
    <comCard v-for="(card,key,index) in player.hand" :card="card" :key="key"></comCard>
  </transition-group>
  <!-- </div> -->
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.flex-container {
  display: -webkit-flex;
  display: flex;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
  /*height: 250px;*/
  /*background-color: lightgrey;*/
}

.flex-item {
  background-color: lightgrey;
  width: 150px;
  height: 200px;
  margin: 5px;
  border: none 5px #000000;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
</style>
