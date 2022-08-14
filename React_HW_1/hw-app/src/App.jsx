//import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect, useRef} from 'react';

// SPOILER ////////////////////////////////////////////////////////

const Spoiler = ({header = "+", open, children}) => {

    const [state, setState] = useState(open);


    return <div onClick={() => {
        setState(!state)
    }
    }>
        {header}
        {state && children}
    </div>
}

// RangeInput ///////////////////////////////////////////////////////////////

const RangeInput = ({min = 0, max = 1000, type = "text"}) => {

    const [text, setText] = useState(``);

    return <div>
        <input type={type} placeholder={`min = ${min} max = ${max}`} onChange={event => {
            setText(event.target.value)
        }}/>
        <button disabled={text.length < min || text.length > max}>Send</button>
        <br/>
        <span style={{color: text.length < min ? "red" : text.length > max && "red"}}>
            {text.length < min ? "length is short" : text.length > max ? "length is longer" : `send`}
        </span>

    </div>
}

//PasswordConfirm///////////////////////////////////////////////////////////////////////

const PasswordConfirmForm = ({min = 1, validator}) => {

    const [text1, setText1] = useState(``);
    const [text2, setText2] = useState(``);

    return (
        <form autoComplete="new-password">
            <table>
                <tbody>
                <tr>
                    <td>
                        <label>Password : </label>
                    </td>
                    <td>
                        <PasswordInput setText={setText1}/>
                    </td>
                    <td className="info-column">
                        <ValidateInfoSpan text={text1} min={min} val={validator}/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label>Try password : </label>
                    </td>
                    <td>
                        <PasswordInput setText={setText2}/>
                    </td>
                    <td className="info-column">
                        <ValidateInfoSpan text={text2} min={min}/>
                    </td>
                </tr>
                </tbody>
            </table>
            <span>{text1 !== text2 ? "password is not confirmed" : text1 && "OK"}</span><br/>
            <button disabled={text1 !== text2 || !validator(text1)}>SignIn</button>
        </form>)

}

const ValidateInfoSpan = ({text, min, val = () => true}) => {
    return <span style={{color: text.length < min && "red", visibility: text.length >= min && val(text) && `hidden`}}>
                                 {text.length < min ? "length is short" : !val(text) && "not valid password"}
        </span>
}

const PasswordInput = ({setText}) => {

    return <input type="password"
                  autoComplete="new-password"
                  onChange={(e) => setText(e.target.value)}

    />

}

const someVal = (validationText) => {

    return !!validationText.toString().match(/[0-9]/)
}


//Timer////////////////////////////////////////////////////////////////////////


const TimerControl = ({ timer : Timer, render}) => {

    const [hours, setHours] = useState(0);
    const [min, setMin] = useState(0);
    const [sec, setSec] = useState(0);
    const [refresh, setRefresh] = useState(1);
    const [isStarted, setIsStarted] = useState(false);


    return (
        <div className={"timerControl"}>
            {!isStarted ? <>
                    <input value={hours} min={0} type="number" autoComplete="off"
                           onChange={e => Number.isInteger(+e.target.value) && setHours(+e.target.value || 0)}/>
                           {` : `}
                    <input value={min} min={0} max={59} type="number" autoComplete="off"
                           onChange={e => Number.isInteger(+e.target.value) && setMin(+e.target.value)}/>
                           {` : `}
                    <input value={sec} min={0} max={59}  type="number" autoComplete="off"
                           onChange={e => Number.isInteger(+e.target.value) && setSec(+e.target.value)}/>
                    <button onClick={() => setIsStarted(true)}>Start</button>
                    <br/>
                    <label>{"refresh period: "}</label>
                    <input value={refresh} type="number" min={1}
                           onChange={e=> setRefresh(e.target.value)}/>
                </> :
                <Timer seconds={(hours*3600) + (min*60) + sec}
                       refresh = {refresh}
                       render={render}
                       callback={() =>( setIsStarted(false), setSec(0))}/>}
        </div>)
}


