<template>
<!-- <el-card :class="classCard" class="comCard-el" :padding="padding"> -->
<el-card :class="classCard" class="comCard-el" :body-style="{ padding: '0px' }">
  <div v-if="card">
    <div @click.stop.prevent="card.selectable ? selectcard($event) : undefined">
      <div v-if="card.selectable">
        <el-button type="text" icon="checkmark-round" @click.stop.prevent="selectcard($event)">
          <span v-if="card.selected">UNSELECT</span>
          <span v-else="card.selected">SELECT</span>
        </el-button>
      </div>
      <div v-if="card.facedown" class="comCard-text-faceoff">
        <p/>
        <img src="../assets/sdwlogo.png" width="80">
        <div v-if="!card.selectable">精灵战争</div>
        <!-- <div class="comCard-title">{{card.name}}</div> -->
      </div>
      <div v-else>
        <div class="card-title">{{card.name}}</div>
        <!-- <div>UI {{this.format}} $attrs.HOC1 {{$attrs.HOC1}}</div> -->
        <!-- <div v-if="isactive">ACTIVE</div> -->
        <div>
          <span v-for="n in card.star">🌟</span>
        </div>
        <!-- <div v-tooltip.bottom-end="{ content: this.cardtext, classes: 'cardtip' }"> -->
        <!-- <div class="mu-card-tip" ref="cardtext" @mouseenter="handleHover" @mouseleave="handleHoverExit"> -->
        <!-- <mu-tooltip :label="cardtext" :show="show" :trigger="trigger" verticalPosition="bottom" horizontalPosition="center"/> -->
        <div v-if="showtips">
          <el-tooltip class="item" placement="bottom">
                <!-- <el-button>下边</el-button>
          </el-tooltip> -->
          <!-- <Tooltip placement="bottom-start"> -->
            <div slot="content">
              {{card.class}} {{card.race}} {{card.color}}<br/> # {{card.cardno}} [{{card.pro}}]<br/> {{card.attack1}} {{card.power1}}{{card.attack2}} {{card.power2}}<br/> {{card.effecttext}}
            </div>
            <div class="comCard-text">
              {{card.class}} {{card.race}} {{card.color}}<br/> # {{card.cardno}} [{{card.pro}}]<br/> {{card.attack1}} {{card.power1}}<br/> {{card.attack2}} {{card.power2}}<br/>
            </div>
          </el-tooltip>
        </div>
        <div v-else>
          <div class="comCard-text">
            {{card.class}} {{card.race}} {{card.color}}<br/> # {{card.cardno}} [{{card.pro}}]<br/> {{card.attack1}} {{card.power1}}<br/> {{card.attack2}} {{card.power2}}<br/>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="comCard-text-faceoff">
    <p/>
    <img src="../assets/sdwlogo.png" width="80">
  </div>
</el-card>
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
      onselect: null,
      // padding: 1,
    }
  },
  // props: ['card'],
  props: {
    card: {
      type: Object,
      default: () => {
        selectable: false
      },
    },
    showtips: {
      type: Boolean,
      default: true,
    },
    format: {
      type: Number,
      default: 999,
    },
    // style: {
    //   type: String,
    //   default: 'normal',
    // }
  },
  components: {},
  created() {},
  mounted() {
    // console.log('comCard', this.$attrs);
  },
  beforeDestroy() {},
  computed: {
    classCard() {
      let res = this.card ? {
          'normal': !this.card.selectable,
          'selectable': this.card.selectable,
          'effectactive': false,
        } : {
          'normal': true,
          'selectable': false,
          'effectactive': false,
        }
      if(this.isactive) {
        res = {
          'normal': true,
          'selectable': false,
          'effectactive': true,
        }
      }
      return res
    },
    cardtext() {
      return this.card ? `${this.card.class} ${this.card.color} [${this.card.pro}]<br/>${this.card.power1} ${this.card.power2}<br/>${this.card.effecttext}` : 'NULL'
    },
    isactive() {
      if(!this.$store.state.effect.source)
        return false

      return this.card ? this.card.key == (this.$store.state.effect.source.key) : false
    },
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
      if (this.card.selectable) {
        if(this.onselect)
          this.onselect.call(this,this.card)
        else
          this.$store.dispatch('ACT_SELECTED_CARD', this.card)
      } else {
        // console.log('card no choice')
        throw 'comCard selectcard call error!'
      }
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

.comCard-title {
  padding: 1px;
  font-size: 15px;
  font-weight: bold;
}

.comCard-text {
  padding: 1px;
  font-size: 12px;
  font-weight: normal;
}

.comCard-text-faceoff {
  padding: 1px;
  font-weight: bold;
  font-size: 15px;
  text-align: center;
}

.comCard-el {
  /*background-color: lightgrey;*/
  width: 120px;
  height: 150px;
  margin: 5px;
  /*border: none 2px #000000;*/
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  /*padding: 1px;*/
}

.normal {
  background-color: lightgrey;
  border: solid 2px lightgrey;
}

.selectable {
  background-color: lightgrey;
  border: solid 2px red;
}

.effectactive {
  background-color: yellow;
  border: solid 2px red;
}

.mu-card-tip {
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
