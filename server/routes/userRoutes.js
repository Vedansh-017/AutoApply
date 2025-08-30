import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controllers/usercontoller.js';
import { getProfile ,updateProfile } from '../controllers/usercontoller.js';

const userRouter = express.Router();     
userRouter.get('/data',userAuth,getUserData);
userRouter.get("/profile", userAuth, getProfile);
userRouter.put("/profile", userAuth, updateProfile);

export default userRouter;