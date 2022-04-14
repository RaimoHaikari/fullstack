const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

/*
 * Actionien vaikutus sovelluksen tilaan määritellään reducerin avulla. 
 * Käytännössä reducer on funktio, joka saa parametrikseen staten nykyisen tilan 
 * sekä actionin ja palauttaa staten uuden tilan
 * 
 */
const counterReducer = (state = initialState, action) => {

  let newState;
  
  switch (action.type) {
    case 'GOOD':

     newState = {
        ...state,
        good: state.good + 1
      }

      return newState;

    case 'OK':

      newState = {
        ...state,
        ok: state.ok + 1
      }

      return newState;

    case 'BAD':

      newState = {
        ...state,
        bad: state.bad + 1
      }

      return newState;
    case 'ZERO':
      return initialState;

    default: return state
  }
  
}

export default counterReducer