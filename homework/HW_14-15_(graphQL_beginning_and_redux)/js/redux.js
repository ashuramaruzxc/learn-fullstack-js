class CreateStore{
    constructor(reducer){
        this.callbacks = []
        this.state = reducer(undefined, {});

        this.dispatch = function(action){
            if (typeof action === 'function'){
                return action(this.dispatch)
            }

            const newState = reducer(this.state, action)
            if (newState !== this.state){
                this.state = newState
                for (const cb of this.callbacks) cb()
            }
        }.bind(this)
    }

        dispatch;

        subscribe(callback){
            this.callbacks.push(callback)
            return () => this.callbacks = this.callbacks.filter(c => c !== callback)
        }

        getState(){
            return this.state;
        }

}



//==============================================================================

let store = new CreateStore(combineReducers({
    promise: promiseReducer,
    cart: cartReducer,
    authorization: authorized}))

let out = document.getElementById(`output`);
//===========================================================================



let getGQL = url =>
    async (query, variables={}) => fetch(url, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                ...(localStorage.authToken && localStorage.authToken !== `undefined` ?
                    {Authorization: 'Bearer ' + localStorage.authToken} : {})
            },
            body: JSON.stringify({query, variables})
        }).then(res => res.json())
            .then(result => {
                if ('errors' in result) throw new Error(JSON.stringify(result.errors))
                return Object.values(result.data)[0]
            })




let gql = getGQL('http://shop-roles.asmer.fs.a-level.com.ua/graphql')
let rootURL ='http://shop-roles.asmer.fs.a-level.com.ua/'


//run callback function before added login and password in of form
function loginForm(el, buttonId = ``, onOk){
    let button = el.querySelector(buttonId);
    button.onclick = async () => {
        let login = el.querySelector(`#loginInForm`).value;
        let password = el.querySelector(`#passwordInForm`).value;
        onOk(login, password);
    }
}


const getPromiseResult = (name) => {
    let promiseResult;
    if(store.getState() && store.getState().promise)
        promiseResult = store.getState().promise[name];
    if (promiseResult && promiseResult.status === "RESOLVED") {
        return promiseResult.payload
    }
}


function jwt_decode(token) {
    if(!token || token === `undefined` || token === `null`) {
        return ``};
    let i =  atob(token.match(/(?<=[.]).+(?=[.])/));
    return JSON.parse(i);
}


function cartGoodsToOrderGoodsArr() {
    let goods = [];
    Array.prototype.map.call(tbodyProduct.querySelectorAll(`tr.good`), value => {
        goods.push({count : +value.querySelector(`span.amount-product`).innerText,
                    good: {_id : value.firstElementChild.id}})
    })
    return goods;
}


const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms))
//sub function============================================================================

//FirstStart

localStorage.authToken && store.dispatch(actionAuthLoginGetOrder(localStorage.authToken));

store.dispatch(actionCategories());

let formInput = document.querySelector(`#inputForm`)

loginForm(formInput, `#loginButton`, (l,p) => store.dispatch(actionFullLoginOrders(l,p)))
loginForm(formInput, `#signUp`, (l,p) => store.dispatch(actionFullRegister(l,p)))

logoutButton.onclick = ()=>{
    store.dispatch(actionAuthLogout());
}

//store.dispatch(actionOrderFiend())


//на базе этого кода:
//все дз подразумевают отладку запроса GraphQL в GraphIQL, после чего используя функцию выше вы сможете использовать данные в JS.
//- напиши запрос.
//- получи данные справа
//- скопируй в JS, напиши код который эти данные отображает/использует.
//- используй функцию getGQL
//Последние пару пунктов можно менять местами.

//1) добавьте по клику на категорию вывод товаров/подкатегорий из этой категории. используйте запрос  по _id категории
//2) покажите информацию о товаре при клике на его карточку. По аналогии, используйте _id товара в запросе GraphQL
//3) сделайте форму логина/регистрации
//3.1) она должна принимать callback, который будет запускаться когда юзер нажмет OK
//3.2) Данный callback должен запускать store.dispatch(actionLogin), который делает запрос на подобие actionCategories
//3.3) в колбэк/экшон должно передаваться два параметра login и password
//
//4) authReducer:
//auth(state, action){ //....
//if (state === undefined){
////добавить в action token из localStorage, и проимитировать LOGIN (action.type = 'LOGIN')
//return {}
//}
//if (action.type === 'LOGIN'){
//console.log('ЛОГИН')
////+localStorage
////jwt_decode //взять среднюю часть токена, натравить на неё atob, а потом JSON.parse
////            return {token: action.jwt, payload: jwt_decode(action.jwt)}
//}
//if (action.type === 'LOGOUT'){
//console.log('ЛОГАУТ')
////-localStorage
////вернуть пустой объект
//return {}
//}
//return state
//},
//4.1) допилить до рабочего вида редьюсер
//4.2) написать два actionCreator - actionAuthLogin(token) и actionAuthLogout()
//5) написать общий actionCreator actionFullLogin, который thunk, и который
//вначале диспатчит actionLogin, awaitит его результат и выколупывает оттуда токен
//после чего диспатчит actionAuthLogin(token)
//6)//отображение имени логина/кнопки разлогина где-то в углу (как принято)
//7) сделать actionRegister, по аналогии с actionLogin
//8) сделать actionFullRegister, по аналогии с actionFullLogin, должен:
//8.1) диспатчит actionRegister
//8.2) диспатчит actionFullLogin
//9) прикрутите форму логина к регистрации (т. е. в тот же колбэк засуньте store.dispatch(actionFullRegister(login, password))
//10) сделать корзину
//11) оформление
//12) трудоустроиться (по фулстаку/фронтенду/не в макдак)






