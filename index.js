import express from 'express';
// import dotenv from 'dotenv';
import 'dotenv/config'
import cors from 'cors';
import router from './Routers/chat.router.js';
import ConnectDb from './Database/ConfigDb.js';


// dotenv.config()


const app = express();
const port = process.env.PORT;

app.use(cors())
app.use(express.json())
app.use('/api',router)
ConnectDb();

app.listen(port , ()=>{
    console.log('🚀 server is running @ ',port);
})