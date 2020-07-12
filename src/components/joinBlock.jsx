import React, {useState} from "react";
import axios from "axios"
const JoinBlock = ({onLogin}) => {
    const [roomId, setRoomId] = useState('')
    const [userName, setUserName] = useState('')
    const [loading, setLoading] = useState(false)
    const onEnter= ()=>{
        if(!userName||!roomId){
            alert('error')
            return
        }
        const data={
            roomId,userName
        }
        setLoading(true)
        axios.post("/rooms",data).then(()=>onLogin(data))
    }
    return (
        <>
            <input className="row mx-auto" type="text" placeholder="roomId" value={roomId}
                   onChange={(e) => setRoomId(e.target.value)}></input>
            <input className="row mx-auto" type="text" placeholder="userName" value={userName}
                   onChange={(e) => setUserName(e.target.value)}></input>
            <button disabled={loading} className=" btn btn-primary " onClick={onEnter}>
                {loading?"...Entering":"Enter"}</button>
        </>
    );
};
export default JoinBlock;
