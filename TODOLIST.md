
TODO:
OK、增加效果计算Buff OK
OK、修改合并攻击力架构 OK
[
  [ object of power ]
  [ { power: xxx, tag: 'basic power', card: Obj, effect: 'basic' } ]
  [ { power: xxx, tag: 'buff', card: Obj, effect: 'isAttacker' } ]
  [ { power: 0, tag: 'message', card: Obj  } ]
  // tag : display information
]

OK、简化effect functor buff
=> buff(card, 1000, effect)
// 已知 card/effect
=> buff(1000, tag)
// 写成箭头函数闭包在TIGGER_EFFECT action内

1、play effect phase
支援时，...
2、effect UI action
翻开时，对方弃一张手牌
支援时，选择对方的一张卡翻开，抽一张牌


OK、fix agent for TEST／默认的选择
let xLens = R.lensPath(['battle', 'defenser', 'support'])
let xSel = R.view(xLens)(state.test)

// return new Promise(async function (resolve, reject) {
  return dispatch('ASYNC_ACT_SELECT_CARD_START', {
    list: state.opponentPlayer.hand,
    player: state.opponentPlayer,
    // many: 1,
    phase: 'BATTLE_OPP_PLAY_SUPPORTER',
    // agent: state.opponentPlayer.agent,
    ==》 init: xSel,

4、effect function

await dispatch('TIGGER_EFFECT')
 => return promise object
 => return chain (array)

5、优化select
更简单的select func 直接传回 => chain 处理
chain 处理，采用 Array => 使用一个函数
如何封装函数

()=>dispatch('xxx',payload)


6、杂项
卡牌选择战斗支援后，已经移出要手牌




7、英雄系统








Effect tag:

faceup
isAttacker
isDefenser
isSupporter
main
