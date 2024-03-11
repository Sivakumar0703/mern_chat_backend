import mongoose from 'mongoose';

const chatSchema = mongoose.Schema({
    users : [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users" // User // users => mongoose.model('users',userSchema)
        // ref option is what tells Mongoose which model to use during population(populate method)
    }],
    groupName: {
        type:String,
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    recentMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"messages" // Message
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users" //User
    }
},{timestamps:true})

const Chat = mongoose.model('chats',chatSchema);
export default Chat