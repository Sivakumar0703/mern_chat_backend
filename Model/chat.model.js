import mongoose from 'mongoose';

const chatSchema = mongoose.Schema({
    user : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    chatLabel: {
        type:String,
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    lastMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    Admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

const Chat = mongoose.model('chats',chatSchema);
export default Chat