import express from 'express';
import { signInController, signOutController, signUpController ,systemRegisterRequest } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const authRouter = express.Router();
authRouter.post('/signin',signInController)
authRouter.post('/signup',signUpController);
authRouter.post('/signout',signOutController);
authRouter.post('/system-register-request',systemRegisterRequest)

//authRouter.put('/update-profile',authMiddleware,updateProfileController);

//authRouter.get('/check',authMiddleware,checkAuth)


export default authRouter;