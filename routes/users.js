import { Router } from "express";
import { UserController } from "../controllers/users";

export const UserRouter = Router();

UserRouter.get('/');
UserRouter.get('/me');

UserRouter.post('/')
UserRouter.post('/login');

UserRouter.patch('/me');

UserRouter.delete('/me');