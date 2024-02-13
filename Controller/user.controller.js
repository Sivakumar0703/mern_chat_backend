import User from "../Model/user.model.js";
import { createToken, hashCompare, hashPassword } from "./authorization.controller.js";


export const user = (req,res) => {
    res.send('api is working');
}

// register new user
export const registerUser = async(req,res) =>{
   try {
    const{name , email , mobile , password , image} = req.body;

    const alreadyRegistered = await User.findOne({email:email});
    if(alreadyRegistered){
       return res.status(400).json({message:'User Already Exists'})
    }

    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
    const token = await createToken({_id:user._id});
    res.status(200).json({message:"Registered Successfully",user,token});
    
   } catch (error) {
     res.status(500).json({message:"Internal Server Error",error});
   }
}

// login user
export const loginUser = async(req,res) => {
    try {
        const {email , password} = req.body;
        console.log(req.body)

        const user = await User.findOne({email});
        console.log(req.body,user)
        if(!user){
            return res.status(400).json({message:"No User Found"});
        }

        const isPasswordMatched = await hashCompare(req.body.password,user.password)
        if(!isPasswordMatched){
           return res.status(400).json({message:"Invalid Password"})
        }

        res.status(200).json({message:"Login Successful",user})

    } catch (error) {
        res.status(500).json({message:"Internal Server Error log",error});      
    }


}