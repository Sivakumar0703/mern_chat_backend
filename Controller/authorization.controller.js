 
 import jwt from 'jsonwebtoken';
 import bcrypt from 'bcryptjs'
 const secretKey = process.env.JWT_SECRET_KEY ;



//  creating a token for user
// payload contain user-id
export const createToken = async(payload) => {
    try {
        const token = jwt.sign(payload,secretKey,{expiresIn:"30d"});
    return token
    } catch (error) {
       console.log('error in token generation',error) 
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
