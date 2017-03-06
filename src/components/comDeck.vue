<template>
  <div class="comDeck">
      <h5>#{{player.id}} {{player.name}}</h5>
      <h5>hero {{player.hero}}</h5>
      <h3>{{player.deck.length}}</h3>
    </div>
</template>

<script>
// import cardDB from './cardDB.json'
// import deckControl from './deckControl.vue'
// import deckList from './deckList.vue'

export default {
  name: 'comDeck',
  data () {
    return {
      msg: 'comDeck msg'
    }
  },
  props: {
    player: {
      type: Object
    }
  },
  components: {
  },
  created () {
  },
  mounted () {
  },
  beforeDestroy () {
  },
  computed: {
  },
  methods: {
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
    border:none 5px #000000;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
}
</style>
