import Chat from "../Model/chat.model.js";
// import Message from "../Model/message.model.js";
import User from "../Model/user.model.js";
 

export const oneToOneChat = async(req,res) => {
    const{userId} = req.body; // selected person to chat with
    // console.log('👉 user id from req body',userId)
   

    if(!userId){
        console.log('user id is not passed');
        return res.status(400).json({message:"no user"})
    }
//     const myChat = await Chat.find({})
// console.log('chat model conatins',myChat)
    let chat = await Chat.find({
        isGroupChat:false,
        $and : [
            {users : { $elemMatch : { $eq : req.user._id}}}, // from token
            {users : { $elemMatch : { $eq : userId}}} // from req.body
        ]
    }) .populate("users","-password") // users field from Chat model => populate everything except password
       .populate("recentMessage"); // recentMessage field from Chat model

       console.log('👉 chat' , chat)

       chat = await User.populate(chat,{
        path : "recentMessage.sender", //  chat model (recentMessage) => message model (sender) 
        select : "name email image" // fields that we are retrieving
       })
       
    //    let check = await Message.find({})
    //    console.log('👉 chat-2' , chat,check)
       if(chat.length > 0){
          return  res.status(200).send(chat[0]) // no chats available => first time chat
       } else {
         let chatData = {
            chatLabel: "sender", // chatName
            isGroupChat : false ,
            users : [req.user._id,userId]
         }

         console.log('👉 chat data to create new chat ',chatData)

         try {
            const newChat = await Chat.create(chatData);
            console.log('👉  new chat ',newChat)
            const fullChat = await Chat.findOne({_id:newChat._id})
            .populate("users" , "-password")
            console.log('👉 fullChat ',fullChat)
            res.status(200).send(fullChat)
         } catch (error) {
            res.status(500).json({message:"internal server error in creating chat"})
         }
       }
}

export const getAllChat = async(req,res) => {
        try {
            //  Chat.findOne({users:req.user._id}).then(result => res.send(result))
             await Chat.find({users:{$elemMatch : {$eq : req.user._id}}})
            .populate("users","-password")
            .populate("recentMessage")
            .populate("admin","-password")
            .sort({updatedAt:-1})
            .then(async(ans)=>{
                ans = await User.populate(ans,{
                    path:"recentMessage.sender",
                    select:"name pic email"
                })
                res.status(200).send(ans)
             })
             .catch((err )=> console.log('err in get all chats',err))
            
        } catch (error) {
           res.status(500).json({message:"error in fetching user chats",error})
        }
}

export const createGroup = async(req,res) => {
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:"please fill all the fields"})
    }

    let users = JSON.parse(req.body.users); // members other than admin

    if(users.length < 2){
        return res.status(400).json({message:"you need more than 2 members to create a group"})
    }

    users.push(req.user) // admin

    try {
       const group = await Chat.create({
        users:users,
        chatLabel:req.body.chatLabel, // name
        isGroupChat:true,
        admin:req.user
       }) ;

       const fullChat = await Chat.findOne({_id:group._id}).populate("users","-password")
       .populate("admin" , "-password")

       res.status(200).json({message:"group chat created successfully",fullChat })
    } catch (error) {
        res.status(500).json({message:"error in group chat creation",error})
    }


}