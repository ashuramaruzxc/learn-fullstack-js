const delay = (ms = 700) => new Promise(ok => setTimeout(() => ok(ms), Math.random() > 0.5 ? ms : ms * 2))
let div = document.getElementById(`output`);

async function speedTest(getPromise, count = 1, parallel = 1) {

    let duration;
    let durationArrTime = [];
    let loopCount = count;

    let durationTime = timer();

    while (loopCount > 0) {
        durationArrTime.push(...await Promise.all(await getArray(parallel, getPromise, count - loopCount)));
        loopCount--
    }
    duration = timer() - durationTime;

    return {
        duration,
        durationArrTime,
        count,
        parallel
    }
}


function getSpeedTestObj({duration, durationArrTime, count, parallel}, isEachQueryTest = false) {

    if (isEachQueryTest) {

        if (durationArrTime.length === 1) {
            duration = (durationArrTime[0].queryTime);
        } else {
            let sumDurationEachQueryMeasure = (durationArrTime.reduce((accum, {queryTime}) => {
                return (typeof accum === `object` ? accum.queryTime : accum) + queryTime}));

            duration = sumDurationEachQueryMeasure / parallel;
        }
    }


    let querySpeed;
    let queryDuration;
    let parallelSpeed;
    let parallelDuration;

    duration = getDecimalPlaces(duration);
    parallelDuration = getDecimalPlaces(duration / (count * parallel));
    parallelSpeed = getDecimalPlaces(parallelDuration / duration);
    queryDuration = getDecimalPlaces(duration / count);
    querySpeed = getDecimalPlaces(parallel / queryDuration);


    return {
        duration,
        querySpeed,
        queryDuration,
        parallelSpeed,
        parallelDuration
    }
}


function getDecimalPlaces(value) {
    return +value.toString().match(/.+[.].{5}|[0-9]+/)
}


async function getArray(parallel, getPromise, countNumb) {

    let arr = [];

    for (let i = 0; i < parallel; i++) {
        arr.push(timeWrap(getPromise, countNumb, i));
    }
    return arr;
}


async function timeWrap(func, parallelNumb, countNumb) {

    let time = timer();
    let p = await func();
    time = timer() - time;
    console.log(time);
    return {
        queryTime: time,
        parallelNumb: parallelNumb,
        countNumb: countNumb
    }
}


function timer() {
    return performance.now()
}


function getTest() {
    let countVal = +document.getElementById(`count`).value;
    let parallelVal = +document.getElementById(`parallel`).value;
    div.innerHTML = `<h1>Please wait!!!</h1>`;

    speedTest(() => fetch(urlQuery.value).then(res => res.json()), countVal, parallelVal)
        .then(result => {
            div.innerHTML = ``;
            printTest(div, `Standard speed test`, getSpeedTestObj(result));
            return result})
        .then(result => printTest(div, `Each query measure test`, getSpeedTestObj(result, true)))
}


function printTest(container, label, result) {
    let ul = document.createElement(`ul`)

    ul.innerHTML = `<li class="label">${label}</li>
    <li>duration, ms: <span class="test-val">${result.duration}</span></li>
    <li>querySpeed, q/ms: <span class="test-val">${result.querySpeed}</span> </li>
    <li>queryDuration, ms: <span class="test-val">${result.queryDuration}</span></li>
    <li>parallelSpeed, q/ms:<span class="test-val">${result.parallelSpeed}</span> </li>
    <li>parallelDuration, ms:<span class="test-val">${result.parallelDuration}</span> </li>`

    container.append(ul);

}


sendBut.addEventListener(`click`, getTest)
