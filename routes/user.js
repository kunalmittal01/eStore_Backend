import express from 'express';
import { loginUser, logOut, registerAsSeller, registerUser } from '../controller/user.js';
const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/register-seller', registerAsSeller);
userRouter.post('/login', loginUser);
userRouter.get('/logout', logOut);

export default userRouter;