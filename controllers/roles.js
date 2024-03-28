import { RoleModel } from "../models/database/roles";

export class RoleController{
  static async getAll(req, res) {
    try {
      const roles = await RoleModel.getAll();
      res.json(roles);
    } catch (error) {
      res.status(404).json({ message: "Not found." });
    }    
  }

  static async getById(req, res) {
    const { id } = req.params;
    try {
      const role = await RoleModel.getById({ id });
      return res.json(role);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  static async findRoleByName(req, res) {
    try {
      const roleName = req.params.name; 
      const role = await RoleModel.getByName(roleName);
      if (!role) {
        return res.status(404).json({ message: "Role not found." });
      }
      res.json(role);
    } catch (error) {
      res.status(500).json({ message: "Error finding the role", error: error.message });
    }
  }

  static async createRole(req, res) {
    const role = req.body;
    try {
      const {newRole, isExisting} = await RoleModel.createRole({ input: role });

      if (isExisting) {
        return res.status(409).json({message: 'Role already exists', role: newRole})
      }

      res.status(201).json(newRole);
    } catch (error) {
      return res.status(500).json({message: 'Error creating role', error: error.message})
    }    
  }

  static async updateRole(req, res) {
    const role = req.body;
    const { id } = req.params

    try {
      const { conflict, updatedRole, existingRole} = await RoleModel.updateRole({ id, input: role });

      // Si hay un conflicto, envía un mensaje indicándolo
      if (conflict) {
        return res.status(409).json({
          message: "A role with the given name already exists.",
          existingRoleName: existingRole.roleName,
          existingRoleId: existingRole._id,
        });
      }
      // Si el rol se actualizó correctamente
      if (updatedRole) {
        return res.json({ message: 'Role Updated', role: updatedRole });
      } else {
        // Si el ID proporcionado no corresponde a ningun rol existente
        return res.status(404).json({ message: 'Role not found' });
      }
    } catch (error) {
      return res.status(500).json({message: 'Error updating role', error: error.message})
    }    
  }

  static async deleteRole(req, res) {
    const { id } = req.params

    try {
      const deleteRole = await RoleModel.deleteRole({ id })
      res.json({ message: 'Role Deleted', deleteRole })
    } catch (error) {
      return res.status(500).json({message: 'Error deleting role', error: error.message})
    }    
  }
}