import User from "../Model/user.model.js";
import { createToken, generateLink, hashCompare, hashPassword, verifyToken, verifyTokenForReset } from "./authorization.controller.js";
import {sendMail} from "../Utility/nodemailer.js";
import {v2 as cloudinary} from "cloudinary";

// export const user = (req,res) => {
//     res.send('api is working');
// }

// register new user
export const registerUser = async(req,res) =>{
   try {
    const{name , email , mobile , password , image} = req.body;
    console.log('📷',req.body)

    const alreadyRegistered = await User.findOne({email:email});
    if(alreadyRegistered){
       return res.status(400).json({message:'User Already Exists'})
    }

    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
    const token = await createToken({_id:user._id});
    user.token = token
    user.save()

    // send verification email
    const activationLink =  `http://localhost:5000/api/user/verify/${token}`;
        const toAddress = user.email;
        const context = `<h3>hi , ${user.name}</h3>
        <h4>Welcome to TALKS chat app</h4>
        <p>click on the link below to activate your account</p>
        <a href="${activationLink}">click here</a>`
        sendMail(toAddress,"Account Verification",context)

    res.status(200).json({message:"Registered Successfully.Please check your email to activate your account",user,token,activationLink:activationLink});
    
   } catch (error) {
     res.status(500).json({message:"Internal Server Error",error});
   }
}

// login user
export const loginUser = async(req,res) => {
    try {
        const {email , password} = req.body;
        // console.log(req.body)

        const user = await User.findOne({email});
        // console.log(req.body,user)
        if(!user){
            return res.status(400).json({Message:"No User Found"});
        }

        if(!user.isVerified){
            return res.status(400).json({Message:"please verify your account"});
        }
        const token =  await createToken({id:user._id})
        const isPasswordMatched = await hashCompare(req.body.password,user.password)
        if(!isPasswordMatched){
           return res.status(400).json({Message:"Invalid Password"})
        }
        const userObj =  {...user._doc , token}; // data to be stored in browser local storage
        delete userObj.password
        delete userObj.__v
        user.token = token;
        user.save()
        
        res.status(200).json({Message:"Login Successful",userObj})

    } catch (error) {
        res.status(500).json({Message:"Internal Server Error log",error});      
    }
}

// all user
// http://localhost:5000/api
export const allUser = async(req,res) => {
    const query = req.query.search ? {
        $or : [
            {name:{$regex : req.query.search , $options:"i"}}, // name:{$regex:req.query.search} => it will return all the document which matches with the query 
            {email:{$regex : req.query.search , $options:"i"}} // eg: search="si" => it search for email that contain "si" and return all the matching document
        ]
    } : {}
    // console.log('query search',req.query.search)
    const users = await User.find(query).find({_id:{$ne:req.user._id}});
    const users2 = await User.find(query);
    // console.log('users',users)
    // console.log('users2',users2)
    res.status(200).json({message:'found users',users})
}

