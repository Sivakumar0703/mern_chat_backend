import express  from "express";
import { protect } from "../Middleware/auth.middleware.js";
import { getAllMessages, sendMessage } from "../Controller/message.controller.js";




const messageRouter = express.Router()

messageRouter.post('/',protect,sendMessage)
messageRouter.get('/:chatId',protect,getAllMessages)





export default messageRouter