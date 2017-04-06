import Vue from 'vue'
// chai 是断言库
import {
  expect
} from 'chai'

// 错误： export default {} 不能用解雇式
// import { mutations } from '@/store/mutations'
// 错误：
// import { SET_USER } from '@/store/mutations'
// 正确：
import mutations from '@/store/mutations'
import store from '@/store'
import mutil from '@/mutil'


// 解构出函数
const {
  SET_USER,
  INIT_DB,
  GAME_INIT,
} = mutations

// console.log('开始测试');

describe('Store', () => {
  it.skip('SET_USER state test template', () => {
    const state = {
      user: ''
    }
    SET_USER(state, 'jomyhuang')
    expect(state.user).to.equal('jomyhuang')
  })

  it.skip('mutil.checkAnti', () => {
    expect(mutil.checkAnti('','A')).to.equal(false)
    expect(mutil.checkAnti('A','H')).to.equal(true)
    expect(mutil.checkAnti('H','T')).to.equal(true)
    expect(mutil.checkAnti('T','A')).to.equal(true)
  })

  it.skip('mutil.opponent', () => {
    const player1 = store.state.player1
    const player2 = store.state.player2
    const list = [player1,player2]

    expect(mutil.opponent(list,player1)).to.equal(player2)
    expect(mutil.opponent(list,player2)).to.equal(player1)
    expect(mutil.opponent(list,{})).to.equal(null)
  })
})
