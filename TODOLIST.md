
TODO MEMO:
TODO, FIXME, CHANGED, XXX, IDEA, HACK, NOTE, REVIEW, NB and BUG


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


OK、卡牌选择战斗支援后，已经移出要手牌

OK、隐藏包装ASYNC_ACT_SELECT_CARD_START
PLAY_CARD
OPP_PLAY_CARD
EFFECT_CHOICE
EFFECT_OPP_CHOICE

OK、effect修改buff state (strict: true)
commit CARD_ADD_BUFF


NOTE、使用 v-tooltip
https://github.com/Akryum/v-tooltip
使用sass dynamic css class 有问题
定义在标准 allstyle.css


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

new format:
isAttacker: $cx.engage($cx.buff(500), $cx.buff(500, 'special power!')),

isAttacker: $cx.pipe(
    $cx.engage($cx.buff(500), $cx.buff(500, 'special power!')),
    $cx.engage('do engage 2','do engage 2-1',$cx.run('EFFECT_CHOICE', 'hand'), $cx.message('END PIPE')),
),

isAttacker: $cx.engage(
                $cx.buff(500), $cx.buff(500, 'special power!'),
                $cx.engage($cx.tap('sub effect 2-1'), $cx.tap('sub effect 2-1'))
            )



make:
pipliest (1 action) = [ [[acts11,acts12...]] ]
pipelist (compose) = [ [acts11,acts12], [act21,act22,act23...] ]

engage(is.supporter).choice('opp_zone', not(card.faceup)).draw(1)
engage(is.supporter).opp_choice('zone', not(card.faceup)).draw(1)
engage(is.faceup).discard('opp_hand',1)
phase(is.win).draw(1)


think:
make Effect + UI component
=> context => component with

//
dispatch('EFFECT_SOURCE', state.battle.defenser.main)
await dispatch('TIGGER_EFFECT', 'isDefenser')

// 科里化 -> promise all list -> compose

ef (parm1..)(context)
ef_discard (1, toBase)(context: source, target)

source:
  card -> owner player
selector? ( fn -> selector(who, scope, num of pick, filter) ):
  who ->
  scope ->
  filter ->
  list -> scope.filter
  selector -> HMI: effect_choice, opp_effect_choice /  FN: pickup(by filter), random
  num ->
  zero? ->

-> target:
  target card/card list (targets) -> owner player

process:
  targets.map(action) -> dispatch/commit
  targets.reducer(action) -> dispatch/commit

// card list modifier { (deck, hand, zone, base, graveyard) }
// card value modifier -> attack(basic, power) + sum of buff
// player/card tag modifier (add, remove)
// --> tigger effect animate

source? and(has(tag),has(effect))
target? => ( source?selector(filter)(from) )
  => card? => owner player?

context.targets.map(action) ->  chain squ action
compose(seq)(target?)


// Reflect -> function -> desc/message
selector: fn1 / is.fn1
fn1.name -> get function name
selector.name -> get function name
is.fn1 only sense fn1, but is1 don't

how? getMessage(selector) -> return message


//------- buff
#if/fn buff


//--------------------------- new effect system
#1 card.box/map(slot):
=> player.cardpool card all list
  => card.slot = 'deck/hand....'
  => deck is getter / filter by card.box is "box"

=> effectlist in cardflow
=> tiggermap: tag factory

#2 tag -> event tigger system
=> add tag -> add tigger (from: tag)
=> remove tag -> remove tigger (from: tag)

// => ADD_TAG／OPPADD_TAG => 直接增加Tigger
//    REMOVE_TAG => 移除Tigger
// idea => ADD_TAG？ => 放进 Tigger ／ 可直接 dispatch／remove

?? tag object -> 记录状态、tigger？
?? card.play vs tigger list 分离记录，难以同步


#3 play card  / ACTIVE_CARD
play card 阶段 -> 主动效果（main...)
mutil.activecard()

=> $playcard => 增加主动效果 => 从哪里启动？ => UI click

#3-1 smart tag:
=> $diff => 增加牌堆变化效果启动
mutil.moveslot()
auto add/remove smart tag // at[slot]: atBase...


