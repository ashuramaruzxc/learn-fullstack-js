let url = `http://students.a-level.com.ua:10012`;
//let url = `http://localhost:3000`;
let isBlockButton = false;
const nickName = document.querySelector(`#nickName`);
const msg = document.querySelector(`#msg`);


function createStore(reducer) {
    let callbacks = []
    let state = reducer(undefined, {});

    function dispatch(action) {
        if (typeof action === 'function') {

            return action(dispatch)
        }

        const newState = reducer(state, action)
        if (newState !== state) {
            state = newState
            for (const cb of callbacks) cb()
        }
    }

    return {
        dispatch,
        subscribe(callback) {
            callbacks.push(callback)
            return () => callbacks = callbacks.filter(c => c !== callback)
        },
        getState() {
            return state;
        }
    }
}

//REDUCERs
const promiseReducer = (state = {},
                        {type, status, payload, error, name}) => {
    if (type === 'PROMISE') return {...state, [name]: {status, payload, error}}
    return state
}

const countMassageReducer = (state = {count: 0},
                             {type, count}) => {
    if (type === 'ADD') {
        return {...state, count: state.count + count || 0}
    }
    if (type === 'DEL')
        return {...state, count: (state.count - count >= 0 ? state.count - count : 0)}
    return state
}

function combineReducers(reducers) {

    function runReducers(state = {}, action) {
        let newState = {};
        for (let key in reducers) {

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

const actionPending = name => ({type: 'PROMISE', status: 'PENDING', name})
const actionResolved = (name, payload) => ({type: 'PROMISE', status: 'RESOLVED', payload, name})
const actionRejected = (name, error) => ({type: 'PROMISE', status: 'REJECTED', error, name})


const actionPromise = (name = 'default', p = delay(2000)) =>
    async dispatch => {
        dispatch(actionPending(name))
        try {
            let payload = await p
            dispatch(actionResolved(name, payload))
            return payload
        } catch (error) {
            dispatch(actionRejected(name, error))
        }
    }


// create store
let store = createStore(combineReducers({promise: promiseReducer, counter: countMassageReducer}))


//SUBSCRIBE
store.subscribe(() => {
    let promiseResult = getPromiseResult(`getMessage`);
    if (!promiseResult) return;
    printMassage(promiseResult)
//    console.log(store.getState());
});

store.subscribe(() => {
    let newMassagesAmount = store.getState().counter.count;
    newMessageInfo.querySelector(`span`).innerText = newMassagesAmount;
});


//END SUBSCRIBE


//ACTION creators
const sendMassageAction = async (nickName, msg, dispatch = store.dispatch) => dispatch(actionPromise(
    `addMessage`,
    await jsonPost(url, {func: 'addMessage', nick: nickName.value, message: msg.value})
));

const getMassageAction = async (dispatch = store.dispatch) => dispatch(actionPromise(
    `getMessage`,
    await jsonPost(url, {func: "getMessages", messageId: getNextMassageId(`getMessage`)})));

const getMassageAndAddCountAction = () => store.dispatch(
    async (dispatch) => {
        await getMassageAction(dispatch);
        let newMassage = getPromiseResult().data.filter(nikNameFilter).length;
        if (newMassage !== 0 && getPromiseResult().data.length !== getPromiseResult().nextMessageId ) {
            addCountAction(getPromiseResult().data.filter(nikNameFilter).length)
        }
    }
)


const sendAndCheck = async (nickName, msg) => store.dispatch(
    async dispatch => {
        await sendMassageAction(nickName, msg, dispatch);
        getMassageAndAddCountAction(dispatch);
    })

const addCountAction = (addMassage) => store.dispatch({type: `ADD`, count: addMassage});

const delCountAction = (delMassage = 1) => store.dispatch({type: `DEL`, count: delMassage});

const loop = async () => {
    await store.dispatch(await actionPromise())
    await getMassageAndAddCountAction()
    loop();
}


//END Action creators


//get massage id by name
function getNextMassageId(name) {
    if (getPromiseResult(name))
        return getPromiseResult(name).nextMessageId || 0
}


//get promise resolve result by name or undefined
const getPromiseResult = (name = `getMessage`) => {
    let promiseResult;
    if (store.getState() && store.getState().promise)
        promiseResult = store.getState().promise[name];
    if (promiseResult && promiseResult.status === "RESOLVED") {
        return promiseResult.payload
    }
}


//add Event on send button
sendBut.addEventListener('click',
    async () => {
        switchButtonBlockAndBlockButton()
        await sendAndCheck(nickName, msg).then(() => {
            msg.value = ''
        })
        switchButtonBlockAndBlockButton()
    });

//==============================================================================================================================
//gm.addEventListener('click', () => getMassageAndAddCountAction());
//gm2.addEventListener('click', () => delCountAction());

async function jsonPost(url, data) {

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data)
    })
        .then(response => response.json())
}


function switchButtonBlockAndBlockButton(value) {
    isBlockButton = !isBlockButton
    document.getElementById(`sendBut`).disabled = isBlockButton;
    return value
}


function nikNameFilter({nick}) {
    return nick !== nickName.value;
}


function deleteNewMessageMarkEvent(){
    this.classList.toggle(`newMessage`);
    delCountAction();
    this.removeEventListener(`mouseover`, deleteNewMessageMarkEvent)
}


function printMassage(msgObj) {

    if (!msgObj.data)
        return
    if (out.children.length === msgObj.nextMessageId)
        return;

    let isFirstQuery = msgObj.nextMessageId === msgObj.data.length;

    for (let i of msgObj.data) {
        let li = document.createElement('li');
        li.innerHTML = `<span class="nickName">${i.nick}:</span>
                               <span class="timeId">[${new Date(i.timestamp).toLocaleString()}]</span><br>
                               <span class="msgOut">${i.message}</span>`

        // add class new message, and add event
        if ( !isFirstQuery && nickName.value !== i.nick ) {
             li.classList.toggle(`newMessage`);
             li.addEventListener(`mouseover`, deleteNewMessageMarkEvent)
        }
        out.prepend(li);
    }
}


function delay(t) {
    return new Promise(function (resolve) {
        console.log(`tick`);
        setTimeout(resolve, t);
    });
}


//get massage about start chat
getMassageAndAddCountAction();
//endless loop to update messages
loop();
