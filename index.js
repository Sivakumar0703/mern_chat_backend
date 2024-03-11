import express from 'express';
// import dotenv from 'dotenv';
import 'dotenv/config'
import cors from 'cors';
// import router from './Routers/chat.router.js';
import ConnectDb from './Database/ConfigDb.js';
import router from './Routers/user.router.js';
import chatRouter from './Routers/chat.router.js';
import messageRouter from './Routers/message.router.js';
import { Server } from "socket.io";
// import { createServer } from "http";


// dotenv.config()


const app = express();
const port = process.env.PORT;

app.use(cors())
app.use(express.json())
// app.use('/api',router)
app.use('/api/user',router);
app.use('/api/chat',chatRouter);
app.use('/api/msg',messageRouter)
ConnectDb();

// const httpServer = createServer(app);

const server = app.listen(port , ()=>{
    console.log('🚀 server is running @ ',port);
})


//socket.io initialization
const io = new Server(server,{
    cors : {
        origin : [process.env.ORIGIN]
    },
    pingTimeout : 60000,
})

 io.on("connection",(socket)=>{
    console.log("socket.io connected" , socket.id)

    socket.on("setUp" , (userData)=>{
        console.log("user id from front end",userData?._id)
        socket.join(userData?._id) // room for a user
        socket.emit("connected")
    })

     socket.on("join_chat",(room)=>{ // your frnd joins the room which was created by you(user)
         socket.join(room);
         console.log("user joined room",room)
     })

    socket.on("new_msg",(newMsgReceived)=>{
         socket.broadcast.emit("msg_received",newMsgReceived)
    })

    socket.on("texting" , (room)=>{
        socket.in(room).emit("typing")
    })

    socket.on("stop_texting" , (room)=>{
        socket.in(room).emit("stop_typing")
    })

 })


 