import express from 'express';
// import {user , registerUser, loginUser, allUser} from '../Controller/user.controller.js' 
import {registerUser, loginUser, allUser} from '../Controller/user.controller.js' 
import { generateSignature } from '../Utility/cloudinary.js';
import { protect } from '../Middleware/auth.middleware.js';


const router = express.Router();

// router.get('/',user)
router.post('/register-user',registerUser)
router.post('/login',loginUser)
router.get('/',protect,allUser)

// cloudinary
router.post('/sign-upload',generateSignature)





export default router