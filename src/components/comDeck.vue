<template>
<div class="comDeck">
  <h5>#{{player.id}} {{player.name}}</h5>
  <h5>hero {{player.hero}}</h5>
  <h3>套牌 {{player.deck.length}} <i class="el-icon-view" @click.stop.prevent="toggleViewDeck()"></i></h3>
  <div v-show="viewDeck">
    <ul>
      <li v-for="card in player.deck">{{card.name}}</li>
    </ul>
  </div>
  <h3>休息仓 {{player.base.length}} <i class="el-icon-view" @click.stop.prevent="toggleViewBase()"></i></h3>
  <div v-show="viewBase">
    <ul>
      <li v-for="card in player.base">{{card.name}}</li>
    </ul>
  </div>
  <h3>黑洞 {{player.graveyard.length}} <i class="el-icon-view" @click.stop.prevent="toggleViewGraveyard()"></i></h3>
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
  margin: 10px;
  border: none 5px #000000;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
</style>