// edit user data
export const verifyUser = async(req,res) => {
    try {
        const token = req.params.token;
       const userId =  await verifyToken(token)
        const user = await User.findOne({_id:userId})
        if(!user){
            return res.status(400).send( `<html>
            <body>
            <h4>VERIFICATION FAILED</h4>
            <p>Invalid token</p>
            </body>
            </html>`
            )
        }

        if(user.isVerified){
            return res.status(400).send(
                `<html>
                <head>
                <style>
                body{
                 
                    background-color:#152238
                }

                #container{
                height:50%;
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
                background-color:#009688;
                border-radius : 8px;
                }

                h3,p,a{
                    color : #e0f2f1
                }
                </style>
                </head>
            <body>
            <div id="container">
            <h3>Hi , ${user.name}</h3>
            <p>Your account is already verified</p>
            <p>Go to chat page and login or click the below link</p>
            <a href="http://localhost:3000">click here</a>
            </div>
            </body>
            </html>`
            )
        }

        await User.findByIdAndUpdate({_id:userId} , {isVerified:true})

        const loginPage = `http://localhost:3000/`
        res.status(200).send(
            `<html>
            <head>
            <style>
            body{
                height:100vh;
                background-color:#152238
            }
            #container{
                height:50%;
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
                background-color:#009688
                border-radius : 8px;
            }
            h3,h4,p,a{
                color : #e0f2f1
            }
            </style>
            </head>
            <body>
            <div id="container">
            <h3>Hi , ${user.name} 😎</h3>
            <h4>VERIFICATION Completed</h4>
            <h4>Welcome to TALKS chat app</h4>
            <p>Your account is activated.click on the below link to visit login page</p>
            <a href="${loginPage}}">click here</a>
            <p>Enjoy chatting with your friends and family.Stay connected ❤️</p>
            </div>
            </body>
            </html>`
        )
    } catch (error) {
         res.status(500).send(
            `<html>
            <head>
            <style>
            body{
                height:100vh;
                background-color:#152238
            }
            #container{
                height:50%;
                display:flex;
                flex-direction:column;
                justify-content:center;
                align-items:center;
                background-color:#009688
                border-radius : 8px;
            }
            h4,p{
                color : #e0f2f1
            }
            </style>
            </head>
            <body>
            <div id="container" >
            <h4>VERIFICATION FAILED ❌</h4>
            <p>Unexpected error has happened.Try again later</p>
            </div>
            </body>
            </html>`
            )
            
            
    }
}

// update user data
export const updateUserEmail = async(req,res) => {
    const{newMailId , user} = req.body;
    try {
        await User.findByIdAndUpdate({_id:user._id} , {email:newMailId})
    } catch (error) {
        res.status(500).json({Message:"Internal server error"})
    }
}


export const updateProfilePicture = async(req,res) => {
    const{newImageUrl} = req.body;
    const{user} = req;
    try {
        const url = user.image;
const urlLength = url.split("/").length;
const imageId = url.split("/")[urlLength-1].split(".")[0];
if(process.env.DEFAULT_IMAGE_ID !== imageId){
     cloudinary.uploader.destroy(`images/${imageId}`)
}
await User.findOneAndUpdate({_id:user._id} , {image:newImageUrl})
res.status(200).json({Message:"profile picture updated"})
    } catch (error) {
        await User.findOneAndUpdate({_id:user._id} , {image:user.image})
        res.status(500).json({Message:"Internal server error",error})
    }
}


// sending password reset link
export const forgotPassword = async(req,res) => {
    const {email} = req.body;
    try {
       const user = await User.findOne({email:email});
       if(user === "null"){
        return res.status(400).json({Message:"User not found"});
       } 

    //    if user exists
    const createLink = generateLink(user.email);
    await User.findOneAndUpdate({email:user.email},{verification:(await createLink).verficationCode});
    const reset_link = `http://localhost:3000/reset_password/${(await createLink).verficationCode}/${(await createLink).token}`

    // sending reset link to user email id
    const context = `<html>
    <head>
    <style>
    #container{
        background-color:#152238;
        margin:10px;
    }
    h1,p{
        color: #009688 ;
    }
    #reset-btn{
        text-decoration:none;
        padding: 10px 20px;
        background-color: #009688 ;
        color: #e0f2f1 ;
        border-radius:3px;
    }
    #reset-btn:hover{
        background-color: #e0f2f1 ;
        color:#009688 ;
    }
    #texts{
        display:inline-block;
    }
    </style>
    </head>
    <body>
    <div id="container">
    <h1>PASSWORD RESET LINK</h1>
    <p>Hi , ${user.name} </p>
    <p>A request has been received to reset the password of your <u>TALKS</u> account <i>${user.email}</i> </p>
    <p id="texts">Click on the reset button to reset your password</p> &nbsp; <a target="_blank" href="${reset_link}" id="reset-btn"> reset </a>
    <p>This link expires in 5 minutes</p>
    <p>Thank you!</p>
    </div>
    </body>
    </html>`
    sendMail(user.email , "Password Reset Link" , context)

    res.status(200).json({Message:"password rest link sent to your registered email",link:reset_link})

    } catch (error) {
        res.status(500).json({Message:"Internal server error"})
    }
}

