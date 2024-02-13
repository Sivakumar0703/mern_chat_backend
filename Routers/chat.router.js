import express from 'express';
import {user , registerUser, loginUser} from '../Controller/user.controller.js' 
import { generateSignature } from '../Utility/cloudinary.js';


const router = express.Router();

router.get('/',user)
router.post('/register-user',registerUser)
router.post('/login',loginUser)

// cloudinary
router.post('/sign-upload',generateSignature)





export default router