import { Router } from "express";
import { RoleController } from "../controllers/roles";

export const RolesRouter = Router();

RolesRouter.get('/', RoleController.getAll);
RolesRouter.get('/:id', RoleController.getById);
RolesRouter.get('/search/:name', RoleController.findRoleByName);

RolesRouter.post('/', RoleController.createRole);

RolesRouter.put('/:id', RoleController.updateRole);

RolesRouter.delete('/:id', RoleController.deleteRole)