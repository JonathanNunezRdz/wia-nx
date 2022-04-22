import { Router } from 'express';
import authController from '../controllers/auth';

const authRouter = Router();

authRouter.get('/login', authController.getLogin);
authRouter.get('/test', authController.test);
authRouter.post('/register', authController.register);
authRouter.post('/login', authController.postLogin);
authRouter.post('/logout', authController.postLogout);

export default authRouter;
