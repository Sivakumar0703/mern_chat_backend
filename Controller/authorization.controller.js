 
 import jwt from 'jsonwebtoken';
 import bcrypt from 'bcryptjs'
 const secretKey = process.env.JWT_SECRET_KEY ;



//  creating a token for user
// payload contain user-id 
export const createToken = async(payload) => {
    try {
        // const token = jwt.sign(payload,secretKey,{expiresIn:"30d"});
        const token = jwt.sign(payload,secretKey);
    return token
    } catch (error) {
       console.log('error in token generation',error) 
    }
}

// verify token
export const verifyToken = async(token) => {
    try {
        const decode = jwt.verify(token , secretKey);
        return decode._id
    } catch (error) {
        console.log('error in token verification',error)
    }
}

// hash user password
export const hashPassword = async(password)=>{
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(password,salt);
    return hashedPassword
}

// compare password (database & login)
// password => client side & hashedPassword => Database
export const hashCompare= async(password,hashedPassword)=> { 
    return await bcrypt.compare(password,hashedPassword)

}

// generate password reset link
export const generateLink = async(email) => {
    const payload = {email:email}
    const verification = Math.random().toString(36).substring(2,7);
    const token = jwt.sign(payload , secretKey ,{expiresIn:"5m"})
    return {token:token , verficationCode:verification}
}

// verify the token for password reset
export const verifyTokenForReset = (token) => {
    return jwt.verify(token,secretKey)
}