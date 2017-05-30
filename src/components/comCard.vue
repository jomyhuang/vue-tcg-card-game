<template>
<Card :class="classCard" class="comCard-iview" padding="1">
  <div v-if="card===null">
    <h4>精灵战争</h4>
    <h5>CARD NULL</h5>
  </div>
  <!-- <div v-else @click.stop.prevent="selectcard($event)"> -->
  <div v-else @click.stop.prevent="card.selectable ? selectcard($event) : undefined">
    <div v-if="card.selectable">
      <Button type="text" icon="checkmark-round" @click.stop.prevent="selectcard($event)">
          <span v-if="card.selected">UNSELECT</span>
          <span v-else="card.selected">SELECT</span>
      </Button>
    </div>
    <div v-if="card.facedown">
      <h4>精灵战争</h4>
      <div>{{card.name}}</div>
    </div>
    <div v-else>
      <div>
        <h5>{{card.name}}</h5>
      </div>
      <div>
        <span v-for="n in card.star">🌟</span>
      </div>
      <!-- <div v-tooltip.bottom-end="{ content: this.cardtext, classes: 'cardtip' }"> -->
      <!-- <div class="mu-card-tip" ref="cardtext" @mouseenter="handleHover" @mouseleave="handleHoverExit"> -->
        <!-- <mu-tooltip :label="cardtext" :show="show" :trigger="trigger" verticalPosition="bottom" horizontalPosition="center"/> -->
      <Tooltip placement="bottom-start">
        <div slot="content">
          {{card.class}} {{card.race}} {{card.color}}<br/>
          # {{card.cardno}} [{{card.pro}}]<br/>
          {{card.attack1}} {{card.power1}}{{card.attack2}} {{card.power2}}<br/>
          {{card.effecttext}}
        </div>
        <div>
          {{card.class}} {{card.race}} {{card.color}}<br/>
          # {{card.cardno}} [{{card.pro}}]<br/>
          {{card.attack1}} {{card.power1}}<br/>
          {{card.attack2}} {{card.power2}}<br/>
        </div>
      </Tooltip>
    </div>
  </div>
</Card>
</template>
<script>
export default {
  name: 'comCard',
  data() {
    return {
      msg: 'comCard msg',
      background: '#FF0000',
      trigger: null,
      show: false,
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
  mounted() {
    // this.trigger = this.$refs.cardtext
  },
  beforeDestroy() {},
  computed: {
    classCard() {
      return {
        'normal': !this.card.selectable,
        'selectable': this.card.selectable,
      }
    },
    cardtext() {
      return this.card ? `${this.card.class} ${this.card.color} [${this.card.pro}]<br/>${this.card.power1} ${this.card.power2}<br/>${this.card.effecttext}` : 'NULL'
    }
  },
  methods: {
    // handleHover () {
    //   this.show = true
    // },
    // handleHoverExit () {
    //   this.show = false
    // },
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

.comCard-text {
  padding: 1px;
}

.comCard-muse {
  /*background-color: lightgrey;*/
  width: 120px;
  height: 150px;
  margin: 5px;
  /*border: none 2px #000000;*/
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}

.comCard-iview {
  /*background-color: lightgrey;*/
  width: 120px;
  height: 150px;
  margin: 5px;
  /*border: none 2px #000000;*/
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  padding: 1px;
}

.normal {
  background-color: lightgrey;
  border: solid 2px lightgrey;
}

.selectable {
  background-color: lightgrey;
  border: solid 2px red;
}

.mu-card-tip{
  display: inline-block;
  cursor: default;
  position: relative;
}

</style>

<style lang="scss">
$primary-color: blue;

.scssstyle {
  color: $primary-color;
}
</style>


<style lang="sass">
$font-stack:    Helvetica, sans-serif
$primary-color: yellow

.style5
  font: 100% $font-stack
  color: $primary-color
</style>
