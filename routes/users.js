import { Router } from "express";
import { UserController } from "../controllers/users.js";

export const UserRouter = Router();

UserRouter.post('/register', UserController.createUser)
UserRouter.post('/login', UserController.logInUser);
UserRouter.post('/logout', UserController.logOutUser);
UserRouter.post('/logout-all', UserController.logAuthAllUser);

UserRouter.get('/me', UserController.getUser);
UserRouter.patch('/me', UserController.updateUser);
UserRouter.delete('/me', UserController.deleteUser);