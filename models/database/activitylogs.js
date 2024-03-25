const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE', 'VIEW', 'OTHER'], // algunas de acciones
  },
  description: {
    type: String,
    required: true
  },
  ipaddress: {
    type: String,
    required: false // Depende de si siempre tendrás acceso a esta info
  },
  location: {
    type: String,
    required: false // Igual que IP, puede ser opcional
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: mongoose.Schema.Types.Mixed // Para almacenar información adicional específica de la acción
});

activityLogSchema.virtual("id").get(function () {
  // esto para quitarle la parte _id  el guion bajo para mas comodidad
  return this._id.toHexString();
});

activityLogSchema.set("toJSON", {
  virtuals: true,
});

exports.ActivityLog = mongoose.model('ActivityLog', activityLogSchema);