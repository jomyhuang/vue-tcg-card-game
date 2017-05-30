<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <!-- <router-link to="/cardapp">CardAPP Link</router-link> -->
    <!-- <router-link to="/gameapp">GameApp Link</router-link> -->
    <h2><a href="/cardapp#/cardapp">CardAPP Link</a></h2>
    <h2><a href="/gameapp#/gameapp">GameApp Link</a></h2>

    <!-- <div id="demo">
      <button @click="show = !show">
        Toggle
      </button>
      {{show}}
      <transition name="bounceRight">
        <p v-if="show">hello</p>
      </transition>
    </div> -->
    <!-- <comCard></comCard> -->

    <mu-avatar slot="left" :size="30" src="../assets/logo.png"/>

    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>

    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
    <img src="../assets/logo.png">
    <div class="">
  <mu-sub-header>阳光</mu-sub-header>
  <mu-content-block>
    散落在指尖的阳光，我试着轻轻抓住光影的踪迹，它却在眉宇间投下一片淡淡的阴影。调皮的阳光掀动了四月的心帘，温暖如约的歌声渐起。似乎在诉说着，我也可以在漆黑的角落里，找到阴影背后的阳光，找到阳光与阴影奏出和谐的旋律。我要用一颗敏感赤诚的心迎接每一缕滑过指尖的阳光！
  </mu-content-block>
</div>

  </div>
</template>

<script>
import comCard from './comCard.vue'

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      show: true,
    }
  },
  components: {
    comCard
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
