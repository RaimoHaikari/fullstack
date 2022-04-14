import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('unicafe reducer', () => {

  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const state = {}
    const action = {
      type: 'DO_NOTHING'
    }

    /*
     * Huomaa, että valmiin ensimmäisen testin on syytä mennä läpi koska Redux olettaa, 
     * että reducer palauttaa järkevän alkutilan kun sitä kutsutaan siten että ensimmäinen 
     * parametri eli aiempaa tilaa edustava state on undefined.
     */

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {

    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })

  test('subsequent incrementing of OK, GOOD and BAD is registered properly', () => {

    const state = initialState

    deepFreeze(state)

    let newState = counterReducer(state, {type: 'BAD'})
    newState = counterReducer(newState, {type: 'OK'})
    newState = counterReducer(newState, {type: 'BAD'})
    newState = counterReducer(newState, {type: 'GOOD'})
    newState = counterReducer(newState, {type: 'BAD'})
    newState = counterReducer(newState, {type: 'BAD'})
    newState = counterReducer(newState, {type: 'GOOD'})

    expect(newState).toEqual({
      good: 2,
      ok: 1,
      bad: 4
    })
  })

  test('ZERO resets state', () => {

    const state = initialState

    deepFreeze(state)

    let newState = counterReducer(state, {type: 'BAD'})
    newState = counterReducer(newState, {type: 'OK'})
    newState = counterReducer(newState, {type: 'BAD'})
    newState = counterReducer(newState, {type: 'ZERO'})


    expect(newState).toEqual(initialState)
  })


})