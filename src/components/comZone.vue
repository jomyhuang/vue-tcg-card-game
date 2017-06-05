<template>
<div class="comZone">
  <h4>Zone : {{player.zone.length}} cards</h4>
  <transition-group name="bounceRight" tag="div" class="flex-container">
    <comCard v-for="(card,key,index) in player.zone" :card="card" :key="key"></comCard>
  </transition-group>

  <!-- <mu-flexbox>
    <transition-group name="bounceRight" tag="div">
    <mu-flexbox-item v-for="(card,key,index) in player.zone" :key="key">
      <comCard :card="card"></comCard>
    </mu-flexbox-item>
    </transition-group>
  </mu-flexbox>
 -->
</div>
</template>

<script>
// import cardDB from './cardDB.json'
// import deckControl from './deckControl.vue'
import comCard from './comCard.vue'

export default {
  name: 'comeZone',
  data() {
    return {
      msg: 'comeZone msg'
    }
  },
  props: {
    player: {
      type: Object,
      default: () => {},
    }
  },
  components: {
    comCard,
  },
  created() {},
  mounted() {},
  beforeDestroy() {},
  computed: {},
  methods: {}
}
</script>

<style>
/*@import '../style/base.scss';*/
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
