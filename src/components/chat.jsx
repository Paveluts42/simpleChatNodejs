import React, {useState, useRef, useEffect} from "react";
import socket from "../socket";
const Chat = ({users,messages,userName,roomId,onAddMessage}) => {
    const [messageValue, setMessageValue] = useState('')
    const messageRef = useRef(null);
    const onSendMessage=()=>{
    socket.emit('ROOM_NEW_MESSAGE',{
        text:messageValue,
        userName,
        roomId
    })
        onAddMessage({
            text:messageValue,
            userName,
        })
        setMessageValue('')
    }
    useEffect(()=>{
        messageRef.current.scrollTo(0,999999)
    },[messages])
    return (
        <div className='chat'>
            <div className="chat-users">
                <h2>room: {roomId}</h2>
                <hr/>

                <b>Online {users.length}</b>
                <ul>
                    {
                        users.map((i,idx)=><li key={idx + Date.now()}>{i}</li>)
                    }
                </ul>
            </div>
            <div className="chat-messages">
                <div className="messages" ref={messageRef}>
                    { messages.map(message=>{
                     return(   <div className="message" key={message.text + Date.now()}>
                            <p>{message.text}</p>
                            <div>
                                <span>{message.userName}</span>
                            </div>
                        </div>)
                    })}

                </div>
                <form >

                    <textarea
                    value={messageValue}
                    onChange={(e)=>setMessageValue(e.target.value)}
                    className='form control'
                    rows='3'
                    >
                    </textarea>
                    <button onClick={onSendMessage} type='button' className='btn btn-primary'>
Send
                    </button>
                </form>
            </div>

        </div>
    )


}


export default Chat
