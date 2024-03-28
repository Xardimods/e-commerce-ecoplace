import { Router } from "express";
import { UserController } from "../controllers/users.js";
import auth from '../middleware/auth.js';

export const UserRouter = Router();

UserRouter.post('/register', UserController.createUser)
UserRouter.post('/login', UserController.logInUser);
UserRouter.post('/logout', auth, UserController.logOutUser);
UserRouter.post('/logout-all', auth, UserController.logAuthAllUser);

UserRouter.get('/me', auth, UserController.getUser);
UserRouter.patch('/me', auth, UserController.updateUser);
UserRouter.delete('/me', auth, UserController.deleteUser);