// authenticate the password reset link
export const verifyResetPasswordLink = async(req,res) => {
    const {verificationCode} = req.body;
    try {    
       const verify = await User.findOne({verification:verificationCode});
       const code = verify?.verification;
       console.log(verificationCode,verify?.verification,verify)
       if(verificationCode !== code){
        return res.status(400).json({Message:"Invalid link"})
       }

       res.status(200).send(true)
    } catch (error) {
        res.status(500).json({Message:"internal server error"})
    }
}

// reset password
export const resetPassword = async(req,res) => {
    const {verification , token} = req.params;
    const newPassword = await hashPassword(req.body.password);
    try {
        verifyTokenForReset(token);
        const user = await User.findOne({verification:verification});
        const verificationCode = user?.verification;
        if(verificationCode !== verification){
            return res.status(400).json({Message:"Link has already used to reset password"})
        }
        await User.findOneAndUpdate({verification:verification} , {verification:"null",password:newPassword} , {new : true});
        res.status(200).json({Message:"Password Changed Successfully"})
    } catch (error) {
        res.status(500).json({Message:"Token Expired"})
    }
}

// update notification
export const updateNotification = async(req,res) => {
    const {notification,userId} = req.body;
    try {
        if(userId.length > 1){
            userId.forEach(async(person)=>{
                let owner = await User.findOne({_id:person._id});
                console.log("new notification 1️⃣",notification);
                console.log("previous notification 2️⃣",owner.notification)
                // await User.findOneAndUpdate({_id:person._id} , {notification:[...owner.notification,notification]} , {new:true});
                await User.updateOne({_id:person._id} , {$push:{notification:notification}});
                console.log("updated notification 3️⃣",owner.notification)
        })

        // db.students.updateOne(
        //     { _id: 1 },
        //     { $push: { scores: 89 } }
        //  )
        } else {
            let owner = await User.findOne({_id:userId[0]._id});
            console.log("saving notification in🔔",owner.name,owner.notification)
            //  await User.findOneAndUpdate({_id:userId[0]._id} , {notification:notification} , {new:true});
             await User.updateOne({_id:userId[0]._id} , {$push:{notification:notification}});
        }
        
        res.status(200).json({Message:"Notification updated"})
    } catch (error) {
        res.status(500).json({Message:"Internal server error"})
    }
}

export const deleteNotification = async(req,res) => {
    const {userId , notification} = req.body;
    try {
        // if(userId.length > 1){
        //     userId.forEach(async(person)=>{
        //         let owner = await User.findOne({_id:person._id});
        //         console.log("new notification 1️⃣",notification);
        //         console.log("previous notification 2️⃣",owner.notification)
        //         // await User.findOneAndUpdate({_id:person._id} , {notification:[...owner.notification,notification]} , {new:true});
        //         await User.updateOne({_id:person._id} , {$push:{notification:notification}});
        //         console.log("updated notification 3️⃣",owner.notification)
        // })
        // } else {
        //     let owner = await User.findOne({_id:userId[0]._id});
        //     console.log("removing notification in🔔",owner.name)
        //      await User.findOneAndUpdate({_id:userId[0]._id} , {notification:notification});
        //     //  await User.updateOne({_id:userId[0]._id} , {$push:{notification:notification}});
        // }
        await User.updateOne({_id:userId} , {notification:notification});
        res.status(200).json({Message:"viewed notification removed"})
    } catch (error) {
        res.status(500).json({Message:"Internal server error"})
    }
}

export const getUser = async(req,res) => {
    const {userId} = req.params;
    try {
        const foundUser =  await User.findOne({_id:userId});
        // console.log(userId,foundUser)
        if(!foundUser){
            return res.status(400).json({Message:"user data not found"})
        }
        res.status(200).json({Message:"user data fetched",user:foundUser})
    } catch (error) {
        res.status(500).json({Message:"server error"})
    }
}