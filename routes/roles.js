import { Router } from "express";
import { RoleController } from "../controllers/roles.js";
import auth from '../middleware/auth.js';
import { authRole } from '../middleware/auth.js';

export const RolesRouter = Router();

RolesRouter.get('/', auth, authRole(['Admin']), RoleController.getAll);
RolesRouter.get('/:id', auth, authRole(['Admin']), RoleController.getById);
RolesRouter.get('/search/:name', auth, authRole(['Admin']), RoleController.findRoleByName);

RolesRouter.post('/', auth, authRole(['Admin']), RoleController.createRole);

RolesRouter.put('/:id', auth, authRole(['Admin']), RoleController.updateRole);

RolesRouter.delete('/:id', auth, authRole(['Admin']), RoleController.deleteRole)