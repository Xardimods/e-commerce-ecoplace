import { Router } from "express";
import { UserController } from "../controllers/users";

export const UserRouter = Router();

UserRouter.get('/me', UserController.getUser);

UserRouter.post('/', UserController.createUser)
UserRouter.post('/login', UserController.logInUser);
UserRouter.post('/logout', UserController.logOutUser);
UserRouter.post('/logout-all', UserController.logAuthAllUser);

UserRouter.patch('/me', UserController.updateUser);

UserRouter.delete('/me', UserController.deleteUser);