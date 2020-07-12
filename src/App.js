import React, {useEffect, useReducer} from "react";
import JoinBlock from "./components/joinBlock";
import reducer from "./reducer";
import socket from "./socket";
import axios from 'axios'
import Chat from "./components/chat";


function App() {
    const [state, dispatch] = useReducer(reducer, {
        joined: false,
        roomId: null,
        userName: null,
        users: [],
        messages: []
    })
    const onLogin = async (obj) => {
        dispatch({
            type: 'JOINED',
            payload: obj
        })
        socket.emit('ROOM_JOIN', obj)
        const {data} = await axios.get(`/rooms/${obj.roomId}`)
        dispatch({
            type:'SET_DATA',
            payload:data
        })
    }
    const addMessage=(message)=>{

        dispatch({
            type:"NEW_MESSAGES",
            payload: message
        })
    }
    const setUsers = (users) => {
        dispatch({
            type: "SET_USERS",
            payload: users
        })
    }
    useEffect(() => {
        socket.on('ROOM:SET_USERS', setUsers)
        socket.on('ROOM:NEW_MESSAGES', addMessage)
    }, [])
    return (
        <div className="wrapper">
            {!state.joined ? <div className="join-block">
                <JoinBlock onLogin={onLogin}/>
            </div> : <Chat {...state} onAddMessage={addMessage}/>}
        </div>
    );
}

export default App;
