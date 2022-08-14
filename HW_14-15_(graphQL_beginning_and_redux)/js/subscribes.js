//SUBSCRIBE
//======================================================================================================================



store.subscribe(() => {

    let categories = store.getState().promise.categories;

    if (categories && categories.status === "RESOLVED") {
        draw(categories.payload,
            document.getElementById(`output-cats`),
            `category`)
    }
})

//goods draw
store.subscribe(() => {

    let goods = store.getState().promise.goods;
    if (goods && goods.status === "RESOLVED") {
        goodsDraw(goods.payload.goods,
            document.querySelector(`#output-goods ul`),
            `good`)
    }
})

//authorized login view
store.subscribe(() => {
    if (!localStorage.authToken && !store.getState() && !store.getState().authorization.authToken) {
        return
    }
    if (localStorage.authToken === store.getState().authorization.authToken) {
        let i = store.getState().authorization.payload ?
            store.getState().authorization.payload.sub.login
            : ``;
        welcomeDiv.innerHTML = `<span>Hello ${i}</span>`

    } else console.log("User is not register");
})

//view user menu
store.subscribe(()=>{

    let userMenu = document.querySelector(`section.registered`);

    if (store.getState() && store.getState().authorization.authToken) {
        inputForm.classList.add(`hidden`);
        userMenu.classList.remove(`hidden`)
        passwordInForm.value = ``;
    } else {

        inputForm.classList.remove(`hidden`);
        userMenu.classList.add(`hidden`)
    }

})


store.subscribe(() => console.log(store.getState()))

store.subscribe(() => amountCartProduct.innerText = Object.entries(store.getState().cart).length)

store.subscribe(() => {tbodyProduct.innerHTML = (()=>{
    let innerString = ``;
    let fullCost = 0;

    Object.entries(store.getState().cart).forEach(value => {
        innerString =  innerString + (addRow(value).concat('\n'))
        fullCost = fullCost + (value[1].price * value[1].amount);
    })

    return innerString + `<tr  class="fullCost">
                            <td colspan="3">
                            full cost: <span>${fullCost} грн</span>
                            <button id="sendOrder" 
                                    class="button" 
                                    onclick="store.dispatch( actionFullOrderUpsert(cartGoodsToOrderGoodsArr()))" >
                                  make an order
                            </button>
                            </td></tr>`
})()


})


store.subscribe(()=>{
    if(getPromiseResult(`allOrders`)){
        ordersProducts.innerHTML = ``
        ordersProducts.innerHTML = getPromiseResult(`allOrders`).map(value => drawOrders(value)).join(`\n`)
    }
})


//======================================================================================================================
//END SUBSCRIBE


//sub function============================================================================

function drawOrders({_id, total, orderGoods}) {
    let tds = orderGoods.map((value, index, array) => {
                        return  addOrderRow(value, index === array.length -1 && `lastOrder` )
                    }).join(`\n`)
    return `<tr class="orderNumber ${tds ? "" : "lastOrder"}">
          <td  colspan="2">Order number: ${_id}</td>
          <td class="price">${total} грн</td>
        </tr>` + tds
}


function addOrderRow({count, good:{name}, total}, className = ``) {

    return `        <tr ${className && ("class =" + className) || ``}>
          <td >${name}</td>
          <td class="amount-td">
            <span class="amount-product">${count}</span>
          </td>
          <td class="price">${total} грн</td>
        </tr>`
}


function draw(arr, container, marker = '', isSubCats= false) {

    let ul = document.createElement(`ul`);

   // subCatsName ? container.querySelector(`a`).classList.add(`parent`)  :  container.innerHTML = ``
    if (isSubCats){
        let a = container.querySelector(`a`);
        a.classList.add(`parent`);
        a.onclick = e => e.preventDefault();
    }else
        container.innerHTML = ``

    if (!arr) return;

    arr.map(({_id, name, subCategories}) => {
        let li = document.createElement(`li`);
        let a = document.createElement(`a`);
        a.innerText = name;
        a.href = `/${marker}/${_id}`;
        //a.addEventListener(`click`, addCatsEvent);
        a.onclick = addCatsEvent;
        li.append(a);
        ul.append(li);
        if (subCategories) draw(subCategories, li, `category`, true)
    })
    container.append(ul);
    //else  container.innerHTML= `<h1>ВРАЩАЮЩИЙСЯ БОЛТ</h1>`
}

