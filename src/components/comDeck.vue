<template>
<div class="comDeck">
  <h5>#{{player.id}} {{player.name}}</h5>
  <h5>hero {{player.hero}}</h5>
  <h2>套牌 {{player.deck.length}} <i class="el-icon-view" @click.stop.prevent="toggleViewDeck()"></i></h2>
  <div v-show="viewDeck">
    <ul>
      <li v-for="card in player.deck">{{card.name}}</li>
    </ul>
  </div>
  <h2>休息仓 {{player.base.length}} <i class="el-icon-view" @click.stop.prevent="toggleViewBase()"></i></h2>
  <div v-show="viewBase">
    <ul>
      <li v-for="card in player.base">{{card.name}}</li>
    </ul>
  </div>
  <h2>黑洞 {{player.graveyard.length}} <i class="el-icon-view" @click.stop.prevent="toggleViewGraveyard()"></i></h2>
  <div v-show="viewGraveyard">
    <ul>
      <li v-for="card in player.graveyard">{{card.name}}</li>
    </ul>
  </div>
</div>
</template>

<script>
// import cardDB from './cardDB.json'
// import deckControl from './deckControl.vue'
// import deckList from './deckList.vue'

export default {
  name: 'comDeck',
  data() {
    return {
      msg: 'comDeck msg',
      viewDeck: false,
      viewBase: false,
      viewGraveyard: false,
    }
  },
  // props: ['player'],
  props: {
    player: {
      type: Object,
      default: () => {},
    }
  },
  components: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  computed: {},
  methods: {
    toggle(view) {
      view = !view
    },
    toggleViewDeck() {
      this.viewDeck = !this.viewDeck
    },
    toggleViewBase() {
      this.viewBase = !this.viewBase
    },
    toggleViewGraveyard() {
      this.viewGraveyard = !this.viewGraveyard
    }
  }
}
</script>

<style>
/*@import '../style/base.scss';*/
</style>

<style scoped>

</style>
