import { Router } from "express";
import { UserController } from "../controllers/users.js";
import auth from '../middleware/auth.js';
import {authRole} from '../middleware/auth.js';

export const UserRouter = Router();

UserRouter.post('/register', UserController.createUser)
UserRouter.post('/login', UserController.logInUser);
UserRouter.post('/logout', auth, UserController.logOutUser);
UserRouter.post('/logout-all', auth, UserController.logAuthAllUser);

UserRouter.get('/me', auth, authRole(['Customer']), UserController.getUser);
UserRouter.patch('/me', auth, authRole(['Customer']), UserController.updateUser);
UserRouter.delete('/me', auth, authRole(['Customer']), UserController.deleteUser);