import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
name :{
    type:String,
    required:true
},
email :{
    type:String,
    unique:true,
    required:true
},
password :{
    type:String,
    required:true
},
image :{
    type:String,
    default:"https://res.cloudinary.com/sivakumar/image/upload/v1709532026/images/vyondxm5pswy7ivi0npn.jpg"
},
isVerified : {
    type : Boolean,
    default : false
},
token:{
    type:String
},
verification : {
    type : String,
    default : null
},
notification:{
    type:Array,
    default:[]
}
},{timestamp:true})

const User = mongoose.model('users',userSchema);
export default User