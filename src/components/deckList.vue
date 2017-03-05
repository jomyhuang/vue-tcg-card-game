<template>
  <div class="deckList">
    <h3>套牌列表</h3>
    <ul>
      <li v-for="(card,key,index) in deckList">
        <div>
          {{card.cardno}} {{card.name}} {{card.class}} {{card.race}} {{card.color}}
          <deckControl :card="card"></deckControl>
        </div>
      </li>
    </ul>
    <div>套牌合计张数 : {{totalCount}}</div>
    <el-button>SAVE</el-button>
    <el-button @click="empty()">CLEAR</el-button>
  </div>
</template>

<script type="text/ecmascript-6">
  import deckControl from './deckControl.vue'

  export default {
    props: {
      deckList: {
        type: Array,
        default() {
          return [ {id: 'AT001', playerClass: 'MAGE', name: 'SAMPLE CARD', cost:5, count: 2} ]
        }
      }
    },
    components: {
      deckControl
    },
    computed: {
      totalCount () {
        let count = 0
        this.deckList.forEach( (card) => {
          count += card.count
        } )
        return count
      }
    },
    methods: {
      empty() {
        this.deckList.forEach( (card) => {
          card.count = 0
        } )
      }
    }
  };
</script>
<style scoped>

  /*font-size: 0
  .cart-decrease, .cart-add {
    display: inline-block
    padding: 4px 6px 6px 6px
    &.fade-enter-active, &.fade-leave-active {
      transition: all 0.4s linear
    }
    &.fade-enter, &.fade-leave-active {
      opacity: 0
      transform translate3d(24px, 0, 0)
    }*/
    /*.inner {
      display inline-block
      line-height 24px
      font-size 24px
      vertical-align top
      color rgb(0, 160, 220, 0.2)
      &.inner-enter-active, &.inner-leave-active {
        transition: all 0.4s linear
        transform: rotate(0)
      }
      &.inner-enter, &.inner-leave-active {
        opacity: 0
        transform  rotate(180deg)
      }
    }
  }
  .cart-count {
    display inline-block
    font-size 10px
    line-height 24px
    width 12px
    vertical-align top
    padding-top 6px
    text-align center
    color rgb(147, 153, 159)
  }*/
  .deckList {
    background-color: lightgray;
    padding: 10px;
    margin: 5px;
    border:none 5px #000000;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    border-radius: 5px;
  }
  .cart-add, .cart-decrease {
    display: inline-block;
    padding: 6px;
    line-height: 24px;
    font-size: 24px;
    vertical-align: top;
    color: rgb(0,0,200);
    font-weight: bold;
  }

</style>
