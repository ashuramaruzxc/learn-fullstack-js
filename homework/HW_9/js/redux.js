//redux
function createStore(reducer) {
    let callbacks = [];
    let state = reducer(undefined, {});

    return {
        dispatch(action) {
            const newState = reducer(state, action);
            if (newState !== state) {
                state = newState;
                for (const cb of callbacks) cb();
            }
        },
        subscribe(callback) {
            callbacks.push(callback);
            return () => callbacks = callbacks.filter(c => c !== callback);
        },
        getState() {
            return state;
        }
    }
}


//cartReducer
const cartReducer =  (state = {}, {type, id, amount = 1}) => {

    if (type === 'ADD' && validationOfAdd(id, amount))
        return {...state, [id]: amount + (state[id] || 0)}
    if (type === `DEL` && state[id])
        return objValueFilter({...state, [id]: 0}, 0);
    if (type === `DEC` && state[id] > 1)
       return {...state, [id] : state[id] - 1}
    return state;
}


//actionCreators
const actionInc = id => ({type: 'ADD', id});
const actionAdd = (id, amount = 1) => ({type: 'ADD', id, amount});
const actionDec = id => ({type: 'DEC', id});
const actionDel = id => ({type: `DEL`, id});



//validation entered user data
function validationOfAdd(id, amount) {
    if(!Number.isInteger(amount))
        return false
    if(amount <= 0)
        return false
    if(id.match(/\s+/))
        return false
    return true
}

function objValueFilter(obj, value){

    let newObj = {};
    for(let key in obj){
        if (obj[key] !== value) newObj[key] = obj[key]
    }
    return newObj;
}


//initialization
let store = createStore(cartReducer);


//add event listener
add.onclick = () => store.dispatch(actionAdd(productName.value, +amount.value));
del.onclick = () => store.dispatch(actionDel(productName.value));

tbodyProduct.addEventListener('click', ({target}) =>{
    if(target.className === `delete-button`){
        store.dispatch(actionDel(target.parentElement.previousElementSibling.textContent))
    }
    if(target.className === `right-arrow`){
        store.dispatch(actionInc(target.parentElement.previousElementSibling.textContent))
    }
    if(target.className === `left-arrow`){
        store.dispatch(actionDec(target.parentElement.previousElementSibling.textContent))
    }
})

//subscribe
let unsubscribe = store.subscribe(() => console.log(store.getState()));

let unsubscribeAmountInCart = store.subscribe(() => amountCartProduct.innerText = Object.entries(store.getState()).length)

/*let unsubscribeCartTable = store.subscribe(() => {tbodyProduct.innerHTML = `${Object.entries(store.getState())
    .map(([id, count]) => addRow(id, count)).join('\n')}`})*/

let unsubscribeCartTable = store.subscribe(() => {tbodyProduct.innerHTML = `${Object.entries(store.getState())
    .map(addRow).join('\n')}`})


//row tags in string
function addRow(currentValue) {

    [id, count] = currentValue;
    return `    <tr>
      <td>${id}</td>
      <td class="amount-td"><span class="left-arrow"></span>
        <span class="amount-product">${count}</span>
        <span class="right-arrow"></span>
        <span class="delete-button">delete</span></td>
    </tr>`
}


//form cleaner
function clearInputText(e) {
    productName.value = '';
    amount.value = ``;
}
add.addEventListener('click', clearInputText);
del.addEventListener('click', clearInputText);