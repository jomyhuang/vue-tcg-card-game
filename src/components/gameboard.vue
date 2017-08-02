<template>
<div class="gameboard">
  <h2>GAME BOARD</h2>
  <!-- <slot></slot> -->
  <el-row type="flex" class="gameboard">
    <el-col :span="4">
      <slot name="oppdeck"></slot>
    </el-col>
    <el-col :span="20">
      <slot name="opphand"></slot>
      <slot name="oppzone"></slot>
    </el-col>
  </el-row>
  <el-row type="flex" class="gameboard">
    <el-col :span="20">
      <slot name="zone"></slot>
      <slot name="hand"></slot>
    </el-col>
    <el-col :span="4">
      <slot name="deck"></slot>
    </el-col>
  </el-row>
  <el-row class="gameboard">
    <slot name="pad"></slot>
    <slot></slot>
  </el-row>
</div>
</template>

<script>

export default {
  name: 'gameboard',
  data() {
    return {
      // viewDeck: false,
    }
  },
  props: {
    // player: {
    //   type: Object,
    //   default: () => {},
    // }
  },
  components: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  computed: {},
  methods: {
    toggleViewDeck() {
    },
  }
}
</script>

<style>
/*@import '../style/base.scss';*/
</style>

<style scoped>

</style>
