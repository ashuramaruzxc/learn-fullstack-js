
let circle = document.getElementsByClassName("circle");
let [red , yellow, green, pedRed, pedGreen] = circle;
let knopkaEl = document.getElementById(`knopka`);
let removeFunction;

const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms))

async function trafficLight(){
    while (true){


        //green
        green.classList.add(`circleBGColor3`);
        pedRed.classList.add(`circleBGColor1`);
        let i = await delayOrButtonRace(3000)
        green.classList.remove(`circleBGColor3`);


        //yellow
        console.log(i)
        if(i){
            yellow.classList.add(`circleBGColor2`);
            await delayOrButtonRace(1000)
            yellow.classList.remove(`circleBGColor2`);
        }

        pedRed.classList.remove(`circleBGColor1`);

        //red
        red.classList.add(`circleBGColor1`);
        pedGreen.classList.add(`circleBGColor3`)
        await delay(3000);
        red.classList.remove(`circleBGColor1`);
        pedGreen.classList.remove(`circleBGColor3`);

    }
}

async function delayOrButtonRace(delayTime = 1000){
    return  Promise.race([domEventPromise(knopkaEl, 'click'),
        delay(delayTime).then(value => {
            knopkaEl.removeEventListener(`click`, removeFunction);
            return true;
        })])
}


async function domEventPromise(knopka, click) {

    return new Promise(resolve => {

        removeFunction = function(){
            tempBlockButton(1000);
            resolve(false)
        }

        knopka.addEventListener(click, removeFunction);
    })
}

function tempBlockButton(time){
    knopkaEl.disabled = true;
    setTimeout(() => knopkaEl.disabled = false, time);
}


trafficLight()


