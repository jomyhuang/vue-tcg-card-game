import Vue from 'vue'
import R from 'ramda'
import _ from 'lodash'

// Vue plugin 模式全局

export default {
  install(Vue, options) {
    Vue.prototype.muvue = function () {
      console.log('我是插件中的方法')
    }
  }
}
