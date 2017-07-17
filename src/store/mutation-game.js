import Vue from 'vue'
import cardDB from '@/components/SDWCardDB.json'
import deck1 from '@/components/deckplayer1.js'


import _ from 'lodash'
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

    console.log('TEST_SET add test card to deck', payload)
    const fnadd2deck = (value, key) => {
      const card = value
      const owner = card.owner
      owner.deck.push(card)
    }
    R.forEachObjIndexed(fnadd2deck, state.test)
  },
  EFFECT_SET(state, payload) {

    if (R.isEmpty(payload)) {
      state.effect = null
      state.effect = {}
    } else {
      state.effect = R.merge(state.effect)(payload)
    }

    console.log('commit EFFECT_SET payload', payload)
  },
  STORE_MESSAGE(state, payload) {
    state.storemsg = payload
  },
  // ---------------------------------------------------- GAME_XXX
  // GAME_TESTMODE(state,payload=true) {
  //   state.testmode = payload
  //   console.log('commit GAME_TESTMODE ', payload)
  // },
  GAME_RESET(state, payload) {
    mutil.resetGameState(state)
    console.log('commit GAME_RESET')
  },
  GAME_SET(state, payload) {

    // ramda.js 可以assign sub-key
    // state = R.merge(state)(payload) 不行！
    state.game = R.merge(state.game)(payload)

    console.log('GAME_SET payload', payload)
  },
  GAME_SET_CONFIG(state, payload) {

    state.game.config = R.merge(state.game.config)(payload)

    console.log('GAME_SET_CONFIG payload', payload)
  },
  GAME_READY(state, {
    decklist = null,
    shuffle = true,
    agent = null,
  } = {}) {

    state.storemsg = 'GAME_READY'

    if (agent) {
      console.log('GAME_READY set agent from payload')

      state.player1.agent = agent[0]
      state.player2.agent = agent[1]
    } else {
      console.log('GAME_READY set agent - firstAgent')

      state.player1.agent = firstAgent
      state.player2.agent = firstAgent
    }

    let list = []
    if (decklist) {
      list = [
        [state.player1, decklist[0]],
        [state.player2, decklist[1]]
      ]
      console.log('GAME_READY setting deck from payload', decklist)
    } else {
      list = [
        [state.player1, deck1],
        [state.player2, deck1]
      ]
      console.log('GAME_READY setting default/init deck');
    }

    state.players = []
    list.forEach(([player, deckfile]) => {

      // joining game
      state.players.push(player)

      player.cardPool = []
      player.deck = []
      deckfile.forEach((cardid) => {
        // move to mutil / new card factory
        let gamecard = mutil.makecard(cardid, player)
        if (gamecard) {
          player.cardPool.push(gamecard)
          player.deck.push(gamecard)
          gamecard = mutil.moveslot('deck',gamecard)
          // gamecard.slot = 'deck'
        } else {
          // throw init error
          console.error(`GAME_READY: warning ${cardid} not found`)
          throw new Error(`GAME_READY: warning ${cardid} not found`)
        }
      })

      // underscore.js move to lodash.js
      if (shuffle) {
        player.deck = _.shuffle(player.deck)
        console.log('GAME_READY deck shuffle');
      } else {
        console.log('GAME_READY no shuffle')
      }
    })
  },
  GAME_PHASE(state, payload) {
    const phase = payload
    state.game.phase = phase

    console.log(`commit GAME_PHASE ${phase}`)
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
    if(state.placeplayer)
      console.log(`commit SELECT_PLAYER ${state.placeplayer.id}`)
    else
      console.log('SELECT_PLAYER is null')
  },
  SELECT_CARD(state, card) {
    state.placeholder = card
    state.pickindex = -1
    if (state.placeholder) {
      console.log(`commit SELECT_CARD ${state.placeholder.name}`)
    } else {
      console.warn('commit SELECT_CARD null')
    }
  },
  SELECT_LIST(state, payload) {
    let list = payload
    if (R.isNil(list)) {
      console.warn('SELECT_CARDLIST is undefined')
      state.placelist = undefined
      return
    }

    // mutil.assert(state.placeplayer.id === state.currentPlayer.id, 'commit SELECT_LIST placeplayer not equal currentPlayer')
    //
    // if (state.placeholder) {
    //   if (state.placeholder.owner != state.currentPlayer) {
    //     console.warn('在发动玩家owner select list 效果')
    //   }
    // }

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
      list: undefined,
      from: undefined,
      selector: () => state.placelist,
      filter: () => true,

      many: 1,
      agent: undefined,
      player: null,
      finish: false,
      type: 'ACT_SELECTION',
      phase: null,
      source: null,
      message: null,

      selectedList: [],
      card: undefined,
      // choiceUI Vue Component 不能放入state中
      choiceUI: false,
      onselect: null,
      onmark: (card) => {
        card.selected = false
        card.selectable = true
      },
      onunmark: (card) => {
        card.selectable = false
      },
      selectedMuation: null,
      // oncommit: null,
    })(payload)

    if (R.isNil('player', state.act_selection)) {
      console.error('ACT_SELECTION must assign player')
      throw 'ACT_SELECTION must assign player'
      return false
    }

    // if (R.is(String, state.act_selection.list)) {
    if(state.act_selection.list) {
      // state.act_selection.selector = state.act_selection.list
      // state.act_selection.list = null
      throw '_ACT_SELECTION_INIT state.act_selection.list must null'
      return
    }
    // 保留from／selector
    payload.from = payload.selector

    const player = state.act_selection.player
    // 处理变更placeplayer
    state.placeplayer = player

    const pile = R.is(String, state.act_selection.selector) ?  state.act_selection.selector : undefined
    const isopp = player.id === state.currentPlayer.id ? '' : '对手'
    const iseffect = state.act_selection.source ? '效果:' : '对战:'
    // TODO: 如何判读是对手选择

    if(!state.act_selection.agent) {
      state.act_selection = R.assoc('agent', player.agent)(state.act_selection)
    }
    if(!state.act_selection.message && pile) {
      state.act_selection = R.assoc('message', iseffect + ':' + isopp + player.id + '从【' + pile + '】选择')(state.act_selection)
      // console.log('_ACT_SELECTION_INIT message', state.act_selection.message )
    }

    // 处理selector => filter => list => placelist
    let list = mutil.selectcards(state.act_selection.selector)
    list = R.filter(state.act_selection.filter, list)
    state.act_selection.list = list
    state.placelist = list
    // placelist end

    state.placelist.forEach(state.act_selection.onmark)
  },
  ACT_SET_SELECTED(state) {
    if (!state.placeholder) {
      console.error('commit ACT_SET_SELECTED ERROR no placeholder card')
      return
    }

    let flag = !state.placeholder.selected
    state.placeholder.selected = flag

    mutil.call(R.prop('selectedMuation', state.act_selection), this, state, state.placeholder)

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
    state.placelist.forEach(state.act_selection.onunmark)
    // state.placelist.forEach((card) => {
    //   card.selectable = false
    // })
    state.act_selection.finish = true
    console.log('commit ACT_FINISH')
  },
  // ---------------------------------------------------- CARD
  ACTIVE_CARD(state, card) {
    if (R.isNil(card)) {
      throw new Error('ACTIVE_CARD error! card is null')
    }
    if(card.active) {
      console.warn('commit ACTIVE_CARD card already active',card)
      // throw new Error('error! card is activing')
      return
    }

    card.active = true
    state.activelist.push(card)
    mutil.activecard(card)

    console.log(`commit ACTIVE_CARD ${card.cardno} is active`)
  },
  PICK_CARD(state, card) {
    if (R.isNil(card)) {
      console.log(`PICK_CARD is undefined, select placeholder`)
      card = state.placeholder
    }
    if (card) {
      const owner = card.owner
      const pilelist = [
        ['hand', owner.hand],
        ['zone', owner.zone],
        ['base', owner.base],
        ['graveyard', owner.graveyard],
        ['supporter', owner.supporter],
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
          state.placeholder = mutil.moveslot(undefined,state.placeholder)
          // state.placeholder.slot = undefined
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
      // state.placeholder.slot = undefined
      state.placeholder = mutil.moveslot(undefined,state.placeholder)
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
      console.log('SET_FACEUP face up');
    }
  },
  TO_HAND(state) {
    if (!state.placeholder) {
      console.log('commit TO_HAND ERROR no placeholder card')
      return
    }
    const owner = state.placeholder.owner
    owner.hand.push(state.placeholder)
    // state.placeholder.slot = 'hand'
    state.placeholder = mutil.moveslot('hand',state.placeholder)
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
      console.log(`commit TO_ZONE replace index ${index} ${owner.id} ${state.placeholder.name}`)
    } else {
      owner.zone.push(state.placeholder)
      console.log(`commit TO_ZONE ${owner.id} ${state.placeholder.name}`)
    }
    // state.placeholder.slot = 'zone'
    state.placeholder = mutil.moveslot('zone',state.placeholder)
    state.placeholder = null
  },
  TO_BASE(state) {
    if (!state.placeholder) {
      console.log('commit TO_BASE ERROR no placeholder card')
      return
    }
    const owner = state.placeholder.owner
    owner.base.push(state.placeholder)
    // state.placeholder.slot = 'base'
    state.placeholder = mutil.moveslot('base',state.placeholder)
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
    // state.placeholder.slot = 'graveyard'
    state.placeholder = mutil.moveslot('graveyard',state.placeholder)
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
    state.placeholder.slot = 'supporter'
    state.placeholder = mutil.moveslot('supporter',state.placeholder)
    console.log(`commit TO_SUPPORTER ${owner.id} ${state.placeholder.name}`)
    state.placeholder = null
  },
  TO_EXSUPPORT(state) {
    if (!state.placeholder) {
      console.log('commit TO_EXSUPPORT ERROR no placeholder card')
      return
    }
    const card = state.placeholder
    const owner = state.placeholder.owner
    let place

    if(state.battle.attacker.player.id === owner.id) {
      place = 'attacker'
    } else if(state.battle.defenser.player.id === owner.id) {
      place = 'defenser'
    } else {
      throw new Error('TO_EXSUPPORT error no place')
      return
    }
    state.battle[place].exsupport.push(card)
    // push to supporter list
    owner.supporter.push(card)
    // state.placeholder.slot = 'supporter'
    state.placeholder = mutil.moveslot('supporter',state.placeholder)

    console.log(`TO_EXSUPPORT add ex-support ${place}`, card)
    // console.dir(state.battle)
    state.placeholder = null
  },
  ADD_BUFF(state, payload) {
    if (!state.placeholder) {
      console.log('commit ADD_BUFF ERROR no placeholder card')
      return
    }
    const card = state.placeholder
    const buff = payload
    card.buffs.push(buff)
    console.log(`commit ADD_BUFF ${state.placeholder.name}`, buff)
  },
  ADD_TAG(state, payload) {
    if (!state.placeholder) {
      console.log('commit ADD_TAG ERROR no placeholder card')
      return
    }
    const card = state.placeholder
    const tag = payload
    mutil.addTag(tag,card)

    console.log(`commit ADD_TAG ${state.placeholder.name}`, card.play)
  },
  REMOVE_TAG(state, payload) {
    if (!state.placeholder) {
      console.log('commit REMOVE_TAG ERROR no placeholder card')
      return
    }
    const card = state.placeholder
    const tag = payload
    // if (R.is(String, tag)) {
    //   card.play = R.dissoc(tag)(card.play)
    // } else {
    //   console.error('REMOVE_TAG payload must is string')
    // }
    mutil.removeTag(tag,card)
    console.log(`commit REMOVE_TAG ${state.placeholder.name}`, card.play)
  },
  CLEAR_TAG(state, payload) {
    if(!payload) {
      console.log('commit CLEAR_TAG card is null')
      return
    }
    const card = payload
    card.buffs = []
    // EFFECTNEW clear tag with tigger
    // card.play = {}
    // TODO: KEEP SOME TAG OVER TURN
    const keep = []
    R.forEachObjIndexed( (v,k) => {
      if( !keep.includes(k) )
        mutil.removeTag(k,card)
    })(card.play)

    console.log(`commit CLEAR_TAG & tigger ${card.name}`)
  },
}
