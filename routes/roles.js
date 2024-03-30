import { Router } from "express";
import { RoleController } from "../controllers/roles.js";
import auth from '../middleware/auth.js';
import authAdmin from '../middleware/auth.js';

export const RolesRouter = Router();

RolesRouter.get('/', auth, authAdmin, RoleController.getAll);
RolesRouter.get('/:id', auth, authAdmin, RoleController.getById);
RolesRouter.get('/search/:name', auth, authAdmin, RoleController.findRoleByName);

RolesRouter.post('/', auth, authAdmin, RoleController.createRole);

RolesRouter.put('/:id', auth, authAdmin, RoleController.updateRole);

RolesRouter.delete('/:id', auth, authAdmin, RoleController.deleteRole)