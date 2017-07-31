# VueTCG

一个用 ES6 + Vue.js + Vuex + Element-UI TCG卡牌游戏的练习

很久没有写代码了，过程中重新学习基于ES6现代化Javascript技术，原本对于只是为了好奇学习Ract+Redux的Flux流设计思维。但后来进一步接触到了Vue.js 后，脑洞大开后，就开始将设计的TCG卡牌规则写成的这个练习。过程中，遇到很多问题，更进一步学习基于Promise 的异步编程、函数式编程的思考、范式与通过Ramda 库的练习。

## 通过练习，完成了

* 基于Vuex 的TCG卡牌数据流、状态管理（套牌启动、回合、战斗计算等）
* 通过Vuex 完成基础的卡牌动作（牌区、发牌、抽卡、弃牌等）
* 简易的单文件组件，组织交互的UI
* 通过函数组合，卡牌效果DSL定义与效果触发

## 后续

* 完善函数式范式，描述卡牌效果，与追加更多效果触发
* 更进一步完善卡牌效果与UI交互
* 卡牌效果的单元测试范式
* 通过网络的PvP
* HCI/AI Agent
* Reinforcement Learning AI environment


## 关注进一步技术

* 应用响应式编程、函数式编程到卡牌引擎
* Reactive Functional Programming
* RxJS / Cycle.js


## 关于《赛尔号：精灵战争》 SEER DIMENSION WARS

官方规则[参考链接](http://m.news.4399.com/seer/youxixinwen/201512-15-583403.html)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev
