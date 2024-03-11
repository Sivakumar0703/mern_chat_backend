// send user detail by using token
import jwt from 'jsonwebtoken';
import User from "../Model/user.model.js";

export const protect = async(req,res,next) => {
    let token;
   
    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // console.log('bearer token from header',req.headers.authorization.startsWith("Bearer")) // true
            // console.log(' header',req.headers.authorization); // Bearer <token>
            token = req.headers.authorization.split(" ")[1];

            // decode the token
            const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY); // we get an id => token is from login 
            req.user = await User.findById(decoded.id).select("-password"); // creating user object and attaching it to the req before this there is no user object inside req
            next();
        } catch (error) {
           res.status(400).json({message:"token verification failed"}) 
        }
    } else {
        return res.status(400).json({message:"Token is unavailable"})
    }
}