#4 event tigger ->
from: tag / active(play)
tigger: name of tigger
type: once/EOT/end-of-game
条件：
when: 启动前检查
slot: [...] / 卡在哪里启动

先单点触发 -》 Loop 触发（连续）

##使用第三方event system？


#5
emit 'tag/tigger name' + card
  -> mutil.tiggerEffect() -> dispatch("TIGGER_EFFECT", tag string/payload
  1、tiggerEffect(tag, card) 参数模式转换成为 dispatch -> payload

emit 'tag' ( -> list -> ... )
  -> tiggerEffect().then() 效果启动后，触动 emitnext loop
  -> await $cx.$emitnext(['at1', 'at2', 'at3', 'atGraveyard'])


#清除阶段
CLEAR_TAG

clear tigger -> clear card/player tag?
? maybe 有tag但是没有tigger
* 将tigger内埋入清除函数（没有func也添加）
由list端启动清除，统一


##逻辑条件：
Tag 模式
isAttacker / isAttackerWhen:
...$cx.when()
...$cx.iif()


##GUI message
type:
async: 异步信息 promise resolve() when close (auto timeout/click)
await async: 同步信息／等候auto信息关闭后继续
mu.istestmode: overwrite/disable blocking, only output console.log
config.message
fullmessage
mu.isUMI

style:
console.log
message
notify

message box (ok/cancel)
modal dialog (custom)

comMessage/comEffect
comEffectChoice


from:
GameVue gameloop() : use dispatch / or internal function (仅供gameapp)
store dispatch -> dispatch : use dispatch
effect mixin function / cx$ chain function
cx$ function (internal) / cx.GUImode is on
mutil call?

use:

游戏阶段
动作前信息
agent talk 动作信息
=》大UI =》click/auto close
=》HMI input （／=》 触发主动效果）
进入效果
=》卡牌点亮 =》效果信息 =》 交互Buff、Choice =》效果结束
=》效果结束: 触发slot diff相关tag => 进入效果
战斗结算
回合结束
游戏结束


stage:

message text:
auto content? lazy content?


$cx.message
return $mainapp.gameloop_message(this.text)

$cx.phaseinfo
return $mainapp.gameloop_phaseinfo(this.text)

UI_message
run_message

showstage()


#HOC 顶层组件
通过props $attrs 向下传递
: game state
: UI selector click/slient

?需要构建gameboard component
use slot 技术



#idea Cycle.js / rxjs

view( state( gameboard( ...actions( ...cards( card() ) ) ) ) )

stream? --- use strem way process effect  
xstream
most




4、更精炼的效果函数动作DSL表示方式：
？check 使用marco 语言
? CojureScript


// TODO LIST
==、HMI是否分离到 HMI agent - UI choice
==、处理select没有可选择状况的处理
OK、支援增加的buff是在主战、还是支援精灵本身
OK、check 对手回合发动卡牌的效果的处理、检查
OK、效果自带的message展示系统
OK、增加effect context，用于测试、记录、信息
OK、effect pipe 中断，logic check
OK、play card -> zone, play 所在位置place location UI信息(slot)
==、从comZone, comHand -> Slient -> comCards (显示风格改变／不能被选择状态)
==、card component type 在不同UI模式下，同一张卡，指定可以被 selectable？（非全局）

==、处理多个Targets
有效果，才第一个显示效果信息
没有卡选择状况处理
如何获取function名称？ -> 显示判断信息
do tasks by reducer
OK、效果发动时候，点亮场面卡牌
tag = (tigger object)?
buff clear EOT、EOG


7、HERO/英雄系统
8、
Effect FUNCTION -> Agent HMI -> GAMEVUE UI
                -> STORE -----> COM -> GAMEVUE UI
                ** -> UI component -> Message/interactive



0、Stage1.0目标
完成美化UI布局
基础规则 playable
完成效果交互（EFFECT_CHOICE）：
= 增加BUFF UI效果
= 抽一张牌
= 弃一张手牌到XX牌推
= 从XX牌堆回手一张牌
= 附加Tag，不能使用支援卡

-------------------------------------------------------

Effect tag:

faceup
isAttacker
isDefenser
isSupporter
main
// isWin
// isLose