function goodsDraw(arr, container, marker = '') {
    container.innerHTML = ``

    if( !arr || arr.length === 0){
        container.innerHTML = `<h2>Товаров нет(((</h2>`
    } else {
        arr.map(({_id, name, description, price, images}) => {

            let li = document.createElement(`li`);
            let a = document.createElement(`a`);
            let div = document.createElement(`div`);
            let span = document.createElement(`span`);
            let divImg = document.createElement(`div`);
            let divAddToCart = document.createElement(`div`);
            let buttonAdd = document.createElement(`button`);

            divAddToCart.classList.add(`addGoodBloc`)
            divAddToCart.innerHTML = `<input type="number" class="amountAddGoods" size="3" name="num" min="1" max="1000" value="1">`
            divAddToCart.append(buttonAdd);
            buttonAdd.classList.add(`button`);
            buttonAdd.innerText = "add to cart";
            divImg.classList.add(`imageDiv`);
            divImg.style.background = ` no-repeat center url("${rootURL +`/`+ images[0].url}")`;
            divImg.style.backgroundSize = `contain`;
            a.classList.add(`goods`)
            span.innerText = `${price} грн`;
            div.innerText = description;
            a.innerText = name;
            a.href = `/${marker}/${_id}`;

            a.append(divImg);
            a.append(div);
            a.append(divAddToCart);
            a.append(span)

            a.onclick = (e=>{
                e.preventDefault();
            })
            buttonAdd.addEventListener( `click`,addGoodToCart)

            li.append(a);
            container.append(li);
        })
    }

   // container.append(ul);
}


//row tags in string
function addRow(currentValue) {
    let id  = currentValue[0]
    let {amount, name, price} = currentValue[1]

        return  `<tr class="good">
      <td id="${id}">${name}</td>
      <td class="amount-td"><span class="left-arrow"></span>
        <span class="amount-product">${amount}</span>
        <span class="right-arrow"></span>

       </td>
       <td class="price">${price * amount} грн<span class="delete-button">delete</span></td> 
    </tr>`
    }


//EVENTS

//Swap interface between shop and cart
let cartBtn = document.querySelector(`header .cart`)

cartBtn.addEventListener(`click`, (e)=>{
    let cartDiv = document.getElementById(`cartView`);
    let shopDiv = document.getElementById(`output`);

    !shopDiv.style.display || shopDiv.style.display !== `none` ?
        shopDiv.style.display = `none`: shopDiv.style.display = `flex` ;
    cartDiv.style.display   ? cartDiv.style.display = `` : cartDiv.style.display = `initial`;


})

tbodyProduct.addEventListener('click', ({target}) =>{
    if(target.className === `delete-button`){

        store.dispatch(actionCartDel(target.parentElement.parentElement.firstElementChild.id))
    }
    if(target.className === `right-arrow`){
        store.dispatch(actionCartInc(target.parentElement.previousElementSibling.id))
    }
    if(target.className === `left-arrow`){
        store.dispatch(actionCartDec(target.parentElement.previousElementSibling.id))
    }
})

function addGoodToCart(e) {
    let goodID = this.parentElement.parentElement.href.match(/[\w|\d]+$/)[0];
    let goodName = this.parentElement.parentElement.firstChild.textContent;
    let goodAmount = this.previousElementSibling.value;
    let goodPrice = this.parentElement.nextElementSibling.innerText.match(/[0-9]+/)[0]
    store.dispatch(actionCartAdd(goodID, goodAmount, goodName, goodPrice));
}


function addCatsEvent(e) {
    let id = e.target.href.toString().match(/[\w|\d]+$/)[0]
    store.dispatch(actionGoods(id));
    e.preventDefault()
}




