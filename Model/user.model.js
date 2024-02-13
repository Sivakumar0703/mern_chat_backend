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
    default:"https://drive.google.com/file/d/1phmYV3dNnLB803sKf4hW3BWzMsH_iSb4/view?usp=drive_link"
},
},{timestamp:true})

const User = mongoose.model('users',userSchema);
export default User