import express from 'express';
// import dotenv from 'dotenv';
import 'dotenv/config'
import cors from 'cors';
// import router from './Routers/chat.router.js';
import ConnectDb from './Database/ConfigDb.js';
import router from './Routers/user.router.js';
import chatRouter from './Routers/chat.router.js';


// dotenv.config()


const app = express();
const port = process.env.PORT;

app.use(cors())
app.use(express.json())
// app.use('/api',router)
app.use('/api/user',router);
app.use('/api/chat',chatRouter)
ConnectDb();

app.listen(port , ()=>{
    console.log('🚀 server is running @ ',port);
})