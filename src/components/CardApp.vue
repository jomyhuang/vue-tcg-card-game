<template>
  <div class="hello">
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
            <el-button @click="handleFilter(9)">STAR 9</el-button>
            <el-button @click="handleFilter(8)">STAR 8</el-button>
            <el-button @click="handleFilter(7)">STAR 7</el-button>
            <el-button @click="$store.dispatch('PAGE_FILTER')">ALL</el-button>
            <el-button @click="$store.dispatch('FETCH_SCROLL_NEXT')">SCROLL NEXT</el-button>
            <el-button @click="toggleDeckList()">DECK LIST</el-button>
          </div>
          <!-- <el-button>UI按钮</el-button> -->
          <!-- getter {{ $store.getters.testGetter }} -->
    		</div>
    		<div class="col-md-10">
          <!-- <h3>STORE {{$store.state.storemsg}}</h3> -->
          <div v-show="showDeckList">
            <!-- <deckList :deckList="selectcards" ></deckList> -->
            <deckList :deckList="$store.getters.selectCards" ></deckList>
          </div>
          <!-- <button @click="$store.commit('TEST_STORE','STORE CLICK!')">TEST STORE COMMIT</button> -->
          <!-- <button @click="$store.dispatch('FETCH_PAGE',1)">FETCH_PAGE</button> -->
          <!-- {{$store.state.pageCurrent}} / {{$store.state.pageTotalPage}} -->
          <!-- <button @click="$store.dispatch('PAGE_NEXT', -1)">PAGE_PERV</button> -->
          <!-- <button @click="$store.dispatch('PAGE_NEXT')">PAGE_NEXT</button> -->
          <div>
            <!-- <el-button type="primary" icon="arrow-left" @click="$store.dispatch('PAGE_NEXT', -1)" :disabled="$store.getters.pagePrevDisabled">
              PAGE_PERV
            </el-button>
            <el-button type="primary" @click="$store.dispatch('PAGE_NEXT')" :disabled="$store.getters.pageNextDisabled">
              PAGE_NEXT
              <i class="el-icon-arrow-right el-icon--right"></i>
            </el-button> -->
            <div class="block">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="$store.state.pageCurrent"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="$store.state.pagePerItems"
                layout="total, sizes, prev, pager, next, jumper"
                :total="$store.state.pageKeyList.length">
              </el-pagination>
            </div>
          </div>
          <div class="flex-container">
            <div class="flex-item" v-for="(card,key,index) in $store.state.pageList">
              <div><h4>{{card.name}}</h4></div>
              <div>
                <span v-for="n in card.star">🌟</span>
              </div>
              <div>{{card.class}} {{card.race}} {{card.color}}</div>
              <div># {{card.cardno}}  [{{card.pro}}]</div>
              <div>{{card.attack1}} {{card.power1}}</div>
              <div>{{card.attack2}} {{card.power2}}</div>
              <div>
                  <deckControl :card="card"></deckControl>
              </div>
            </div>
            <div>
              <h3 v-if="loading">LOADING<i class="el-icon-loading"></i></h3>
            </div>
          </div>

    			<!-- <img alt="Bootstrap Image Preview" src="../assets/logo.png" /> -->
          <!--
    			<div class="list-group">
    				<div class="list-group-item">
    					卡牌列表
    				</div>
    				<div class="list-group-item" v-for="(card,key,index) in cardData">
    					<h4 class="list-group-item-heading">
    						{{card.name}}
    					</h4>
    					<p class="list-group-item-text">
                [{{index}}] : {{key}} -- -- {{card.playerClass}} -- {{card.cost}}
    					</p>
    				</div>
            <a class="list-group-item active">
              <span class="badge">14</span>精灵战争
            </a>
    			</div>
          -->
    		</div>
    	</div>
    </div>  </div>
</template>

<script>
// import cardDB from './cardDB.json'
import deckControl from './deckControl.vue'
import deckList from './deckList.vue'

