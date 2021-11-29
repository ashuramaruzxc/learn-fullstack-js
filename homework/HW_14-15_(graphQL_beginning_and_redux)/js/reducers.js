//REDUCERS====================================================================================================
const promiseReducer = (state={},
                        {type, status, payload, error, name}) =>
    (type === 'PROMISE' ? {...state, [name]: {status, payload, error}} :
        (type === 'LOGOUT' ? {} : state))




const cartReducer =  (state = {}, {type, id, amount = 1, name = ``, price = 0}) => {

    if (type === 'ADD')
        return {...state, [id]: {   amount: +amount + (state[id] && state[id].amount || 0),
                                    name : name || state[id].name,
                                    price : price || state[id].price}}

    if (type === `DEL` && state[id])
        return objValueFilter({...state, [id]: 0}, 0);

    if (type === `DEL_ALL` ) return {};

    if (type === `DEC` && state[id].amount > 1) {
        return {...state, [id] : {   ...state[id], amount : state[id].amount -1}}
    }


    return state;
}


const authorized = (state = {}, action) => {

/*
    if (state === undefined){
        return {}
    }
*/

    if (action.type === 'LOGIN'){

        localStorage.authToken = action.jwt;
        //jwt_decode //взять среднюю часть токена, натравить на неё atob, а потом JSON.parse

        return {authToken: action.jwt, payload: jwt_decode(action.jwt)}
    }

    if (action.type === 'LOGOUT'){
        console.log('ЛОГАУТ')
        localStorage.removeItem(`authToken`);
        //вернуть пустой объект
        return {}
    }
    return state
}

//END REDUCERS====================================================================================================

function combineReducers(reducers){

    function runReducers(state={}, action){

        let newState = {};
        for (let key in reducers){
            let reducer = reducers[key]
            let newSubState = reducer(state[key], action)
            if (newSubState !== state[key])
                newState[key] = newSubState
        }

        if (Object.keys(newState).length === 0) return state

        return {...state, ...newState}
    }


    return runReducers
}

//validation entered user data
function objValueFilter(obj, value){
    let newObj = {};
    for(let key in obj){
        if (obj[key] !== value) newObj[key] = obj[key]
    }
    return newObj;
}