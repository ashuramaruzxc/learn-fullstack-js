//ACTIONS
//==============================================================================================
//PROMISE ACTIONS////////////////////////////////////////////////////////////////
const actionPending = name => ({type: 'PROMISE', status: 'PENDING', name})
const actionResolved = (name, payload) => ({type: 'PROMISE', status: 'RESOLVED', payload, name})
const actionRejected = (name, error) => ({type: 'PROMISE',status: 'REJECTED', error, name})

const actionPromise = (name='default', p=delay(2000)) =>
    async dispatch => {
        dispatch(actionPending(name))
        try {
            let payload = await p
            dispatch(actionResolved(name, payload))
            return payload
        }
        catch(error){
            dispatch(actionRejected(name, error))
        }
    }

//END PROMISE ACTIONS////////////////////////////////////////////////////////////////


//CART ACTIONS////////////////////////////////////////////////////////////////
const actionCartInc = id => ({type: 'ADD', id});
const actionCartAdd = (id, amount, name, price) => ({type: 'ADD', id, amount, name, price});
const actionCartDec = id => ({type: 'DEC', id});
const actionCartDel = id => ({type: `DEL`, id});
const ActionCartDelAll = id => ({type: `DEL_ALL`});
//END CART ACTIONS////////////////////////////////////////////////////////////////


//REGISTER AND LOGIN ACTIONS////////////////////////////////////////////////////////////////
const actionAuthLogin = (authToken) => ({type: `LOGIN`, jwt: authToken});

const actionAuthLoginGetOrder = (authToken)=>{
    return async dispatch =>{
        await dispatch(actionAuthLogin(authToken))
        await dispatch(actionOrderFiend())
    }

}


const actionAuthLogout = () => ({type: `LOGOUT`});

const actionFullLogin = (login, password)=>{
    return async dispatch =>{
        await dispatch(actionLogin(login, password))
        await dispatch(actionAuthLogin(getPromiseResult("login")))
    }

}

const actionFullLoginOrders = (login, password)=>{
    return async dispatch =>{
        await dispatch(actionFullLogin(login, password));
        await dispatch(actionOrderFiend());
    }
}

const actionLogin = (login, password) => {
    const promise = gql(`query login($login:String, $password:String){
                                      login (login: $login, password: $password)
                                    }`,{login, password})

    return actionPromise('login', promise)
}


const actionRegister = (login, password) => {
    const promise = gql(`mutation register($login:String, $password:String) {
                                     UserUpsert(user:{login:$login, password:$password}) {
    _id
    login
  }
                                    }`,{login, password})
    return actionPromise('register', promise)
}


const actionFullRegister = (login, password)=>{
    return async dispatch => {
        await dispatch(actionRegister(login,password));
        await dispatch(actionFullLogin(login,password));
    }

}
//REGISTER AND LOGIN ACTIONS ////////////////////////////////////////////////////////////////


//SHOP GRAPHQL ACTION////////////////////////////////////////////////////////////////
const actionCategories = () => {
    const promise = gql(`query ($query:String){
                                      CategoryFind(query:$query){
                                        _id 
                                        name
                                            subCategories {
                                              _id
                                              name
                                                  subCategories {
                                                     _id
                                                     name
                                                   }
                                             }
                                        }
                                    }`,{query: JSON.stringify([{}])}) //[{\"_id\" : \"5dc4b2553f23b553bf3540ff\"}]
    return actionPromise('categories', promise)
}

const actionGoods = (id) => {
    const promise = gql(`query ($query:String){
                                      CategoryFindOne(query: $query) {
                                            goods {
                                                _id
                                                name
                                                description
                                                price
                                                  images {
                                                    _id
                                                    url
                                                    originalFileName
                                                  }
                                            } 
                                       }
                                 }`,{query: JSON.stringify([{"_id":id}])})
    return actionPromise('goods', promise)
}


const actionOrderUpsert = (orderGoods ) => {

    const promise = gql(`mutation ($goods: [OrderGoodInput]){
                                  OrderUpsert(order: {
                                    orderGoods : $goods
                                  } ) {
                                    _id
                                    createdAt
                                    total
                                  } 
                                }`,JSON.stringify({goods : [...orderGoods]}))
    return actionPromise('upsertOrders', promise)
}

const actionFullOrderUpsert = (goodsArr = [])=>{
    return async dispatch => {
        await dispatch(actionOrderUpsert(goodsArr));
        await dispatch(actionOrderFiend());
        await dispatch(ActionCartDelAll())
    }

}


const actionOrderFiend = () => {
    const promise = gql(`query {
                                  OrderFind(query: "[{}]") {
                                        _id total orderGoods {
                                              _id price count total good{
                                                    name
                                              }
                                        }   
                                  }
                                }`,{query: JSON.stringify([{}])})
    return actionPromise('allOrders', promise)
}



//======================================================================================================================
//END ACTIONS