export default {
  name: 'CardApp',
  data () {
    return {
      msg: 'Vue.js Card APP',
      cardData: {},
      scroll: true,
      loading: false,
      showDeckList: false,
      // page controller
      sampleData: {
        "AT_001": {
          "artist": "Nutthapon Petchthai",
          "collectible": true,
          "cost": 5,
          "dbfId": 2539,
          "dust": [
            40,
            400,
            5,
            50
          ],
          "flavor": "It's on the rack next to ice lance, acid lance, and English muffin lance.",
          "id": "AT_001",
          "name": "Flame Lance",
          "playRequirements": {
            "REQ_MINION_TARGET": 0,
            "REQ_TARGET_TO_PLAY": 0
          },
          "playerClass": "MAGE",
          "rarity": "COMMON",
          "set": "TGT",
          "text": "Deal $8 damage to a minion.",
          "type": "SPELL"
        },
        "AT_002": {
          "artist": "Tooth",
          "collectible": true,
          "cost": 3,
          "dbfId": 2541,
          "dust": [
            100,
            800,
            20,
            100
          ],
          "flavor": "Burning man, brah.",
          "id": "AT_002",
          "mechanics": [
            "SECRET"
          ],
          "name": "Effigy",
          "playerClass": "MAGE",
          "rarity": "RARE",
          "set": "TGT",
          "text": "<b>Secret:</b> When a friendly minion dies, summon a random minion with the same Cost.",
          "type": "SPELL"
        }
      }
    }
  },
  components: {
    deckControl,
    deckList
  },
  created () {
    // this.cardData = cardDB
    this.cardData = this.sampleData
  },
  mounted() {
    // this.$store.commit( 'INIT_DB' )
    // this.$store.commit( 'FETCH_REFRESH' )
    this.$store.dispatch( 'INIT_DB' )
    this.$store.dispatch( 'FETCH_PAGE', 1 )

    // console.log( 'mounted' )
    // test scroll
    window.addEventListener('scroll', this.scrollList, false);

  },
  beforeDestroy : function() {
    // 退出组件解除window的scroll事件,防止别的页面下拉加载。
    window.removeEventListener('scroll', this.scrollList, false);
  },
  computed: {
    selectcards() {
      let cards = []
      // cards.push( {id: 'AT001', playerClass: 'MAGE', name: 'TEST', cost:5, count: 2} )
      // cards.push( {id: 'AT002', playerClass: 'MAGE', name: 'TEST', cost:5, count: 3} )
      // cards.push( {id: 'AT003', playerClass: 'MAGE', name: 'TEST', cost:5, count: 1} )

      this.$store.state.pageFullList.forEach((card) => {
        if ( card.count > 0 )
          cards.push(card)
        // good.foods.forEach((food) => {
        //   if (food.count) {
        //     foods.push(food);
        //   }
      } )
      return cards
    }
  },
  methods: {
    handleFilter( val ) {
      this.$store.dispatch('PAGE_FILTER', val )
      console.log(`filter: ${val}`);

    },
    handleCurrentChange( val ) {
      this.$store.dispatch( 'FETCH_PAGE', val )
      // console.log(`当前页: ${val}`);
    },
    handleSizeChange(val) {
      this.$store.dispatch( 'FETCH_REFRESH', val )
      // this.$store.commit( 'FETCH_REFRESH', val )
      // console.log(`修改每页 ${val} 条`);
      // this.$store.dispatch( 'FETCH_PAGE', 1 )
    },
    toggleDeckList () {
      this.showDeckList = !this.showDeckList
    },
    scrollList () {
      if( this.scroll ) {
        // this.scroll = false

        let totalheight = parseFloat(window.innerHeight) + parseFloat(window.scrollY)
        // if ( document.body.clientHeight <= totalheight + 10 ) {
        if ( document.body.clientHeight <= totalheight + 200 ) {
            this.scroll = false
            this.loading = true
            console.log( 'scroller event loading' )

            // this.searchKey.limit += 20;
            // this.showLoading = true;
            setTimeout(() => {
              this.$store.dispatch('FETCH_SCROLL_NEXT')
              this.scroll = true
              this.loading = false
            }, 2000)
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: bold;
}

a {
  color: #42b983;
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
    /*添加背景图片*/
    /*background: url(../assets/inhand_minion_hunter-small.png) no-repeat center;*/
}
</style>
