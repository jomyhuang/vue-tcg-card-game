<template>
<div class="deckControl">
  <i class="el-icon-plus" @click.stop.prevent="addDeck($event)"></i>
  <span v-show="card.count > 0">
       张数：{{card.count}}
       <i class="el-icon-minus"  v-show="card.count > 0" @click.stop.prevent="decreaseDeck($event)"></i>
     </span>
</div>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
export default {
  props: {
    card: {
      type: Object,
      default: () => {},
    }
  },
  methods: {
    addDeck(event) {
      console.log('DeckControl adddeck')

      // if (!event._constructed) {
      //   // 去掉自带click事件的点击
      //   console.log( 'DeckControl adddeck stop prevent' )
      //   return;
      // }

      if (!this.card.count) {
        Vue.set(this.card, 'count', 1);
      } else {
        this.card.count++;
      }
      // //        event.srcElement.outerHTML
      //         this.$emit('increment', event.target); // 子组件通过 $emit触发父组件的方法 increment   还
    },
    decreaseDeck(event) {
      console.log('DeckControl decreaseDeck')

      // if (!event._constructed) {
      //   // 去掉自带click事件的点击
      //   return;
      // }

      if (!this.card.count) {
        Vue.set(this.card, 'count', 0)
      } else {
        if (this.card.count > 0)
          this.card.count--
      }
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


/*.cart-add, .cart-decrease {
    display: inline-block;
    padding: 6px;
    line-height: 24px;
    font-size: 24px;
    vertical-align: top;
    color: rgb(0,0,200);
    font-weight: bold;
  }*/
</style>
