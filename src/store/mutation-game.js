import Vue from 'vue'
import cardDB from '@/components/SDWCardDB.json'
import deck1 from '@/components/deckplayer1.js'


import _ from 'underscore'
import R from 'ramda'
import mutil from '@/mutil'

import firstAgent from '@/components/agent-first'

export default {
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
      console.log('GAME_INIT setting default deck');
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

      // underscore.js
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
  // ---------------------------------------------------- SELECT CHAIN
  SELECT_PLAYER(state, player) {
    state.placeplayer = player
    console.log(`commit SELECT_PLAYER ${state.placeplayer.id}`)
  },
  SELECT_CARD(state, card = null) {
    state.placeholder = card
    state.pickindex = -1
    if (state.placeholder) {
      // console.log( `commit SELECT_CARD ${state.placeholder.name}` )
    } else {
      console.warn('commit SELECT_CARD null')
    }
  },
  SELECT_CARDLIST(state, list = 'hand') {
    if (typeof (list) == "string") {
      state.placelist = eval(`state.placeplayer.${list}`)
    } else {
      state.placelist = list
    }

    if (state.placelist.length > 0)
      console.log(`commit SELECT_CARDLIST len ${state.placelist.length}`)
    else {
      console.log('commit SELECT_CARDLIST is 0')
    }
  },
  // ---------------------------------------------------- ACT_SELECTION
  // ACT_SELECTION_INIT(state, {
  //   list = 'hand',
  //   many = 1,
  //   selectedMuation = null,
  //   selectedAction = null,
  //   thenAction = null,
  //   agent = null,
  // } = {}) {
  ACT_SELECTION_INIT(state, payload) {

    state.act_selection = R.merge({})(payload)
    // 清除后增加
    // state.act_selection.selectedList = []
    // state.act_selection.finish = false

    // const defaults = R.flip(R.merge)
    state.act_selection = mutil.Rdefaults(state.act_selection, {
      many: 1,
      selectedList: [],
      finish: false,
      player: state.currentPlayer,
      type: 'ACT_SELECTION',
    })

    // if (!R.has('player', state.act_selection)) {
    //   state.act_selection = R.assoc('player', state.currentPlayer)(state.act_selection)
    //   console.log('ACT_SELECTION default player')
    // }
    if (!R.has('agent', state.act_selection)) {
      state.act_selection = R.assoc('agent', state.act_selection.player.agent)(state.act_selection)
      // console.log('ACT_SELECTION default agent')
    }

    // 修改成解构式
    // state.act_selection.list = list
    // state.act_selection.many = many
    // state.act_selection.selectedMuation = selectedMuation
    // state.act_selection.selectedAction = selectedAction
    // state.act_selection.thenAction = thenAction
    // state.act_selection.agent = agent

    // placelist 处理 copy from SELECT_CARDLIST
    const list = state.act_selection.list
    if (R.is(String, list)) {
      // state.placelist = eval(`state.placeplayer.${list}`)
      state.placelist = state.placeplayer[list]
    } else {
      state.placelist = list
    }
    state.placelist.forEach((card) => {
      card.selected = false
      card.selectable = true
    })
    // placelist end
  },
  ACT_SET_SELECTED(state, value) {
    if (!state.placeholder) {
      console.error('commit ACT_SET_SELECTED ERROR no placeholder card')
      return
    }
    let flag = false
    if (value == undefined)
      flag = !state.placeholder.selected
    else {
      flag = value
    }
    state.placeholder.selected = flag

    if (state.act_selection.selectedMuation) {
      // 处理muation callback
      // console.log( `commit ACT_SET_SELECTED selectedMuation call` )
      state.act_selection.selectedMuation(state, state.placeholder)
    }

    // 处理更新selected list
    state.act_selection.selectedList = state.placelist.filter((card) => {
      return card.selected
    })
    // console.log( `commit ACT_SET_SELECTED ${state.placeholder.name} is ${state.placeholder.selected}` )
  },
  ACT_UNSELECTION(state) {
    state.placelist.forEach((card) => {
      // card.selected = false
      card.selectable = false
    })
    // console.log('commit ACT_UNSELECTION')
  },
  ACT_FINISH(state, payload) {
    state.act_selection.finish = true
    console.log('commit ACT_FINISH')
  },
  // ---------------------------------------------------- CARD
  PICK_CARD(state, card = null) {
    if (card) {
      const pilelist = [
        ['hand', state.placeplayer.hand],
        ['zone', state.placeplayer.zone],
        ['base', state.placeplayer.base],
        ['graveyard', state.placeplayer.graveyard],
      ]

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
        state.placeholder = null
        console.log(`commit PICK_CARD ERROR ${card.name} not found in all pile`)
        throw `commit PICK_CARD ERROR ${card.name} not found in all pile`
      }
    } else {
      state.placeholder = null
      console.warn('commit PICK_CARD null must assign')
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
    state.placeplayer.hand.push(state.placeholder)
    state.placeholder = null
  },
  TO_ZONE(state, index) {
    if (!state.placeholder) {
      console.log('commit TO_ZONE ERROR no placeholder card')
      return
    }
    if (!_.isUndefined(index)) {
      state.placeplayer.zone.splice(index, 0, state.placeholder)
      console.log(`commit TO_ZONE replace index ${index} ${state.placeplayer.id} ${state.placeholder.name}`)
    } else {
      state.placeplayer.zone.push(state.placeholder)
      console.log(`commit TO_ZONE ${state.placeplayer.id} ${state.placeholder.name}`)
    }
    state.placeholder = null
  },
  TO_BASE(state) {
    if (!state.placeholder) {
      console.log('commit TO_BASE ERROR no placeholder card')
      return
    }
    state.placeplayer.base.push(state.placeholder)
    console.log(`commit TO_BASE ${state.placeplayer.id} ${state.placeholder.name}`)
    state.placeholder = null
  },
  TO_GRAVEYARD(state) {
    if (!state.placeholder) {
      console.log('commit TO_GRAVEYARD ERROR no placeholder card')
      return
    }
    state.placeplayer.graveyard.push(state.placeholder)
    console.log(`commit TO_GRAVEYARD ${state.placeplayer.id} ${state.placeholder.name}`)
    state.placeholder = null
  },
}
