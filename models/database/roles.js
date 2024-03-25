import mongoose from 'mongoose';

const roleSchema = mongoose.Schema({
  roleName: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: [
    {
      // esto creo que seria opcional, dependiendo de la complejidad de nuestros requerimientos de permisos pero ya veremeos
      type: String,
    },
  ],
});

roleSchema.virtual("id").get(function () {
  // esto para quitarle la parte _id  el guion bajo para mas comodidad
  return this._id.toHexString();
});

roleSchema.set("toJSON", {
  virtuals: true,
});

exports.Role = mongoose.model("Role", roleSchema);
