import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import CardApp from '@/components/CardApp'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/cardapp',
      name: 'CardApp',
      component: CardApp
    }
  ]
})
