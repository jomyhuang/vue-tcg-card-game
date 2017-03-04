<template>
  <div class="gameapp">
    <div class="container-fluid">
    	<div class="row">
    		<div class="col-md-12">
    			<h3>
            <h1>{{ msg }}</h1>
    			</h3>
    		</div>
    	</div>
    	<div class="row">
    		<div class="col-md-2">
          <div>
            <!-- <el-button @click="handleFilter(9)">STAR 9</el-button> -->
            <!-- <el-button @click="$store.dispatch('PAGE_FILTER')">ALL</el-button> -->
          </div>
    		</div>
    		<div class="col-md-10">
          <h3>this is container</h3>
    		</div>
    	</div>
    </div>  </div>
</template>

<script>
// import cardDB from './cardDB.json'
// import deckControl from './deckControl.vue'
// import deckList from './deckList.vue'

export default {
  name: 'GameApp',
  data () {
    return {
      msg: 'SDW GAME APP'
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
h1, h2 {
  font-weight: bold;
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
    border:none 5px #000000;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
}
</style>
