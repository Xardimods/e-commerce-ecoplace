import mongoose from 'mongoose';

const roleSchema = mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
  },
});

const Role = mongoose.model("Role", roleSchema);

export class RoleModel{
  static async getAll() {
    return await Role.find();   
  }

  static async getById({id}) {
    return await Role.findById(id).select('roleName')
  }

  static async getByName(roleName) {
    return await Role.findOne({ roleName: { $regex: new RegExp(roleName, 'i') } });
  }

  static async createRole({input}) {
    const existingRole = await Role.findOne({
      roleName: input.roleName,
    });

    if (existingRole) {
      return { existingRole, isExisting: true };
    }
    const newRole = await Role.create(input);
    return { newRole, isExisting: false };
  }

  static async updateRole({id, input}) {
    const existingRole = await Role.findOne({
      roleName: input.roleName,
      _id: { $ne: id },
    });

    if (existingRole) {
      // Retornar algo que indique que ya existe un role con ese nombre
      return { conflict: true, existingRole };
    }

    // Si no hay conflicto, procede a actualizar el role
    const updatedRole = await Role.findByIdAndUpdate(id, input, {
      new: true,
    });
    return { conflict: false, updatedRole };
  }

  static async deleteRole({id}) {
    const deleteRole = await Role.findByIdAndDelete(id);
    return deleteRole ? true : false;
  }
}