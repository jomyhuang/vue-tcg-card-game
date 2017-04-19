
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




Effect tag:

faceup
isAttacker
isDefenser
isSupporter
main
