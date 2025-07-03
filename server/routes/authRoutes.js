import express from 'express';
import { isAccountVerified, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authcontoller.js';
import { login , logout} from '../controllers/authcontoller.js';
import userAuth from '../middleware/userAuth.js';


const authRouter = express.Router();

authRouter.post('/register',register); 
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp);
authRouter.post('/verify-account',userAuth,verifyEmail);
authRouter.get('/is-auth',userAuth,isAccountVerified);
authRouter.post('/send-reset-otp',sendResetOtp);
authRouter.post('/reset-password',resetPassword);
export default authRouter;