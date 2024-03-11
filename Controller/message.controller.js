import Message from "../Model/message.model.js";
import User from "../Model/user.model.js";
import Chat from "../Model/chat.model.js";

export const sendMessage = async(req,res) => {
    try {
        // const {msgContent , chatId} = req.body;
        const {msgContent , chatId , isMedia , mediaType} = req.body;
        // console.log('👉 msg from front end',msgContent , chatId , isMedia)
        let date = new Date();

    // time-stamp
   function timeStamp(){
    let time;
    console.log(("00"+date.getHours().toString()).length)
    if(date.getHours().toString().length === 1){
      time = "0"+date.getHours()+":";
    } else {
       time = date.getHours()+":";
    }
  
    if(date.getMinutes().toString().length === 1){
      time = time + "0" + date.getMinutes();
    } else {
       time = time + date.getMinutes();
    }
    
      return time;
  }
        // console.log(chatId,msgContent)

        if(!msgContent || !chatId){
            console.log('msg-content or chat id is missing');
            return res.status(400).json({message:'msg-content or chat id is missing',error})
        }

        let msg = {
            sender : req.user._id,
            content : msgContent,
            chat : chatId,
            isMedia : isMedia,
            mediaType:mediaType,
            msgSentTime: timeStamp()
        }

        let message = await Message.create(msg)
        message = await message.populate("sender","name image")
        message = await message.populate("chat")
        // await messageModel.create(msg).populate("sender","name image").populate("chat")
        // we didn't populate just like the above line because now only we are creating the data according to msg model
        // after creating the model only we can add populate it.If we already have a data means we can use find method and populate directly

        message = await User.populate(message,{
            path:"chat.users",
            select : "name email image"
        })
        await Chat.findByIdAndUpdate(req.body.chatId,{recentMessage : message},{new:true})
        res.status(200).json({message:'message was sent successfully' , msg:message})     
    } catch (error) {
        res.status(500).json({message:"internal server error in sending msg"}) 
    }
}

export const getAllMessages = async(req,res) => {
    try {
        const msg = await Message.find({chat:req.params.chatId})
        .populate("sender","name email image")
        .populate("chat")

        res.status(200).json({message:"successfully received every messages",msg})
    } catch (error) {
        res.status(500).json({message:"internal server error",error})
    }
}