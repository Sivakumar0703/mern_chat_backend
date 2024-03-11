import express from 'express';
// import {user , registerUser, loginUser, allUser} from '../Controller/user.controller.js' 
import {registerUser, loginUser, allUser, verifyUser, updateProfilePicture, forgotPassword, verifyResetPasswordLink, resetPassword, updateNotification, deleteNotification, getUser} from '../Controller/user.controller.js' 
import { generateSignature } from '../Utility/cloudinary.js';
import { protect } from '../Middleware/auth.middleware.js';


const router = express.Router();

// router.get('/',user)
router.post('/register-user',registerUser)
router.post('/login',loginUser)
router.get('/',protect,allUser)
router.get('/verify/:token',verifyUser)
router.get('/get_user/:userId',getUser)
router.patch('/update-profile-picture',protect,updateProfilePicture)
router.patch('/update_notification',protect,updateNotification)
// router.delete('/remove_notification/:userId/:notificationId',protect,deleteNotification)
router.patch('/remove_notification',protect,deleteNotification)
router.post('/forgot_password',forgotPassword)
router.post('/verify_code',verifyResetPasswordLink)
router.patch('/reset_password/:verification/:token' , resetPassword)

// cloudinary
router.post('/sign-upload',generateSignature)





export default router