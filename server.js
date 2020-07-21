
const express = require("express");

const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server);
const rooms = new Map();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/rooms/:id", (req, res) => {
    const roomId=req.params.id
    const obj=rooms.has(roomId)?{
        users:[...rooms.get(roomId).get('users').values()],
        messages:[...rooms.get(roomId).get('messages').values()]
    }:{users: [],messages:[]}
    res.json(obj);
});

app.post("/rooms", (req, res) => {
    const {roomId, userName} = req.body
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map([
            ['users', new Map()],
            ['messages', []],
        ]))
    }
    res.send()
});
io.on("connection", (socket) => {
    socket.on('ROOM_JOIN',({roomId,userName})=>{
         socket.join(roomId)
        rooms.get(roomId).get('users').set(socket.id,userName)
        const users=[...rooms.get(roomId).get('users').values()]
        socket.to(roomId).emit('ROOM:SET_USERS',users)
    })

    socket.on('ROOM_NEW_MESSAGE',({roomId,userName,text})=>{
    const obj={
        userName,
        text
    }
      rooms.get(roomId).get('messages').push(obj)
        socket.to(roomId).broadcast.emit('ROOM:NEW_MESSAGES',obj)

    })


    socket.on("disconnect",()=>{
        rooms.forEach((value,roomId)=>{
            if(value.get('users').delete(socket.id)){
                const users=[...rooms.get(roomId).get('users').values()]
                socket.to(roomId).broadcast.emit('ROOM:SET_USERS',users)
            }
        })
    })
    console.log("user connected", socket.id);

});

server.listen(8080, (err) => {

    if (err) throw Error(err);

    console.log("server started");
});
