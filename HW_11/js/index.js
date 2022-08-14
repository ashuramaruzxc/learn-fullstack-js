
let lastMessageId = 0;
let url = `http://localhost:4000`;
let isBlockButton = false;


function jsonPost(url, data) {

    switchButtonBlockAndBlockButton()

    return  fetch(url,{method : 'POST',
                    body: JSON.stringify(data)})
        .then(response => response.json())
        .then(switchButtonBlockAndBlockButton)
}



function switchButtonBlockAndBlockButton(value){
    isBlockButton = !isBlockButton
    document.getElementById(`sendBut`).disabled = isBlockButton;
    return value
}


async function sendMessage(nick, message){
    await jsonPost(url, {func: 'addMessage', nick: nick, message: message})
        .then(() => msg.value = `` )

}

async function getMessages(){
    console.log(`gm tick`);
    await jsonPost(url, {func: "getMessages", messageId: lastMessageId})
        .then(printMassage)


}

async function printMassage(msgObj){

if (+msgObj.nextMessageId === lastMessageId)
    return
    for (let i of msgObj.data) {
        let li = document.createElement('li');
        li.innerHTML = `<span class="nickName">${i.nick}:</span>
                               <span class="timeId">[${new Date(i.timestamp).toLocaleString()}]</span><br>
                               <span class="msgOut">${i.message}</span>`
        out.prepend(li);
    }
    lastMessageId = +msgObj.nextMessageId

}

    async function sendAndCgeck(){
        sendMessage(nickName.value, msg.value)
            .then(getMessages)
    }


//GET START LOOP
(async ()=>{while (true){
    await getMessages();
    await delay(2000);
}})()



function delay(t) {
    return new Promise(function(resolve) {
        console.log(`tick`);
        setTimeout(resolve, t);
    });
}



sendBut.addEventListener('click', sendAndCgeck);

/*    gm.addEventListener(`click`, getMessages)*/

