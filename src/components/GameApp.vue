<template>
  <div class="gameapp">
  	<div class="row gameboard">
  		<div class="col-md-12">
  			<h3>{{ msg }} $ {{ $store.state.storemsg }}</h3>
        <el-button @click="gameInit()">GAME INIT</el-button>
        <el-button @click="gameStart()">GAME START</el-button>
  		</div>
  	</div>
    <div class="row gameboard">
  		<div class="col-md-4 gameboard">
          <h3>player 2 deck</h3>
          <comDeck :player="$store.state.player2"></comDeck>
          <!-- <el-button @click="handleFilter(9)">STAR 9</el-button> -->
          <!-- <el-button @click="$store.dispatch('PAGE_FILTER')">ALL</el-button> -->
  		</div>
  		<div class="col-md-8 gameboard">
        <h3>player2 container</h3>
  		</div>
  	</div>
  	<div class="row gameboard">
  		<div class="col-md-8">
        <div class="row gameboard">
          <h3>player1 container</h3>
        </div>
        <div class="row gameboard">
          <comHand :player="$store.state.player1"></comHand>
        </div>
  		</div>
      <div class="col-md-4 gameboard">
          <h3>deck1</h3>
          <comDeck :player="$store.state.player1"></comDeck>
          <!-- <el-button @click="handleFilter(9)">STAR 9</el-button> -->
          <!-- <el-button @click="$store.dispatch('PAGE_FILTER')">ALL</el-button> -->
  		</div>
  	</div>
  </div>
</template>

<script>
// import cardDB from './cardDB.json'
// import deckControl from './deckControl.vue'
import comDeck from './comDeck.vue'
import comHand from './comHand.vue'

export default {
  name: 'GameApp',
  data () {
    return {
      msg: 'SDW GAME APP'
    }
  },
  components: {
    comDeck,
    comHand
  },
  created () {
  },
  mounted () {
    this.$store.dispatch( 'GAME_INIT' )
  },
  beforeDestroy () {
  },
  computed: {
  },
  methods: {
    gameInit () {
        this.$store.dispatch( 'GAME_INIT' )
        console.log('game Init')
    },
    gameStart () {
        console.log('game Start')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: bold;
}

.gameboard {
  border: thin solid #0000ff;
  background-color: lightblue;
  padding: 15px;
}

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
