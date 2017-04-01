import Vue from 'vue'
import storeDB from '@/components/SDWCardDB.json'
import deck1 from '@/components/player1.js'

import _ from 'underscore'
import R from 'ramda'

export default {
  TOGGLE_LOADING(state) {
    state.callingAPI = !state.callingAPI
  },
  TOGGLE_SEARCHING(state) {
    state.searching = (state.searching === '') ? 'loading' : ''
  },
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  TEST_STORE(state, payload) {
    state.storemsg = payload
  },
  INIT_DB(state) {
    state.cardDB = storeDB

    // deck init
    console.log('deck1', deck1, 'length', deck1.length)
    // 转换成数组便利处理
    // state.cardDB = JSON.parse(storeDB || '[]')
    state.pageFullList = []
    // exam = Object.keys(exam).map(function(k){return exam[k]});
    Object.keys(state.cardDB).forEach((k) => state.pageFullList.push(state.cardDB[k]))
    state.pageKeyList = state.pageFullList

    console.log('JSON to fulllist/keylist array', state.pageFullList)

    state.storemsg = 'INIT_DB loaded'
    console.log('commit INIT_DB')
  },
  // 结构双重默认值写法
  FETCH_REFRESH(state, {
    pagePerItems = 10,
    filter = 'all',
    filterfunc = {}
  } = {}) {
    state.pagePerItems = pagePerItems
    state.pageFilter = filter

    state.pageKeyList = []
    if (state.pageFilter == 'all') {
      // full list
      state.pageKeyList = state.pageFullList
    } else {
      // filter
      // state.pageKeyList = state.pageFullList.filter( (n) => n.cost == 2 )
      // filterfunc = (n) => n.cost > 2
      state.pageKeyList = state.pageFullList.filter(filterfunc)
      console.log('filter', state.pageFilter)
    }
    state.pageTotalPage = parseInt(state.pageKeyList.length / state.pagePerItems)
    state.pageTotalPage += state.pageKeyList.length % state.pagePerItems ? 1 : 0
    state.pageCurrent = 1
    state.pageList = []

    state.storemsg = 'FETCH_REFRESH'
    console.log('commit FETCH_REFRESH pageTotalPage', state.pageTotalPage)
    console.log('FETCH_REFRESH pagePerItems', state.pagePerItems, 'filter', state.pageFilter)
  },
  FETCH_PAGE(state, pageno = 1) {
    state.pageList = []
    pageno = Math.min(pageno, state.pageTotalPage)
    pageno = Math.max(pageno, 1)
    state.pageCurrent = pageno

    let start = (state.pageCurrent - 1) * state.pagePerItems
    let end = Math.min(start + state.pagePerItems - 1, state.pageKeyList.length - 1)
    for (; start <= end; start++) {
      // 使用 array, 不是 Object
      // state.pageList.push( state.cardDB[ state.pageKeys[ start+index ] ]  )
      // state.pageList.push( state.cardDB[ state.pageKeys[ start ] ]  )
      state.pageList.push(state.pageKeyList[start])
    }
    // state.pageNextDisabled = state.pageCurrent >= state.pageTotalPage ? true : false
    // state.pagePrevDisabled = state.pageCurrent <= 1 ? true : false
    console.log('commit FETCH_PAGE', state.pageList.length, 'filter', state.pageFilter)
  },
  FETCH_SCROLL_NEXT(state) {

    let start = state.pageList.length
    let end = Math.min(start + state.pagePerItems - 1, state.pageKeyList.length - 1)
    for (; start <= end; start++) {
      // 使用 array, 不是 Object
      // state.pageList.push( state.cardDB[ state.pageKeys[ start+index ] ]  )
      // state.pageList.push( state.cardDB[ state.pageKeys[ start ] ]  )
      state.pageList.push(state.pageKeyList[start])
    }
    console.log('commit FETCH_SCROLL_NEXT', state.pageList.length)
    if (end >= state.pageKeyList.length - 1)
      console.log('commit FETCH_SCROLL_NEXT end of list')
  },
  GAME_INIT(state) {
    state.cardDB = storeDB
    state.storemsg = 'GAME INIT'

    // make deck to card pool clone from cardDB
    // [ state.player1 ].( (player) => {
    // const list = [ (state.player1, deck1), (state.player2,deck1) ]
    // let test = [ 1, 2, 3 ].map( x => x * x )

    const list = [
      [state.player1, deck1],
      [state.player2, deck1]
    ]

    list.forEach(([player, deckfile]) => {
      // console.log(pack)
      // const (player,deckfile) = pack...
      // let player = pack[0]
      // let deckfile = pack[1]
      // console.log( 'init deck ', player.id )
      player.cardPool = []
      player.deck = []
      deckfile.forEach((cardid) => {
        let card = state.cardDB[cardid]
        if (card) {
          // clone /or make gamecard object
          // simple clone
          const gamecard = Object.assign({}, card)
          // new prop for game card object
          Vue.set(gamecard, 'facedown', false)
          Vue.set(gamecard, 'selected', false)
          Vue.set(gamecard, 'selectable', false)
          Vue.set(gamecard, 'play', {})

          // end prop
          player.cardPool.push(gamecard)
          player.deck.push(gamecard)
          // if( (gamecard === card) )
          //     console.log( 'same card' )
        } else {
          // throw init error
          console.warn(`GAME_INIT: warning ${cardid} not found`)
        }
      })

      // underscore.js
      player.deck = _.shuffle(player.deck)

      // console.log(`cardPool lenth ${player.cardPool.length}`, player.cardPool)
      // console.log(`deck lenth ${player.deck.length}`, player.deck)
    })

    // console.log('commit INIT_GAME end')
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
  SELECT_PLAYER(state, player) {
    state.placeplayer = player
    console.log(`commit SELECT_PLAYER ${state.placeplayer.id}`)
  },
  SELECT_CARD(state, card = null) {
    state.placeholder = card
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
  ACT_SELECTION(state, {
    list = 'hand',
    many = 1,
    selectedMuation = null,
    selectedAction = null,
    thenAction = null,
    agent = null,
  } = {}) {

    // 修改成解构式
    state.act_selection.list = list
    state.act_selection.many = many
    state.act_selection.selectedMuation = selectedMuation
    state.act_selection.selectedAction = selectedAction
    state.act_selection.thenAction = thenAction
    state.act_selection.selectedList = []
    state.act_selection.agent = agent

    // placelist 处理 copy from SELECT_CARDLIST
    if (_.isString(list)) {
      state.placelist = eval(`state.placeplayer.${list}`)
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
      console.log('commit PICK_CARD null must assign')
    }
  },
  DRAW(state) {
    if (state.placeplayer.deck.length > 0) {
      state.placeholder = state.placeplayer.deck.pop()
      // console.log( `commit DRAW ${state.placeholder.name}` )
    } else {
      state.placeholder = null
      console.log(`commit DRAW ERROR no card to draw`)
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
    state.placeholder.facedown = false
  },
  TO_HAND(state) {
    if (!state.placeholder) {
      console.log('commit TO_HAND ERROR no placeholder card')
      return
    }
    state.placeplayer.hand.push(state.placeholder)
    state.placeholder = null
  },
  TO_ZONE(state) {
    if (!state.placeholder) {
      console.log('commit TO_ZONE ERROR no placeholder card')
      return
    }
    state.placeplayer.zone.push(state.placeholder)
    state.placeholder = null
  },
  TO_BASE(state) {
    if (!state.placeholder) {
      console.log('commit TO_BASE ERROR no placeholder card')
      return
    }
    state.placeplayer.base.push(state.placeholder)
    state.placeholder = null
  },
  TO_GRAVEYARD(state) {
    if (!state.placeholder) {
      console.log('commit TO_GRAVEYARD ERROR no placeholder card')
      return
    }
    state.placeplayer.graveyard.push(state.placeholder)
    state.placeholder = null
  },
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
  // GAME
  GAME_SET(state, payload) {

    // ramda.js 可以assign sub-key
    // state = R.merge(state)(payload) 不行！
    state.game = R.merge(state.game)(payload)

    console.log('GAME_SET payload', payload)
  },
  // TURN
  TURN_SET(state, payload) {

    console.log('commit TURN_SET no impelement', state.turn)
  },
  // BATTLE
  BATTLE_INIT(state) {
    state.battle = {
      attacker: {
        player: null,
        main: null,
        support: null,
        hero: null,
      },
      defenser: {
        player: null,
        main: null,
        support: null,
        hero: null,
      },
    }

    state.battle.attacker.player = state.currentPlayer
    state.battle.defenser.player = state.opponentPlayer
    console.log('commit BATTLE_INIT')
  },
  BATTLE_SET(state, payload) {

    // const settingAttacker = (value,key) => {
    //   const data = state.battle.attacker
    //   if(R.has(key)(data)) {
    //     // console.log(`R attacker set ${key} ${value}`)
    //     data[key] = value
    //   }
    //   else {
    //     console.warn(`BATTLE_SET attacker no key ${key}`)
    //   }
    // }
    // const settingDefenser = (value,key) => {
    //   const data = state.battle.defenser
    //   if(R.has(key)(data)) {
    //     // console.log(`R attacker set ${key} ${value}`)
    //     data[key] = value
    //   }
    //   else {
    //     console.warn(`BATTLE_SET defenser no key ${key}`)
    //   }
    // }

    // 不行，因为无法clone state
    // state.battle = R.merge(state.battle)(payload)

    // if(R.has('attacker')(payload)) {
    //   // R.forEachObjIndexed(settingAttacker,payload.attacker)
    //   // R.forEachObjIndexed(settingAttacker)(payload.attacker)
    //
    state.battle.attacker = R.merge(state.battle.attacker)(payload.attacker)
    // }
    // if(R.has('defenser')(payload)) {
    //   R.forEachObjIndexed(settingDefenser)(payload.defenser)
    state.battle.defenser = R.merge(state.battle.defenser)(payload.defenser)
    // }

    state.battle.attacker.player = state.currentPlayer
    state.battle.defenser.player = state.opponentPlayer

    // console.log(payload)
    // console.log( 'commit BATTLE_SET', state.battle )

    // underscore.js
    // if( _.has(payload, 'attacker') ) {
    // underscore.js assignment
    // if( _.has( payload.attacker, 'player' ) )
    //   state.battle.attacker.player = payload.attacker.player
    // if( _.has( payload.attacker, 'main' ) )
    //   state.battle.attacker.main = payload.attacker.main
    // if( _.has( payload.attacker, 'support' ) )
    //   state.battle.attacker.support = payload.attacker.support
    // _.each(payload.attacker,(value,key,list) => {
    //   // console.log(value,key,list)
    //   if(_.has(state.battle.attacker,key))
    //     state.battle.attacker[key] = value
    //   else {
    //     console.warn(`BATTLE_SET attacker no key ${key}`)
    //   }
    // })
    // }

  },
  RAMDA_TEST(state, payload) {
    console.log('Ramda test commit', payload)
    let card = state.player1.deck[0]
    console.log(`test ${card.name} ${card.play} ${card.facedown}`)
    state.player1.deck[0].play.info = 'info1'
    state.player1.deck[0].play.tag = 'tag'
  }
}
