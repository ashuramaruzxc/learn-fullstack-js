import './App.css';
import React, {useState, useEffect, useRef} from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

const MessageUl = ({messages}) => {

    return (
        <ul>{messages.map(value => {
            return (<li key={value._id}>
                <span className="time">{`[${new Date(value.timestamp).toLocaleTimeString()}] `}</span>
                <span className="nickName">{`${value.nickName}: `}</span>
                <span className='message'>{value.message}</span>
            </li>)
        })}
        </ul>
    )
}


const ChatForm = () => {
    const [nickName, setNickName] = useState(``)
    const [message, setMessage] = useState(``)
    const [messagesArr, setMessagesArr] = useState([{nickName: 'No nik name', message: 'No messages', _id: 0}]);

    useEffect(() => {
        fetch(`/message`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(value => value.json())
            .then(value => setMessagesArr(value))
    }, [])

    return (
        <>
            <input id="nickName" size="7" type="text" placeholder="nick name"
                   value={nickName} onChange={(event) => setNickName(event.target.value)}/>
            <input id="message" size="20" type="text" placeholder="message"
                   value={message} onChange={(event) => setMessage(event.target.value)}/>

            <FetchButton nickName={nickName}
                         message={message}
                         setMessagesCb={value => setMessagesArr([...messagesArr, value])}
                         clearMessageFieldCb={() => setMessage(``)}/>

            <MessageUl messages={messagesArr}/>
        </>
    )
}


const FetchButton = ({nickName, message, setMessagesCb, clearMessageFieldCb}) => {
    return (
        <button onClick={() => fetch(`/message`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({nickName: nickName, message: message})
        }).then(value => value.json())
            .then(value => setMessagesCb(value))
            .then(() => clearMessageFieldCb())}>Send</button>
    )
}


function App() {
    return (
        <div className="App">
            <Router>
                <Switch>

                    <Route exact path="/message">
                        <ChatForm/>
                    </Route>

                    <Route path="/">
                        <Link to={"/message"}>go to the chat</Link>
                    </Route>

                </Switch>
            </Router>
        </div>

    );
}

export default App;
