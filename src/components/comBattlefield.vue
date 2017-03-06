<template>
  <div class="comHand">
    <h4>battlefield : {{player.battlefield.length}} cards</h4>
    <div class="flex-container">
      <div class="flex-item" v-for="(card,key,index) in player.battlefield">
        <div><h4>{{card.name}}</h4></div>
        <div>
          <span v-for="n in card.star">🌟</span>
        </div>
        <div>{{card.class}} {{card.race}} {{card.color}}</div>
        <div># {{card.cardno}}  [{{card.pro}}]</div>
        <div>{{card.attack1}} {{card.power1}}</div>
        <div>{{card.attack2}} {{card.power2}}</div>
      </div>
    </div>
  </div>
</template>

<script>
// import cardDB from './cardDB.json'
// import deckControl from './deckControl.vue'
// import deckList from './deckList.vue'

export default {
  name: 'comBattlefield',
  data () {
    return {
      msg: 'comBattlefield msg'
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
    margin: 5px;
    border:none 5px #000000;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
}
</style>
