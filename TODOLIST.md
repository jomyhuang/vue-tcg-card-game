
TODO MEMO:

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

OK、effect function

await dispatch('TIGGER_EFFECT') => return promise object
effect func 统一传回处理一个 pipe array
通过一个await for each处理

OK、优化select
更简单的select func 直接传回 => chain 处理
chain 处理，采用 Array => 使用一个函数
如何封装函数

()=>dispatch('xxx',payload)
建立lazy function
rxdispath, rxcommit
* 但不能使用 rxdispath.then(XXX)


OK、针对state.placelist 操作函数
SELECT_LIST
SELECT_FILTER
SELECT_MAP
action select
先通过函数选择卡牌 list
然后在进入交互 action select

OK、支援卡牌离开手牌区域
=> 增加support pipe


-------------------------------------------------------
TODO:

project: Cardxflow

1、Flux/FP way of TCG card flow
2、应用Flux实现data-UI-flow实作：使用Vuex／Vue.js
3、函数式编程 FP
4、DSL of TCG effect


6、goal for render-based UI game play H2H, H2A, A2A (Vue.js/H5 game first)
A、goal for TCG design testing helper
B、meta TCG game play engine

7、final goal AI/ML
A、agent-based ML environment
B、NLP for TCG gaming/effect self-programming



1、effect system

支援时，...
2、effect UI action
翻开时，对方弃一张手牌
支援时，选择对方的一张卡翻开，抽一张牌

3、更精炼的效果表示方式：

phase/condition in card effect function:
isAttacker: $cx.engage($cx.buff(500),$cx.buff(500,'special power!')),

isAttacker(effectpack,payload) {
  return $cx.pipe(
    $cx.run('SELECT_LIST', 'opp_zone'),
    $cx.run('SELECT_FILTER', x => x.star >= 3),
    $cx.run('EFFECT_CHOICE'),
    $cx.run('PICK_CARD'),
    $cx.run('TO_GRAVEYARD'),
  )
}

//

engage(is.supporter).choice('opp_zone', not(card.faceup)).draw(1)
engage(is.supporter).opp_choice('zone', not(card.faceup)).draw(1)
engage(is.faceup).discard('opp_hand',1)
phase(is.win).draw(1)




4、更精炼的效果函数动作表示方式：




6、LIST
卡牌选择战斗支援后，已经移出要手牌
==、HMI是否分离到 HMI agent - UI choice
==、处理select没有可选择状况的处理
==、支援增加的buff是在主战、还是支援精灵本身
==、check 对手回合发动卡牌的效果的处理、检查
==、效果自带的message展示系统
==、effect修改buff state (strict: true)
隐藏包装ASYNC_ACT_SELECT_CARD_START
==、回合结束，清除阶段，清除掉所有play效果标签

effect tagging
add
clear
check
if

==、effect pipe 中断，logic check
==、effect context


7、英雄系统




-------------------------------------------------------

Effect tag:

faceup
isAttacker
isDefenser
isSupporter
main
// isWin
// isLose
