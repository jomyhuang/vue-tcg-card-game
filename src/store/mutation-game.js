import Vue from 'vue'
import cardDB from '@/components/SDWCardDB.json'
import deck1 from '@/components/deckplayer1.js'


import _ from 'lodash'
import R from 'ramda'
import mutil from '@/mutil'

import firstAgent from '@/components/agent-first'

export default {
  // ------------------------------------------------ context quick function
  STORE_SET(state, payload) {

    // meta store set
    const settingState = (value, key) => {
      if (R.has(key)(state)) {
        state[key] = value
        console.log(`META STORE_SET ${key} ${state[key]} to ${value}`)
      } else {
        console.warn(`STORE_SET no key ${key}`)
      }
    }
    R.forEachObjIndexed(settingState, payload)
  },
  TEST_SET(state, payload) {
    state.test = R.merge(state.test)(payload)
    console.log('TEST_SET payload', payload)

    console.log('TEST_SET add test card to deck', payload)
    const fpadd2deck = (value, key) => {
      const card = value
      const owner = card.owner
      owner.deck.push(card)
    }
    R.forEachObjIndexed(fpadd2deck, state.test)
  },
  HMI_SET(state, payload) {
    state.HMI = R.merge(payload)(state.HMI)
    console.log(`commit HMI_SET`, payload)
  },
  TURN_SET(state, payload) {
    state.turn = R.merge(payload)(state.turn)
    console.log(`commit TURN_SET`, payload)
  },
  EFFECT_SET(state, payload) {
    state.effect = R.merge(payload)(state.effect)
    console.log(`commit EFFECT_SET`, payload)
  },
  // ---------------------------------------------------- GAME_XXX
  GAME_RESET(state, payload) {
    mutil.resetGameState(state)
    console.log('commit GAME_RESET')
  },
  GAME_INIT(state, {
    decklist = null,
    shuffle = true,
    agent = null,
  } = {}) {

    state.storemsg = 'GAME INIT'

    if (agent) {
      console.log('GAME_INIT set agent from payload')

      state.player1.agent = agent[0]
      state.player2.agent = agent[1]
    } else {
      console.log('GAME_INIT set agent - firstAgent')

      state.player1.agent = firstAgent
      state.player2.agent = firstAgent
    }

    let list = []
    if (decklist) {
      list = [
        [state.player1, decklist[0]],
        [state.player2, decklist[1]]
      ]
      console.log('GAME_INIT setting deck from payload', decklist)
    } else {
      list = [
        [state.player1, deck1],
        [state.player2, deck1]
      ]
      console.log('GAME_INIT setting default/init deck');
    }

    state.players = []
    list.forEach(([player, deckfile]) => {

      // joining game
      state.players.push(player)

      // console.log(pack)
      // const (player,deckfile) = pack...
      // let player = pack[0]
      // let deckfile = pack[1]
      // console.log( 'init deck ', player.id )
      player.cardPool = []
      player.deck = []
      deckfile.forEach((cardid) => {
        // move to mutil
        // let card = cardDB[cardid]
        let gamecard = mutil.makecard(cardid, player)
        if (gamecard) {
          // clone /or make gamecard object
          // simple clone
          // const gamecard = Object.assign({}, card)
          // // new prop for game card object
          // Vue.set(gamecard, 'facedown', false)
          // Vue.set(gamecard, 'selected', false)
          // Vue.set(gamecard, 'selectable', false)
          // Vue.set(gamecard, 'play', {})
          // gamecard.power1 = mutil.convertPower(gamecard.power1)
          // gamecard.power2 = mutil.convertPower(gamecard.power2)
          // end prop
          player.cardPool.push(gamecard)
          player.deck.push(gamecard)
        } else {
          // throw init error
          console.warn(`GAME_INIT: warning ${cardid} not found`)
        }
      })

      // underscore.js move to lodash.js
      if (shuffle) {
        player.deck = _.shuffle(player.deck)
        console.log('GAME_INIT deck shuffle');
      } else {
        console.log('GAME_INIT no shuffle')
      }

      // console.log(`cardPool lenth ${player.cardPool.length}`, player.cardPool)
      // console.log(`deck lenth ${player.deck.length}`, player.deck)
    })

    // console.log('commit INIT_GAME end')
  },
  GAME_SET(state, payload) {

    // ramda.js 可以assign sub-key
    // state = R.merge(state)(payload) 不行！
    state.game = R.merge(state.game)(payload)

    console.log('GAME_SET payload', payload)
  },
  GAME_SET_PLAYERDECK(state, {
    player = null,
    deck = null,
  } = {}) {
    // TODO: GAME_SET_PLAYERDECK & joining game

    console.log('GAME_SET_PLAYERDECK ', player, deck)
  },
  GAME_SET_AGENT(state, {
    player = null,
    agent = null,
  } = {}) {
    if (R.isNil(player))
      return

    player.agent = agent

    if (R.isNil) {
      console.log(`GAME_SET_AGENT ${player.name} to HUI`)
    } else {
      console.log(`GAME_SET_AGENT ${player.name} to ${agent.name}`)
    }
  },
  GAME_SET_FIRSTPLAYER(state, player) {
    if (_.isUndefined(player)) {
      console.log('GAME_SET_FIRSTPLAYER no player assign')
      throw 'GAME_SET_FIRSTPLAYER no player assign'
      return
    }

    state.firstPlayer = player
    console.log(`commit set GAME_SET_FIRSTPLAYER ${state.firstPlayer.id}`)
  },
  GAME_SET_CURRENTPLAYER(state, player) {
    if (_.isUndefined(player)) {
      console.log('GAME_SET_CURRENTPLAYER no player assign')
      throw 'GAME_SET_CURRENTPLAYER no player assign'
      return
    }

    if (_.isNull(state.firstPlayer)) {
      state.firstPlayer = state.player
    }

    if (player === state.player1) {
      state.currentPlayer = player
      state.opponentPlayer = state.player2
    } else if (player === state.player2) {
      state.currentPlayer = player
      state.opponentPlayer = state.player1
    } else {
      state.currentPlayer = player
      state.opponentPlayer = null
      console.log('WARING: GAME_SET_CURRENTPLAYER no opponentPlayer')
    }

    console.log(`commit set GAME_SET_CURRENTPLAYER CURR ${state.currentPlayer.id}`)
    console.log(`commit set GAME_SET_CURRENTPLAYER OPP ${state.opponentPlayer.id}`)
  },
  GAME_NEXT_PLAYER(state) {
    if (_.isNull(state.currentPlayer)) {
      console.log('GAME_NEXT_PLAYER error currentPlayer is null')
      throw 'GAME_NEXT_PLAYER error currentPlayer is null'
      return
    }

    let swap = state.currentPlayer
    state.currentPlayer = state.opponentPlayer
    state.opponentPlayer = swap

    console.log(`commit set GAME_NEXT_PLAYER CURR ${state.currentPlayer.id}`)
    console.log(`commit set GAME_NEXT_PLAYER OPP ${state.opponentPlayer.id}`)
  },
  GAME_PHASE(state, payload) {
    const phase = payload
    state.game.phase = phase

    console.log(`commit GAME_PHASE ${phase}`)
  },
  // ---------------------------------------------------- SELECT CHAIN
  SELECT_PLAYER(state, player) {
    state.placeplayer = player
    console.log(`commit SELECT_PLAYER ${state.placeplayer.id}`)
  },
  SELECT_CARD(state, card = null) {
    let save = state.placeholder
    state.placeholder = card
    state.pickindex = -1
    if (state.placeholder) {
      console.log(`commit SELECT_CARD ${state.placeholder.name}`)
    } else {
      console.warn('commit SELECT_CARD null')
    }
  },
  // SELECT_CARD_SAVE(state, savecard = state.placeholder) {
  //   state.placeholdersave = savecard
  //   if (state.placeholdersave) {
  //     console.log(`commit SELECT_CARD_SAVE ${state.placeholdersave.name}`)
  //   } else {
  //     console.warn('commit SELECT_CARD_SAVE null')
  //   }
  // },
  // SELECT_CARD_RESTORE(state) {
  //   let card = state.placeholdersave
  //   state.placeholdersave = undefined
  //   state.placeholder = card
  //   state.pickindex = -1
  //   if (state.placeholder) {
  //     console.log(`commit SELECT_CARD_RESTORE ${state.placeholder.name}`)
  //   } else {
  //     console.warn('commit SELECT_CARD_RESTORE null')
  //   }
  // },
  SELECT_LIST(state, payload) {
    let list = payload
    if (R.isNil(list)) {
      console.warn('SELECT_CARDLIST is undefined')
      state.placelist = undefined
      return
    }

    mutil.assert(state.placeplayer.id === state.currentPlayer.id, 'commit SELECT_LIST placeplayer not equal currentPlayer')

    if (state.placeholder) {
      if (state.placeholder.owner != state.currentPlayer) {
        console.warn('在发动玩家owner select list 效果')
      }
    }

    // console.log('SELECT_LIST this=',this);
    // if (R.is(String, list)) {
    //   const opt = R.split('_',list)
    //   if(opt.length>1 && opt[0]==='opp') {
    //     // 处理选择对手的牌库
    //     let oppplayer = mutil.opponent(state.placeplayer)
    //
    //     if(state.placeholder) {
    //       if(state.placeholder.owner != state.currentPlayer) {
    //         console.warn('在发动玩家owner select list 效果')
    //         // // throw '在对方回合发动选择效果'
    //         // oppplayer = state.currentPlayer
    //       }
    //     }
    //     // TODO FIX: 调整玩家“相对对象”的改变，不能直接使用 currentPlayer, opponentPlayer
    //     // let oppplayer = mstate.opponentPlayer
    //     // if(state.placeholder) {
    //     //   if(state.placeholder.owner != state.currentPlayer) {
    //     //     console.warn('在对方回合发动玩家owner选择效果')
    //     //     // throw '在对方回合发动选择效果'
    //     //     oppplayer = state.currentPlayer
    //     //   }
    //     // }
    //
    //     list = oppplayer[opt[1]]
    //     console.log('commit SELECT_LIST opponent select',list)
    //   }
    //   else if (_.isFunction(list)){
    //     console.log(`commit SELECT_LIST function select call`)
    //     list = list.call(state)
    //     console.log(`commit SELECT_LIST function select`,list)
    //   }
    //   else {
    //     list = state.placeplayer[list]
    //     console.log(`commit SELECT_LIST placeplayer ${state.placeplayer.id} select`,list)
    //   }
    // }
    // state.placelist = list

    state.placelist = mutil.selectcards(list)

    if (state.placelist.length > 0)
      console.log(`commit SELECT_LIST len ${state.placelist.length}`)
    else {
      console.log('commit SELECT_LIST is 0')
    }
  },
  SELECT_FILTER(state, func) {
    state.placelist = R.filter(func, state.placelist)
    console.log(`commit SELECT_FILTER len ${state.placelist.length}`, func)
  },
  SELECT_MAP(state, func) {
    state.placelist = R.map(func, state.placelist)
    console.log(`commit SELECT_MAP ${state.placelist.length}`, func)
  },
  // ---------------------------------------------------- ACT_SELECTION
  _ACT_SELECTION_INIT(state, payload = {}) {

    state.act_selection = R.merge({
      list: () => state.placelist,
      many: 1,
      selectedList: [],
      finish: false,
      type: 'ACT_SELECTION',
      card: undefined,
      agent: undefined,
      selector: undefined,
    })(payload)

    if (!R.has('player', state.act_selection)) {
      console.error('ACT_SELECTION must assign player')
      throw 'ACT_SELECTION must assign player'
      return false
    }

    // if (_.startsWith(state.act_selection.list, 'opp_')) {
    //   throw 'ASYNC_ACT_SELECT_CARD_START do not support opp_xxx string list'
    //   return false
    // }

    const player = state.act_selection.player

    if (!state.act_selection.agent) {
      state.act_selection = R.assoc('agent', player.agent)(state.act_selection)
    }

    // 处理变更placeplayer
    state.placeplayer = player

    // 处理变更placelist
    // let list = state.act_selection.list
    // if (R.is(String, list)) {
    //   if (R.equals(list, 'placelist')) {
    //     console.log(`_ACT_SELECTION_INIT list string use placelist`)
    //     list = state.placelist
    //   } else {
    //     console.log(`_ACT_SELECTION_INIT list string use ${list}`)
    //     list = state.placeplayer[list]
    //   }
    //   console.log(`_ACT_SELECTION_INIT list string select`, list)
    // } else if (_.isFunction(list)) {
    //   console.log(`_ACT_SELECTION_INIT list function select call`)
    //   list = list.call(state)
    //   console.log(`_ACT_SELECTION_INIT list function select`, list)
    // }

    // 保留 selector
    if (R.is(String, state.act_selection.list)) {
      state.act_selection.selector = state.act_selection.list
    }
    // 处理变更placelist
    let list = mutil.selectcards(state.act_selection.list)
    state.placelist = list
    state.act_selection.list = list
    // placelist end

    state.placelist.forEach((card) => {
      card.selected = false
      card.selectable = true
    })
  },
  ACT_SET_SELECTED(state) {
    if (!state.placeholder) {
      console.error('commit ACT_SET_SELECTED ERROR no placeholder card')
      return
    }
    // if (state.placeholder !== card) {
    //   console.error('commit ACT_SET_SELECTED ERROR card != placeholder card')
    //   return
    // }

    let flag = !state.placeholder.selected
    state.placeholder.selected = flag

    mutil.call(R.prop('selectedMuation',state.act_selection), this, state, state.placeholder)
    // if (state.act_selection.selectedMuation) {
    //   // 处理muation callback
    //   // console.log( `commit ACT_SET_SELECTED selectedMuation call` )
    //   state.act_selection.selectedMuation(state, state.placeholder)
    // }

    // 处理更新selected list
    state.act_selection.selectedList = state.act_selection.list.filter((card) => card.selected)

    state.act_selection.card = flag ? state.placeholder : undefined
  },
  // ACT_UNSELECTION_ALL(state) {
  //   state.placelist.forEach((card) => {
  //     card.selectable = false
  //   })
  //   // console.log('commit ACT_UNSELECTION')
  // },
  _ACT_FINISH(state, payload) {
    state.placelist.forEach((card) => {
      card.selectable = false
    })
    state.act_selection.finish = true
    console.log('commit ACT_FINISH')
  },
  // ---------------------------------------------------- CARD
  PICK_CARD(state, card) {
    if (R.isNil(card)) {
      console.log(`PICK_CARD is undefined, select placeholder`)
      card = state.placeholder
    }
    if (card) {
      const owner = card.owner
      // console.log('card owner',owner.id)
      const pilelist = [
        ['hand', owner.hand],
        ['zone', owner.zone],
        ['base', owner.base],
        ['graveyard', owner.graveyard],
        ['supporter', owner.supporter],
      ]
      // const pilelist = [
      //   ['hand', state.placeplayer.hand],
      //   ['zone', state.placeplayer.zone],
      //   ['base', state.placeplayer.base],
      //   ['graveyard', state.placeplayer.graveyard],
      // ]

      let found = false
      state.placeholder = null
      for (let i = 0; i < pilelist.length; i++) {
        let pack = pilelist[i]
        let pilename = pack[0]
        let pile = pack[1]
        // console.log(`find ${card.name} in ${pilename}`)
        let index = pile.indexOf(card)
        if (index > -1) {
          pile.splice(index, 1)
          state.placeholder = card
          state.pickindex = index
          found = true
          console.log(`commit PICK_CARD find ${card.name} from ${pilename} index ${index}`)
          break
        }
      }

      if (!found) {
        console.error(`commit PICK_CARD ERROR ${card.name} not found in all pile`)
        console.error(`commit PICK_CARD ERROR owner id ${card.owner.id} ${state.battle.attacker.support.name}`)
        throw `commit PICK_CARD ERROR ${card.name} not found in all pile`
      }
    } else {
      state.placeholder = null
      console.error('commit PICK_CARD placeholder/card null')
    }
  },
  DRAW(state) {
    if (state.placeplayer.deck.length > 0) {
      state.placeholder = state.placeplayer.deck.pop()
      // console.log( `commit DRAW ${state.placeholder.name}` )
    } else {
      state.placeholder = null
      console.warn(`commit DRAW no card to draw`)
    }
  },
  SET_FACEDOWN(state) {
    if (!state.placeholder) {
      console.log('commit SET_FACEDOWN ERROR no placeholder card')
      return
    }
    state.placeholder.facedown = true
  },
  SET_FACEUP(state) {
    if (!state.placeholder) {
      console.log('commit SET_FACEUP ERROR no placeholder card')
      return
    }
    if (state.placeholder.facedown) {
      state.placeholder.facedown = false
      // setting face up
      state.placeholder.play.faceup = true
      console.log('SET_FACEUP face up tagging');
    }
  },
  TO_HAND(state) {
    if (!state.placeholder) {
      console.log('commit TO_HAND ERROR no placeholder card')
      return
    }
    const owner = state.placeholder.owner
    owner.hand.push(state.placeholder)
    // state.placeplayer.hand.push(state.placeholder)
    state.placeholder = null
  },
  TO_ZONE(state, index) {
    if (!state.placeholder) {
      console.log('commit TO_ZONE ERROR no placeholder card')
      return
    }
    const owner = state.placeholder.owner
    if (!_.isUndefined(index)) {
      owner.zone.splice(index, 0, state.placeholder)
      // state.placeplayer.zone.splice(index, 0, state.placeholder)
      console.log(`commit TO_ZONE replace index ${index} ${owner.id} ${state.placeholder.name}`)
    } else {
      owner.zone.push(state.placeholder)
      // state.placeplayer.zone.push(state.placeholder)
      console.log(`commit TO_ZONE ${owner.id} ${state.placeholder.name}`)
    }
    state.placeholder = null
  },
  TO_BASE(state) {
    if (!state.placeholder) {
      console.log('commit TO_BASE ERROR no placeholder card')
      return
    }
    const owner = state.placeholder.owner
    owner.base.push(state.placeholder)
    // state.placeplayer.base.push(state.placeholder)
    console.log(`commit TO_BASE ${owner.id} ${state.placeholder.name}`)
    state.placeholder = null
  },
  TO_GRAVEYARD(state) {
    if (!state.placeholder) {
      console.log('commit TO_GRAVEYARD ERROR no placeholder card')
      return
    }
    const owner = state.placeholder.owner
    owner.graveyard.push(state.placeholder)
    // state.placeplayer.graveyard.push(state.placeholder)
    console.log(`commit TO_GRAVEYARD ${owner.id} ${state.placeholder.name}`)
    state.placeholder = null
  },
  TO_SUPPORTER(state) {
    if (!state.placeholder) {
      console.log('commit TO_SUPPORTER ERROR no placeholder card')
      return
    }
    const owner = state.placeholder.owner
    owner.supporter.push(state.placeholder)
    // state.placeplayer.graveyard.push(state.placeholder)
    console.log(`commit TO_SUPPORTER ${owner.id} ${state.placeholder.name}`)
    state.placeholder = null
  },
  ADD_BUFF(state, payload) {
    if (!state.placeholder) {
      console.log('commit ADD_BUFF ERROR no placeholder card')
      return
    }
    const card = state.placeholder
    const buff = payload
    card.power.push(buff)
    console.log(`commit ADD_BUFF ${state.placeholder.name}`,buff)
  },
  ADD_TAG(state, payload) {
    if (!state.placeholder) {
      console.log('commit ADD_TAG ERROR no placeholder card')
      return
    }
    const card = state.placeholder
    const tag = payload
    if (R.is(String,tag)) {
      card.play = R.assoc(tag,true)(card.play)
    }
    else {
      card.play = R.merge(tag,card.play)
    }
    console.log(`commit ADD_TAG ${state.placeholder.name}`,card.play)
  },
  REMOVE_TAG(state, payload) {
    if (!state.placeholder) {
      console.log('commit REMOVE_TAG ERROR no placeholder card')
      return
    }
    const card = state.placeholder
    const tag = payload
    if (R.is(String,tag)) {
      card.play = R.dissoc(tag)(card.play)
    }
    else {
      console.error('REMOVE_TAG payload must is string')
    }
    console.log(`commit REMOVE_TAG ${state.placeholder.name}`,card.play)
  },
  CLEAR_TAG(state, payload) {
    if (!state.placeholder) {
      console.log('commit CLEAR_TAG ERROR no placeholder card')
      return
    }
    const card = state.placeholder
    const tag = payload
    card.play = null
    card.play = {}
    console.log(`commit CLEAR_TAG ${state.placeholder.name}`)
  },
}
