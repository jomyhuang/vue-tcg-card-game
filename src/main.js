// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import Vuex from 'vuex'


import App from './App'
import store from '@/store'
import router from '@/router'

import '../theme/reset.css'
// import './allstyle.css'
// fix in style/base.scss

// 自定义全局插件
import muvue from '@/muvue'
Vue.use(muvue)

// Vue.use(Vuex)

// use ElementUI
import '../theme/index.css'
import ElementUI from 'element-ui'
Vue.use(ElementUI)

// use iView
// import iView from 'iview'
// import 'iview/dist/styles/iview.css'
// iview-theme build -o dist/
// import '../my-theme/dist/iview.css'
// Vue.use(iView)

// use MuseUI
// import MuseUI from 'muse-ui'
// import 'muse-ui/dist/muse-ui.css'
// import 'muse-ui/dist/theme-light.css'
// Vue.use(MuseUI)


// vue2-animate
// https://github.com/asika32764/vue2-animate
require('vue2-animate/dist/vue2-animate.min.css')


// Vue.directive('my-tooltip', VTooltip.VTooltip)
// Vue.use(VTooltip)
// must global define CSS in allstyle.css / index.html

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: store,
  router,
  template: '<App/>',
  components: {
    App
  }
})
