import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
sender :{
    type:mongoose.Schema.Types.ObjectId,
    ref:"users" // User
},
content:{
    type:String,
    trim:true
},
isMedia:{
    type:Boolean,
    default : false
},
mediaType:{
    type:String,
    default: "text"
},
chat:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"chats" //Chat
},
msgSentTime:{
    type:String
}
},{timestamp:true})

const Message = mongoose.model('messages',messageSchema);
export default Message