import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import CardApp from '@/components/CardApp'
import GameApp from '@/components/GameApp'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/gameapp',
      name: 'GameApp',
      component: GameApp
    },
    {
      path: '/cardapp',
      name: 'CardApp',
      component: CardApp
    }
  ]
})