const TimerContainer = ({seconds = 0, refresh = 1, render : Render,  callback}) => {

    const [sec, setSec] = useState(+seconds);
    const [isPaused, setPause] = useState(false)
    const refTimerId = useRef(-0);

    useEffect(() => {
        if (sec <= 0) return
        refTimerId.current = setInterval(() => setSec(sec - refresh),
                                        refresh <= sec ? refresh*1000 : sec*1000);
        return () => {clearTimeout(refTimerId.current)}},[sec])

    return (<>
            <Render seconds={sec}
                    pauseCallback = {() => refTimerId.current
                        ?  (clearTimeout(refTimerId.current), refTimerId.current = -0, setPause(true))
                        : (sec > 0 && (setSec(sec - 1), setPause(false)))}
                    restartCallback = {callback}
                    isPaused = {isPaused}
              />
            </>
    )
}


const SecondsTimer = ({seconds}) => <h2>{seconds}</h2>

const LCD = ({seconds, pauseCallback, restartCallback, isPaused}) => {


    let {hours, min, sec} = timeConverter(seconds)

    return (<>
        <h3>{`${hours}h : ${min}m : ${sec}s`}</h3>
        <button className="timerButton" onClick={restartCallback}>reset</button>
        <button className="timerButton" onClick={pauseCallback}>
            {isPaused ? "  run  " : "pause"}
        </button>
    </>)}

//Watch//////////////////////////////////////////////////////////////////////////////////////////////

const Watch =({seconds, pauseCallback, restartCallback, isPaused})=>{
    let clockFace = `http://draw.asmer.fe.a-level.com.ua/ClockFace/ClockFace.png`;
    let hourHand = `http://draw.asmer.fe.a-level.com.ua/ClockFace/ClockFace_H.png`;
    let minHand = `http://draw.asmer.fe.a-level.com.ua/ClockFace/ClockFace_M.png`;
    let secHand = `http://draw.asmer.fe.a-level.com.ua/ClockFace/ClockFace_S.png`;
    let {hours, min, sec} = timeConverter(seconds)

    return (<>
        <div className="watchBlock" >
            <img className="clockFace" src={clockFace}/>
            <ClockFace/>
            <img className="hourHand" src={hourHand} style={{transform: `rotate(${hours * 30}deg)`}}/>
            <img className="minHand" src={minHand} style={{transform: `rotate(${min * 6}deg)`}}/>
            <img className="secHand" src={secHand} style={{transform: `rotate(${sec * 6}deg)`}}/>
        </div>
<div className="controlButton">
    <button className="timerButton" onClick={restartCallback}>reset</button>
    <button className="timerButton" onClick={pauseCallback}>
        {isPaused ? "  run  " : "pause"}
    </button>
</div>
    </>)
}

const ClockFace = ()=>{
    let divArr = []

    for( let i = 1 ; i <= 12 ; i++ ){
        divArr.push(<div className="numberContainer"
                         style={{transform: `translate(-50%, 0) rotate(${i*30}deg)`, transformOrigin: "bottom" }}>
                        <h2  style={{transform: `translate(-50%, 0) rotate(-${i*30}deg)`}}>{i}</h2>
                    </div>)
    }
    return(
        <div className="clockFaceNumbers" >{divArr}</div>
    )
}



//seconds to {hours, min, sec}
function timeConverter(seconds) {
    let hours = Math.floor(seconds / 60 / 60);
    let min = Math.floor((seconds / 60) % 60);
    let sec = Math.floor(seconds % (60 * 60) % 60);
    return {hours : hours, min : min, sec : sec}
}



function App() {

    return (

        <div className="App">
            <h1>SPOILER</h1>
            <Spoiler header={<h1>Заголовок</h1>} open>
                Контент 1
                <p>
                    лорем ипсум траливали и тп.
                </p>
            </Spoiler>

            <Spoiler>
                <h2>Контент 2</h2>
                <p>
                    лорем ипсум траливали и тп.
                </p>
            </Spoiler>

            <h1>RANGE INPUT</h1>
            <RangeInput min={2} max={10}/>

            <h1>PasswordConfirm</h1>
            <PasswordConfirmForm min={4} validator={someVal}/>

            <h1>Timer, TimerControl, TimerContainer, LCD</h1>

            <TimerControl timer={TimerContainer} render={LCD} />

            <h1>Watch, TimerControl + TimerContainer</h1>

            <TimerControl timer={TimerContainer} render={Watch}/>

        </div>


    );
}

export default App;
