<template>
<div :class="classCard" class="comCard scssstyle">
  <div class="style1" v-if="card===null">
    <h4>精灵战争</h4>
    <h5>未选择战士</h5>
  </div>
  <!-- <div v-else @click.stop.prevent="selectcard($event)"> -->
  <div v-else @click.stop.prevent="card.selectable ? selectcard($event) : undefined">
    <div v-if="card.selectable">
      <i class="el-icon-circle-check" @click.stop.prevent="selectcard($event)">
          <span v-if="card.selected">UNSELECT</span>
          <span v-else="card.selected">SELECT</span>
      </i>
      <br/>
    </div>
    <div v-if="card.facedown">
      <h4>精灵战争</h4>
      <div>{{card.name}}</div>
      <!-- <i class="el-icon-plus" @click.stop.prevent="faceup($event)">FACEUP</i> -->
    </div>
    <div v-else>
      <div>
        <h5>{{card.name}}</h5></div>
      <div>
        <span v-for="n in card.star">🌟</span>
      </div>
      <div v-tooltip.bottom-end="{ content: 'info<br/>' + card.effecttext, classes: 'cardtip' }">
        <div>{{card.class}} {{card.race}} {{card.color}}</div>
        <div># {{card.cardno}} [{{card.pro}}]</div>
        <div>{{card.attack1}} {{card.power1}}</div>
        <div>{{card.attack2}} {{card.power2}}</div>
      </div>
    </div>
    <div>
      <!-- <i class="el-icon-minus" @click.stop.prevent="tobase($event)">B</i>
      <br/>
      <i class="el-icon-minus" @click.stop.prevent="tograveyrad($event)">G</i>
      <br/> -->
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'comCard',
  data() {
    return {
      msg: 'comCard msg',
      background: '#FF0000',
    }
  },
  // props: ['card'],
  props: {
    card: {
      type: Object,
      default: () => {},
    }
  },
  components: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  computed: {
    classCard() {
      return {
        'normal': !this.card.selectable,
        'selectable': this.card.selectable,
      }
    }
  },
  methods: {
    faceup(event) {
      this.$store.dispatch('SET_FACEUP', this.card)
    },
    tobase(event) {
      this.$store.commit('PICK_CARD', this.card)
      this.$store.commit('TO_BASE')
    },
    tograveyrad(event) {
      this.$store.commit('PICK_CARD', this.card)
      this.$store.commit('TO_GRAVEYARD')
    },
    selectcard(event) {
      if(this.card.selectable) {
        this.$store.dispatch('ACT_SELECTED_CARD', this.card)
      }
      else {
        console.log('card no choice')
      }
      // this.$store.commit('PICK_CARD',this.card)
      // this.$store.commit('SELECT_CARD',this.card)
      // this.$store.commit('SET_SELECTED')
      // this.$store.dispatch('ACT_SELECT_CARD_END')
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- card size 150x200 -->
<style scoped>
.comCard {
  /*background-color: lightgrey;*/
  width: 120px;
  height: 150px;
  margin: 5px;
  border: none 2px #000000;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}

.normal {
  background-color: lightgrey;
}

.selectable {
  background-color: lightgrey;
  border: solid 2px red;
}

.mytip2 {
  display: none;
  opacity: 0;
  transition: opacity .15s;
  pointer-events: none;
  padding: 4px;
  z-index: 10000;
  .tooltip-content {
    background: green;
    color: white;
    border-radius: 16px;
    padding: 5px 10px 4px;
  }
  &.tooltip-open-transitionend {
    display: block;
  }
  &.tooltip-after-open {
    opacity: 1;
  }
}
</style>

<style lang="scss">
$primary-color: blue;

.scssstyle {
  color: $primary-color;
}

.mytip_bug {
    display: none;
    opacity: 0;
    transition: opacity 0.15s;
    pointer-events: none;
    padding: 4px;
    z-index: 10000;
    .tooltip-content {
        background: green;
        color: white;
        border-radius: 16px;
        padding: 5px 10px 4px;
    }
    &.tooltip-open-transitionend {
        display: block;
    }
    &.tooltip-after-open {
        opacity: 1;
    }
}
</style>


<style lang="sass">
$font-stack:    Helvetica, sans-serif
$primary-color: yellow

.style5
  font: 100% $font-stack
  color: $primary-color
</style>
