<template>
  <div class="comCard">
      <div v-if="card===null">
        <h4>精灵战争</h4>
        <h5>未选择战士</h5>
      </div>
      <div v-else>
        <div v-if="card.facedown">
          <h4>精灵战争</h4>
          <div>{{card.name}}</div>
          <i class="el-icon-plus" @click.stop.prevent="faceup($event)">FACEUP</i>
        </div>
        <div v-else>
          <div><h4>{{card.name}}</h4></div>
          <div>
            <span v-for="n in card.star">🌟</span>
          </div>
          <div>{{card.class}} {{card.race}} {{card.color}}</div>
          <div># {{card.cardno}}  [{{card.pro}}]</div>
          <div>{{card.attack1}} {{card.power1}}</div>
          <div>{{card.attack2}} {{card.power2}}</div>
        </div>
        <div>
          <i class="el-icon-minus" @click.stop.prevent="tobase($event)">BASE</i>
          <br/>
          <i class="el-icon-minus" @click.stop.prevent="tograveyrad($event)">GRAVEYARD</i>
          <br/>
          <div v-if="card.selectable">
            <i class="el-icon-minus" @click.stop.prevent="selectcard($event)">
              <span v-if="card.selected">UNSELECT</span>
              <span v-else="card.selected">SELECT</span>
            </i>
            <br/>
          </div>
        </div>
      </div>
  </div>
</template>

<script>

export default {
  name: 'comCard',
  data () {
    return {
      msg: 'comCard msg'
    }
  },
  props: {
    card: {
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
    faceup(event) {
        this.$store.dispatch('SET_FACEUP',this.card)
    },
    tobase(event) {
      this.$store.commit('PICK_CARD',this.card)
      this.$store.commit('TO_BASE')
    },
    tograveyrad(event) {
      this.$store.commit('PICK_CARD',this.card)
      this.$store.commit('TO_GRAVEYARD')
    },
    selectcard(event) {
      this.$store.dispatch('ACT_SELECTED_CARD',this.card)
      // this.$store.commit('PICK_CARD',this.card)
      // this.$store.commit('SELECT_CARD',this.card)
      // this.$store.commit('SET_SELECTED')
      // this.$store.dispatch('ACT_SELECT_CARD_END')
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.comCard {
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
